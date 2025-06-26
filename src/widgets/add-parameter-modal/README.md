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
