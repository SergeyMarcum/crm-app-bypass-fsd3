# 🧠 Context: System Prompt & Developer Profile

## Роль и инструменты
- **Инструментарий**: Antigravity, Antigravity IDE, Obsidian, Figma.
- **Стек технологий**: React, TypeScript, Vite, FSD (Feature-Sliced Design) v3.0, Zustand, React Query (TanStack Query), Tailwind / CSS Modules.

## Принципы работы
1. **Единый источник контекста**: Все архитектурные решения, правила нейминга, структуры баз данных и ТЗ берутся из `Obsidian/Vault/`.
2. **Связка Figma ➔ Obsidian ➔ Antigravity IDE**:
   - Дизайн-токены и спецификации экранов экспортируются в `Obsidian/Vault/resources/`.
   - Компоненты верстаются строго по токенам из Obsidian.
3. **Метод Wiki (Карпатов)**:
   - Все новые сущности и бизнес-логика документируются в атомарных файлах `Obsidian/Vault/wiki/` с перекрёстными ссылками `[[link]]`.
4. **FSD 3.0 Strict Compliance**:
   - Соблюдение слоёв: `app`, `pages`, `widgets`, `features`, `entities`, `shared`.
   - Соблюдение правил импортов и публичных API (`index.ts`).
