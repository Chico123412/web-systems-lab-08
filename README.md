# Лабораторна робота №10

Study Planner на React із підключенням до REST API DummyJSON.

## Реалізовано

- Fetch HTTP client
- Repository Pattern
- GET, POST, PATCH і DELETE
- пагінація через limit і skip
- перегляд деталей завдання
- loading, error, empty і success states
- повторний запит після помилки
- AbortController
- фільтри та статистика
- підтвердження видалення
- скасування видалення протягом 5 секунд
- SCSS та BEM

## Технології

React 19, TypeScript, Vite, Fetch API, DummyJSON, SCSS та ESLint.

## Запуск

npm install

npm run dev

## Перевірка

npm run lint

npm run build

## Налаштування API

Адреса API задається через змінну VITE_API_URL у файлі .env.

Приклад знаходиться у файлі .env.example.

## Архітектура

Компоненти звертаються до taskRepository. Repository приховує endpoint-и та перетворює API DTO у модель Task. httpClient виконує HTTP-запити.

DummyJSON імітує POST, PATCH і DELETE, тому після успішної відповіді React state оновлюється на стороні клієнта.
