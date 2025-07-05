
# 🤖 Android Setup - Полное руководство по настройке

## 📋 Системные требования

### Минимальные требования:
- **ОС**: Ubuntu 18.04+ / Debian 10+ / Fedora 28+ / любой современный Linux
- **RAM**: 8 GB (рекомендуется 16 GB)
- **Свободное место**: 30+ GB
- **Java**: JDK 11 или выше
- **Node.js**: версия 16+

---

## 🛠 Пошаговая установка всех необходимых программ

### Шаг 1: Установка Node.js и npm

```bash
# Установка через NodeSource (рекомендуется)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка установки
node --version
npm --version
```

### Шаг 2: Установка Java Development Kit (JDK)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-11-jdk

# Fedora/CentOS
sudo dnf install java-11-openjdk-devel

# Проверка установки
java -version
javac -version

# Настройка JAVA_HOME
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$PATH:$JAVA_HOME/bin' >> ~/.bashrc
source ~/.bashrc
```

### Шаг 3: Установка Android Studio

```bash
# Скачиваете Android Studio с официального сайта
# https://developer.android.com/studio

# Распаковка (замените путь на актуальный)
sudo tar -xzf android-studio-*-linux.tar.gz -C /opt/
sudo ln -sf /opt/android-studio/bin/studio.sh /usr/local/bin/android-studio

# Запуск Android Studio
android-studio
```

**В Android Studio выполните:**
1. Следуйте мастеру первоначальной настройки
2. Установите Android SDK (API level 33+)
3. Установите Android SDK Build-Tools
4. Установите Android Emulator
5. Создайте виртуальное устройство (AVD)

### Шаг 4: Настройка переменных окружения

```bash
# Добавьте в ~/.bashrc или ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator

# Применить изменения
source ~/.bashrc
```

### Шаг 5: Проверка установки

```bash
# Проверка доступности команд
adb version
emulator -list-avds
```

---

## 📱 Установка и настройка вашего приложения

### Шаг 1: Клонирование проекта

```bash
# Экспортируйте проект в GitHub через Lovable
# Затем клонируйте:
git clone https://github.com/ваш-username/ваш-репозиторий.git
cd ваш-репозиторий
```

### Шаг 2: Установка зависимостей

```bash
# Установка всех зависимостей
npm install

# Добавление Android платформы
npx cap add android
```

### Шаг 3: Первая сборка

```bash
# Сборка веб-версии
npm run build

# Синхронизация с Android
npx cap sync android

# Открытие в Android Studio
npx cap open android
```

### Шаг 4: Настройка в Android Studio

1. **Подождите индексации проекта**
2. **Настройте подписание приложения:**
   - Build → Generate Signed Bundle/APK
   - Создайте keystore для релизных сборок
3. **Настройте эмулятор или подключите устройство**

### Шаг 5: Запуск приложения

```bash
# Запуск на эмуляторе
npx cap run android

# Или запуск на подключенном устройстве
npx cap run android --target device
```

---

## ✏️ Рабочий процесс разработки и редактирования

### Основные команды для разработки

```bash
# 🔄 После любых изменений в коде:
npm run build
npx cap sync android

# 🏃‍♂️ Быстрый запуск для тестирования:
npm run build && npx cap sync android && npx cap run android

# 🔍 Отладка веб-версии в браузере:
npm run dev

# 📱 Открыть проект в Android Studio:
npx cap open android

# 🧹 Очистка кэша (при проблемах):
npm run build
npx cap clean android
npx cap sync android
```

### Структура проекта для редактирования

```
📁 src/
├── 📁 components/          # React компоненты
├── 📁 pages/              # Страницы приложения
├── 📁 hooks/              # Кастомные React хуки
├── 📁 services/           # Сервисы и API
├── 📁 styles/            # CSS файлы
└── 📁 integrations/      # Интеграции (Supabase)

📁 android/               # Android специфичные файлы
📄 capacitor.config.ts    # Конфигурация Capacitor
```

### Где редактировать что:

- **🎨 UI/Дизайн**: `src/components/` и `src/pages/`
- **⚙️ Логика**: `src/hooks/` и `src/services/`  
- **🎭 Стили**: `src/styles/` и Tailwind классы
- **📱 Мобильные настройки**: `capacitor.config.ts`
- **🤖 Android настройки**: `android/app/src/main/`

---

## 🚀 Деплой и публикация

### Создание APK для тестирования

```bash
# В Android Studio:
# Build → Build Bundle(s)/APK(s) → Build APK(s)
# APK будет в android/app/build/outputs/apk/debug/
```

### Создание релизной версии

```bash
# Build → Generate Signed Bundle/APK
# Выберите Android App Bundle для Google Play
```

### Публикация в Google Play Store

1. **Создайте аккаунт Google Play Developer** ($25 разовый платеж)
2. **Создайте новое приложение** в консоли
3. **Загрузите AAB файл** в раздел Production
4. **Заполните описание** и скриншоты
5. **Отправьте на ревью**

---

## 🔧 Решение частых проблем

### Проблема: Gradle sync failed
```bash
# Решение:
cd android
./gradlew clean
cd ..
npx cap sync android
```

### Проблема: JAVA_HOME не найдена
```bash
# Найдите путь к Java:
sudo find /usr -name "java" -type f 2>/dev/null | grep bin

# Установите правильный JAVA_HOME:
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
```

### Проблема: Android SDK не найден
```bash
# Проверьте путь к SDK:
ls $ANDROID_HOME
# Должны быть папки: platform-tools, platforms, build-tools
```

### Проблема: Приложение не запускается
```bash
# Проверьте логи:
adb logcat | grep -i "StyleAssistant"
```

---

## 📞 Полезные ресурсы

- **📖 Документация Capacitor**: https://capacitorjs.com/docs
- **🤖 Android Developer Docs**: https://developer.android.com/docs
- **💬 Сообщество Lovable**: https://discord.com/channels/1119885301872070706/1280461670979993613
- **🎓 YouTube гайды**: https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO

---

## ✅ Чек-лист готовности к разработке

- [ ] ✅ Node.js и npm установлены
- [ ] ✅ Java JDK 11+ установлен и настроен
- [ ] ✅ Android Studio установлен
- [ ] ✅ Android SDK настроен
- [ ] ✅ Переменные окружения настроены
- [ ] ✅ Проект склонирован с GitHub
- [ ] ✅ Зависимости установлены (`npm install`)
- [ ] ✅ Android платформа добавлена (`npx cap add android`)
- [ ] ✅ Первая сборка успешна (`npm run build && npx cap sync`)
- [ ] ✅ Приложение запускается (`npx cap run android`)

**🎉 Поздравляю! Ваше Android приложение готово к разработке!**

---

## 📝 Заметки для быстрого старта

1. **Ежедневный рабочий процесс:**
   ```bash
   # Внесли изменения в код → выполните:
   npm run build && npx cap sync android && npx cap run android
   ```

2. **Для отладки UI используйте:**
   ```bash
   npm run dev  # Быстрее чем пересборка для Android
   ```

3. **Синхронизация с Lovable:**
   - Работайте в Lovable → изменения автоматически попадают в GitHub
   - Периодически делайте `git pull` в локальном проекте

4. **Тестирование на реальном устройстве:**
   - Включите "Режим разработчика" на Android
   - Включите "Отладка по USB"
   - Подключите кабелем и разрешите отладку
