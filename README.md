# Система голосования за идеи

Система Аутентификация/авторизация и управления пользователями

## Установка и запуск

### Установка и настройка
```bash
npm install
# Создайте файл .env или отредактируйте .env.example
```

### 1. Запуск базы данных
```bash
docker-compose up -d
```

### 3. Генерация Prisma клиента
```bash
npm run db:generate
```

### 3. Инициализация тестовыми данными
```bash
npm run db:seed
```

### 4. Запуск
```bash
# Разработка
npm run dev
# Или продакшен
npm run build
npm start
# Бэкенд будет доступен на http://localhost:4200
```

Все EndPoint доступны в Insomnia_2025-10-03.yaml и openApi: /api/api-docs