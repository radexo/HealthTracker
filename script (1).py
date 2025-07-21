# Create preload script for security
preload_js_content = '''const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Database operations
    dbQuery: (sql, params) => ipcRenderer.invoke('db-query', sql, params),
    dbRun: (sql, params) => ipcRenderer.invoke('db-run', sql, params),
    
    // File operations
    exportData: (format) => ipcRenderer.invoke('export-data', format),
    backupDatabase: () => ipcRenderer.invoke('backup-database'),
    
    // App info
    getAppInfo: () => ipcRenderer.invoke('get-app-info'),
    
    // Utility
    platform: process.platform,
    
    // Event listeners
    onMenuAction: (callback) => ipcRenderer.on('menu-action', callback),
    removeMenuListener: () => ipcRenderer.removeAllListeners('menu-action')
});

// Global app metadata
contextBridge.exposeInMainWorld('APP_METADATA', {
    name: 'HealthTracker 2025',
    version: '1.0.0',
    description: 'Профессиональное приложение для отслеживания показателей тела',
    author: 'HealthTracker Team',
    isElectron: true,
    buildDate: new Date().toISOString()
});

console.log('✅ Electron preload script loaded successfully');
'''

# Save preload.js
with open('preload.js', 'w', encoding='utf-8') as f:
    f.write(preload_js_content)

print("✅ preload.js создан для безопасности Electron")

# Create installation and build instructions
readme_content = '''# HealthTracker 2025 - Desktop Edition

Профессиональное Windows приложение для отслеживания показателей тела, тренировок и здоровья с локальной SQLite базой данных.

## 🚀 Возможности

### 📊 Отслеживание показателей тела
- **Интерактивная SVG-фигура человека** с визуализацией изменений
- Измерение всех основных объемов (шея, грудь, талия, бедра, руки, ноги)
- Цветовая индикация прогресса (зеленые/красные линии)
- Автоматический расчет ИМТ
- Графики динамики изменений для каждого параметра

### 🍎 Модуль питания
- Дневник питания по приемам пищи
- Калькулятор БЖУ с интерактивными диаграммами  
- База продуктов с функцией поиска
- Анализ макронутриентов и калорийности

### 💪 Тренировки
- Библиотека готовых программ тренировок
- Таймер упражнений с возможностью паузы
- Трекинг подходов, повторений и весов
- Календарь тренировок с планированием

### 😴 Сон и восстановление  
- Трекер качества и продолжительности сна
- Анализ фаз сна с детальной статистикой
- График сна по дням недели
- Дневник самочувствия

### 💧 Водный баланс
- Анимированный индикатор заполнения стакана
- Быстрые кнопки для добавления объемов
- График почасового потребления

### 📈 Аналитика и цели
- Система постановки персональных целей
- Сравнение: текущие показатели → изменения → цель
- Сводные графики всех показателей здоровья
- Корреляционный анализ между показателями

## 🛠️ Установка для разработки

### Предварительные требования
- Node.js 18+ 
- npm или yarn
- Windows 10/11 (для сборки .exe)
- Python 3.8+ (для сборки sqlite3)
- Visual Studio Build Tools 2022

### 1. Клонирование и установка зависимостей
```bash
# Установите зависимости
npm install

# Пересоберите нативные модули для Electron
npm run postinstall
```

### 2. Запуск в режиме разработки
```bash
# Запуск приложения в dev режиме
npm run dev

# Или обычный запуск
npm start
```

### 3. Сборка Windows приложения
```bash
# Сборка для Windows x64
npm run build-win64

# Сборка для Windows x32  
npm run build-win32

# Сборка для всех архитектур Windows
npm run build-win

# Создание portable версии
npm run pack
```

## 📦 Структура проекта

```
healthtracker-2025/
├── index.html          # Главный HTML файл
├── style.css          # Стили приложения
├── app.js             # JavaScript логика приложения
├── main.js            # Главный процесс Electron
├── preload.js         # Preload скрипт для безопасности
├── package.json       # Настройки Node.js и Electron
├── assets/           # Иконки и ресурсы
│   ├── icon.ico      # Иконка приложения для Windows
│   └── ...
├── database/         # База данных SQLite  
│   └── healthtracker.db
├── dist/            # Собранные приложения
│   ├── win-unpacked/
│   └── HealthTracker-2025-Setup-1.0.0.exe
└── README.md        # Документация
```

## 🗄️ База данных

Приложение использует локальную SQLite базу данных со следующими таблицами:

- **users** - профили пользователей  
- **body_measurements** - измерения тела (вес, объемы)
- **nutrition** - питание и БЖУ
- **workouts** - тренировки  
- **sleep** - данные о сне
- **water** - потребление воды
- **goals** - цели пользователя
- **settings** - настройки приложения

## 🔧 Настройка сборки

### Windows Installer (NSIS)
```json
{
  "nsis": {
    "oneClick": false,
    "allowElevation": true,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "shortcutName": "HealthTracker 2025"
  }
}
```

### Portable версия
```bash
npm run pack
# Создаст папку dist/win-unpacked с portable версией
```

## 📋 Системные требования

### Минимальные
- Windows 10 x64 / Windows 11
- 4 GB RAM
- 200 MB свободного места
- Разрешение экрана: 1280x720

### Рекомендуемые  
- Windows 11 x64
- 8 GB RAM
- 500 MB свободного места  
- Разрешение экрана: 1920x1080+

## 🔄 Обновления

Приложение поддерживает автоматические обновления через GitHub Releases. Новые версии будут скачиваться и устанавливаться автоматически.

## 🛡️ Безопасность

- Все данные хранятся локально в зашифрованной SQLite базе
- Отключен nodeIntegration в renderer процессе
- Используется contextIsolation для изоляции кода
- Безопасный preload скрипт для IPC коммуникации

## 📊 Экспорт данных

- Экспорт в CSV для анализа в Excel
- Экспорт в JSON для импорта в другие приложения  
- Резервное копирование базы данных
- Импорт данных из других фитнес-приложений

## 🎨 Темизация

- Светлая и темная темы
- Автоматическое переключение по времени суток
- Настраиваемые цветовые схемы
- Адаптивный дизайн для всех разрешений

## 🤝 Поддержка

Для вопросов и предложений:
- Email: support@healthtracker2025.com
- GitHub Issues: [создать issue](https://github.com/healthtracker/healthtracker-2025/issues)

## 📄 Лицензия

MIT License - см. файл LICENSE для подробностей.

---

**HealthTracker 2025** - ваш персональный помощник в достижении целей по здоровью и фитнесу! 💪🏃‍♂️🥗
'''

