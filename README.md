# User Notifications Manager

A scalable, modular backend service built with NestJS for managing user notification preferences and sending notifications via multiple channels like Email and SMS.

---

## Features

- Manage user preferences (create, update, retrieve)
- Multi-channel notifications (Email, SMS) using strategy pattern
- Secure API access via token-based AuthMiddleware
- Environment-based configuration using `.env` and `AppConfigService`
- Unit-tested services
- Dockerized with multi-stage build

---

## Tech Stack

- NestJS (TypeScript)
- Axios – HTTP requests
- Class Validator / Transformer – request validation
- Helmet – security headers
- Compression – optimized responses
- Jest – unit testing
- Docker & Docker Compose

---

## Folder Structure

```
src/
├── app.module.ts
├── main.ts
│
├── common/
│   ├── config/               # AppConfigService for typed env access
│   └── middleware/           # AuthMiddleware for token-based auth
│
├── notifications/
│   ├── dto/                  # Notification DTOs
│   ├── strategies/           # Email and SMS strategies
│   ├── notification.manager.ts
│   ├── notifications.service.ts
│   ├── notifications.controller.ts
│   └── notifications.module.ts
│
└── users/
    ├── dto/                  # Create & Update DTOs
    ├── entities/             # User entity
    ├── users.service.ts
    ├── users.controller.ts
    └── users.module.ts
```

---

## Authentication

All routes require an `Authorization` header:

```http
Authorization: Bearer onlyvim2024
```

This is handled by a custom middleware using the `AppConfigService`.

---

## Environment Variables

Stored in `.env`, accessed via `AppConfigService`.

```env
EMAIL_API_URL=http://notification-service:5001/send-email
SMS_API_URL=http://notification-service:5001/send-sms
AUTH_TOKEN=onlyvim2024
```

---

## Testing

Run unit tests:

```bash
npm run test
```

Covered:

- `UsersService`
- `NotificationsService`

These are unit tests with mocked dependencies.  
No integration or e2e tests implemented in this version.

---

## Running with Docker

Build and run:

```bash
docker-compose up --build
```

Services:

- Notifications Manager: http://localhost:8080  
- Mock Notification API: http://localhost:5001

To stop:

```bash
docker-compose down
```

---

## ▶️ Running Locally

```bash
npm install
npm run start:dev
```

Access: http://localhost:8080

---

## Example Usage

### Add User

```bash
curl -X POST http://localhost:8080/users -H "Authorization: Bearer onlyvim2024" -H "Content-Type: application/json" -d '{
  "email": "newuser@example.com",
  "telephone": "+123456789",
  "preferences": { "email": true, "sms": false }
}'
```

### Update Preferences

```bash
curl -X PUT http://localhost:8080/users -H "Authorization: Bearer onlyvim2024" -H "Content-Type: application/json" -d '{
  "email": "newuser@example.com",
  "preferences": { "sms": true }
}'
```

### Send Notification

```bash
curl -X POST http://localhost:8080/notifications/send -H "Authorization: Bearer onlyvim2024" -H "Content-Type: application/json" -d '{
  "userId": 1,
  "message": "Hello, from Notifications Manager!"
}'
```

---

## Architecture & Design Patterns

### Strategy Pattern

Each notification channel (Email, SMS) implements the `NotificationStrategy` interface. This allows dynamic runtime selection and easy extension.

**To add a new strategy** (e.g. Push):

- Implement `NotificationStrategy`
- Add `isEnabled()` logic based on preferences
- Register in `NotificationManager`

No changes are needed in `NotificationsService`.

---

### AppConfigService

A typed service built on top of `ConfigService` to expose environment variables safely.

```ts
@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  getEmailApiUrl(): string {
    return this.config.getOrThrow('EMAIL_API_URL');
  }
}
```

---

### Middleware

- `AuthMiddleware` checks bearer token from headers
- `Helmet` adds security headers
- `Compression` optimizes response size

---

## Extendability

To add a new notification channel:

1. Create a new class under `notifications/strategies`
2. Implement `NotificationStrategy`
3. Inject it into `NotificationManager`
4. Add it to the preferences model (if needed)

---

## Summary

- Clean architecture, SOLID principles
- Modular, testable, and scalable
- Fully containerized
- Environment-driven config
- Ready for production with minor extensions (e.g., DB, queue, metrics)
