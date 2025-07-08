// src/widgets/add-parameter-modal/README.md

# AddParameterModal

Модальное окно для добавления параметра проверки объекта.

## Возможности:

- Выбор параметра из глобального списка
- Формирование списка несоответствий
- Добавление и удаление несоответствий
- Сохранение параметра и его несоответствий через API

## Props:

```ts
{
  open: boolean;
  onClose: () => void;
}
```

## Используемые API:

- `getAllParameters`
- `getAllIncongruities`
- `saveObjectTypeParam`
- `addParameterIncongruity`

## Zustand Store: useAddParameterStore

- `list: Incongruity[]`
- `set`, `add`, `remove`, `reset`

## Пример:

```tsx
<AddParameterModal open={true} onClose={() => setOpen(false)} />
```

---

---

## ✅ Переиспользуемые модалки: Add & Edit Parameter

### 📁 Структура:

```
src/widgets/
├── add-parameter-modal/
│   ├── ui.tsx
│   ├── types.ts
│   ├── index.ts
│   ├── model/store.ts
│   └── README.md
├── edit-parameter-modal/
│   ├── ui.tsx
│   ├── types.ts
│   ├── index.ts
│   ├── model/store.ts
│   └── README.md
```

---

### 📌 `add-parameter-modal`

#### 👉 Назначение:

Модалка добавления нового параметра проверки объекта вместе с несоответствиями.

#### 📥 Props: `AddParameterModalProps`

```ts
{
  open: boolean;
  onClose: () => void;
  objectTypeId: number;
}
```

#### 📦 Логика:

- Получает список всех параметров (`/parameters`).
- Получает список всех несоответствий (`/cases-of-non-compliance`).
- Добавляет выбранный параметр к `objectTypeId` через `/edit-object-type`.
- Добавляет несоответствия к выбранному параметру.

#### 🧠 Zustand Store: `useAddParameterStore`

- `list`: выбранные несоответствия.
- `add`, `remove`, `reset`

#### 🧪 Юнит-тесты: `__tests__/ui.test.tsx`

---

### 📌 `edit-parameter-modal`

#### 👉 Назначение:

Редактирование имени параметра и управление его несоответствиями.

#### 📥 Props: `ParamEditModalProps`

```ts
{
  open: boolean;
  onClose: () => void;
  parameterId: number;
  parameterName: string;
}
```

#### 📦 Логика:

- Получает актуальные несоответствия для параметра (`/all-cases-of-parameter-non-compliance`).
- Позволяет редактировать имя параметра через `/edit-parameter`.
- Добавляет и удаляет несоответствия через API `/edit-parameter-non-compliance` и `/delete-parameter-non-compliance`.

#### 🧠 Zustand Store: `useEditIncongruityStore`

- `list`: активные несоответствия.
- `set`, `add`, `remove`, `reset`

#### 🧪 Юнит-тесты: `__tests__/ui.test.tsx`

---

### 📁 Использование:

```tsx
import { AddParameterModal } from '@/widgets/add-parameter-modal';
import { EditParameterModal } from '@/widgets/edit-parameter-modal';

<AddParameterModal
  open={isAddOpen}
  onClose={() => setAddOpen(false)}
  objectTypeId={selectedTypeId}
/>

<EditParameterModal
  open={isEditOpen}
  onClose={() => setEditOpen(false)}
  parameterId={editParamId}
  parameterName={editParamName}
/>
```

---

### 💡 Примечания:

- Обе модалки используют `Autocomplete` с поиском.
- Несоответствия фильтруются по уже добавленным.
- Компоненты типизированы и протестированы.
- Работают на Zustand, без redux или context.

---

🔄 Использовать повторно для страниц:

- `Тип объекта`
- `Список параметров`