# Save README.md
with open('README.md', 'w', encoding='utf-8') as f:
    f.write(readme_content)

print("✅ README.md создан с полной документацией")

# Create build scripts
build_script_content = '''@echo off
echo ==============================================
echo    HealthTracker 2025 - Windows Build Script
echo ==============================================
echo.

echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b %errorlevel%
)

echo.
echo [2/5] Rebuilding native modules for Electron...
call npm run postinstall  
if %errorlevel% neq 0 (
    echo ❌ Failed to rebuild native modules
    pause
    exit /b %errorlevel%
)

echo.
echo [3/5] Cleaning previous builds...
if exist "dist" rmdir /s /q "dist"

echo.
echo [4/5] Building Windows application...
call npm run build-win
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b %errorlevel%
)

echo.
echo [5/5] Build completed successfully!
echo.
echo ✅ Windows installer: dist\\HealthTracker-2025-Setup-1.0.0.exe
echo ✅ Portable version: dist\\win-unpacked\\
echo.
echo Build artifacts saved in 'dist' directory
pause
'''

# Save build script
with open('build-windows.bat', 'w', encoding='utf-8') as f:
    f.write(build_script_content)

print("✅ build-windows.bat создан для автоматической сборки")

# Create development script  
dev_script_content = '''@echo off
echo ==============================================
echo   HealthTracker 2025 - Development Mode
echo ==============================================
echo.

echo Installing/updating dependencies...
call npm install

echo.
echo Starting application in development mode...
echo Press Ctrl+C to stop the application
echo.
call npm run dev
'''

# Save dev script
with open('start-dev.bat', 'w', encoding='utf-8') as f:
    f.write(dev_script_content)

print("✅ start-dev.bat создан для разработки")

print("\n🎉 Все файлы для Electron приложения созданы успешно!")
print("\n📁 Структура проекта:")
print("   ├── index.html (веб-интерфейс)")
print("   ├── style.css (стили)")  
print("   ├── app.js (JavaScript логика)")
print("   ├── main.js (главный процесс Electron)")
print("   ├── preload.js (безопасность)")
print("   ├── package.json (настройки)")
print("   ├── README.md (документация)")
print("   ├── build-windows.bat (скрипт сборки)")
print("   └── start-dev.bat (скрипт разработки)")

print("\n🚀 Для создания Windows .exe:")
print("   1. Установите Node.js 18+")
print("   2. Запустите build-windows.bat") 
print("   3. Готовый .exe будет в папке dist/")