// src/features/calendar/index.ts

// Экспортируем хук useCalendar, который предоставляет всю логику календаря
export * from './hooks/useCalendar';

// Экспортируем типы, используемые в календаре (Check, CalendarFilter, Object, Operator)
export * from './types';

// Примечание: API-функции (getChecks, getObjects, getOperators)
// теперь экспортируются из 'src/shared/api/calendar',
// поэтому здесь они не реэкспортируются.