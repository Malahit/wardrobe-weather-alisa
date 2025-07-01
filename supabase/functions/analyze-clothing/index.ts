
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, userId } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'Missing image data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!openAIApiKey || openAIApiKey.startsWith('github_')) {
      console.log('OpenAI API key not configured properly');
      // Возвращаем fallback результат
      const fallbackResult = {
        name: 'Предмет одежды',
        category: 'other',
        color: 'неопределенный',
        season: 'all-season',
        brand: null,
        confidence: 0.7,
        description: 'Добавлено без анализа - требуется настройка OpenAI API'
      };
      
      return new Response(JSON.stringify(fallbackResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Analyzing clothing image for user:', userId);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Ты эксперт по анализу одежды. Проанализируй изображение и верни JSON с полями:
            - name: название предмета одежды
            - category: категория (top, bottom, shoes, outerwear, accessories)
            - color: основной цвет
            - season: сезон (winter, spring, summer, autumn, all-season)
            - brand: бренд (если виден, иначе null)
            - confidence: уверенность в анализе (0-1)
            - description: краткое описание
            
            Отвечай только валидным JSON без дополнительного текста.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Проанализируй эту одежду:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${image}`
                }
              }
            ]
          }
        ],
        max_tokens: 300
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid OpenAI response');
    }

    let analysisResult;
    try {
      analysisResult = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback анализ
      analysisResult = {
        name: 'Предмет одежды',
        category: 'other',
        color: 'неопределенный',
        season: 'all-season',
        brand: null,
        confidence: 0.5,
        description: 'Автоматически добавлено'
      };
    }

    console.log('Analysis result:', analysisResult);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-clothing function:', error);
    
    // Возвращаем fallback результат вместо ошибки
    const fallbackResult = {
      name: 'Предмет одежды',
      category: 'other',
      color: 'неопределенный',
      season: 'all-season',
      brand: null,
      confidence: 0.3,
      description: 'Ошибка анализа, добавлено вручную'
    };
    
    return new Response(JSON.stringify(fallbackResult), {
      status: 200, // Возвращаем 200 с fallback данными
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
