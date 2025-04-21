# Название среза (например, Feature: Auth)

## Описание

Описание назначения среза (например, управление авторизацией пользователей).

## Публичный API

- Компоненты: `LoginForm`
- Хуки: `useAuth`
- Типы: `AuthState`

## Зависимости

- Внешние: `@mui/material`, `react-hook-form`
- Внутренние: `@shared/api/auth`, `@shared/lib/schemas`

## Использование

```tsx
import { LoginForm, useAuth } from "@features/auth";
```
