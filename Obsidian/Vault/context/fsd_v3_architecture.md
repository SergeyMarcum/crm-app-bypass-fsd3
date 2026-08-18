# 🏗️ Context: FSD v3.0 Architecture

Проект `crm-app-bypass` строится по методологии **Feature-Sliced Design (FSD) v3.0**.

## Иерархия слоев (Сверху вниз)

1. **`app/`** — Инициализация приложения, глобальные провайдеры (MUI/Query), роутинг, темы, глобальные стили.
2. **`pages/`** — Композиционные страницы приложения (Dashboard, Login, Bypass CRM и др.).
3. **`widgets/`** — Крупные независимые блоки интерфейса (Header, Sidebar, CRM Tables, Process Boards).
4. **`features/`** — Пользовательские сценарии и взаимодействия (создание заявки, фильтрация, байпас-операции).
5. **`entities/`** — Бизнес-сущности (User, BypassRequest, Customer, Operator). Содержат типы, store, UI-карточки.
6. **`shared/`** — Переиспользуемый инфраструктурный код (UI kit, API clients, helpers, types, constants).

## Правила импорта
- Импорты разрешены только **сверху вниз** (`pages` может импортировать `widgets`, `features`, `entities`, `shared`, но НЕ `app`).
- Каждый слайс/модуль обязан иметь явный **Публичный API** (`index.ts`). Импорты из внутренних глубин слайса запрещены.
