# crm-app-bypass

CRM-система управления байпас-процессами и заявками операторов Gazprom.

Проект разработан с использованием **React 19**, **TypeScript**, **Vite** и архитектурной методологии **Feature-Sliced Design (FSD 3.0)**.

---

## 🚀 Инструкция по развертыванию

### 📌 Системные требования

Перед началом установки убедитесь, что на компьютере установлены следующие компоненты:
1. **Node.js**: Версия **LTS** (рекомендуется `v20.x` или выше, минимально поддерживаемая `v18.x`).
2. **npm**: Менеджер пакетов (поставляется вместе с Node.js).
3. **Git**: Для клонирования репозитория.

---

### 📂 Шаг 1. Получение исходного кода

Склонируйте репозиторий с помощью Git или скопируйте папку с проектом:

```bash
git clone <URL_РЕПОЗИТОРИЯ>
cd crm-app-bypass
```

---

### ⚙️ Шаг 2. Настройка переменных окружения (`.env`)

Скопируйте пример файла конфигурации и укажите адрес бэкенда:

* **Windows (PowerShell):** `copy .env.example .env`
* **Linux / macOS:** `cp .env.example .env`

Откройте `.env` и задайте необходимые переменные. Основные из них:
- `VITE_API_URL` — адрес API бэкенда (например, `http://192.168.1.240:82` или `/api` для относительных запросов при проксировании).
- `VITE_TEST_API_URL` — адрес тестового API (по умолчанию `http://localhost:3001`).
- `VITE_MOCK_API` — флаг включения моков (при необходимости).

---

### 📦 Шаг 3. Установка зависимостей

Установите все npm-зависимости, используя:

```bash
npm install
```

---

### 💻 Шаг 4. Запуск в режиме разработки

Для запуска локального сервера разработки Vite выполните:

```bash
npm run dev
```

Локальный адрес приложения по умолчанию: `http://localhost:5173/`

---

## 🛠️ Скрипты и Инструменты

В проекте настроены скрипты для тестирования, проверки кода и архитектуры:

* `npm run dev` — Запуск dev-сервера с HMR.
* `npm run build` — Сборка оптимизированных статических файлов проекта для продакшена в папку `dist/`.
* `npm run preview` — Предпросмотр локальной сборки из папки `dist/`.
* `npm run test` — Запуск юнит-тестов (Jest).
* `npm run fsd` — Проверка соблюдения правил Feature-Sliced Design v3.0 с помощью Steiger.
* `npm run lint` — Проверка кода с помощью ESLint.
* `npm run lint:fix` — Автоматическое исправление простых ошибок линтера.

---

## 🌐 Настройка Production-хостинга (Nginx)

Поскольку приложение является SPA (Single Page Application), для правильной работы роутинга при перезагрузке страниц веб-сервер должен перенаправлять все запросы на `index.html`.

Пример базового конфигурационного файла Nginx для хостинга:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/crm-app-bypass/dist;
    index index.html;

    # SPA-роутинг: перенаправление на index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Проксирование API-запросов к FastAPI бэкенду
    location /api/ {
        proxy_pass http://192.168.1.240:82/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Кеширование статики
    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg)$ {
        expires 6M;
        access_log off;
        add_header Cache-Control "public";
    }
}
```
