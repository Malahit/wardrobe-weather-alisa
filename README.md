# StyleAssistant AI

Персональный стилист с ИИ для подбора одежды по погоде и вашему гардеробу.

## Развертывание на Vercel

### Быстрое развертывание

1. Нажмите кнопку ниже для автоматического развертывания:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/yourrepo)

2. Подключите ваш GitHub репозиторий
3. Настройте переменные окружения
4. Нажмите "Deploy"

### Ручное развертывание

1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. В корне проекта выполните:
```bash
vercel
```

3. Следуйте инструкциям CLI

### Переменные окружения для Vercel

Проект уже настроен с Supabase, переменные не требуются.

## Мобильная адаптация

Приложение оптимизировано для:
- iPhone (включая модели с notch)
- iPad
- Android устройства
- PWA установка на домашний экран

### Особенности мобильной версии:
- Адаптивный дизайн для всех размеров экранов
- Safe area insets для iPhone
- Touch-friendly интерфейс
- Оптимизированные шрифты и отступы
- Поддержка жестов свайпа

## Технологии

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Capacitor (для нативных функций)

## PWA Features

- Установка на домашний экран
- Offline кэширование
- Адаптивные иконки
- Полноэкранный режим

## Разработка

### Локальная разработка

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/93c184c1-9df6-4365-b82a-c8ca9d5aff1c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/93c184c1-9df6-4365-b82a-c8ca9d5aff1c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
