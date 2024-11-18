# Hono Bun Starter
A minimal starter template for building web applications using Hono & Bun. Implemented with a clean Layered Architecture. 

Designed for scalable and maintainable backend development with clear separation of concerns across Presentation, Application, Domain, and Infrastructure layers.

## We're using
- 🚀 **Web Framework**: Hono
- 🧊 **Runtime & Package Manager**: Bun
- 💾 **Database**: Turso (Serverless SQLite)
- 🛠️ **ORM**: Drizzle
- 📧 **Email Service**: Resend
- 🔐 **Validation**: Zod


## Project Structure
```bash
.
├── documentation
│   ├── address.md
│   ├── contact.md
│   └── user.md
├── migrations
│   ├── 0000_peaceful_tiger_shark.sql
│   └── meta
├── src
│   ├── application
│   │   ├── services
│   │   │   ├── contact-service.ts
│   │   │   └── user-service.ts
│   │   └── validation
│   │       ├── auth-validation.ts
│   │       ├── contact-validation.ts
│   │       └── user-validation.ts
│   ├── domain
│   │   └── model
│   │       ├── contact-model.ts
│   │       └── user-model.ts
│   ├── index.ts
│   ├── infrastructure
│   │   ├── database
│   │   │   ├── index.ts
│   │   │   └── schema.ts
│   │   ├── external
│   │   │   └── mail-sender.ts
│   │   ├── logging
│   │   │   └── logger.ts
│   │   └── repositories
│   │       ├── auth-repository.ts
│   │       ├── contact-repository.ts
│   │       └── user-repository.ts
│   └── presentation
│       ├── middleware
│       │   └── auth-middleware.ts
│       └── routers
│           ├── contact-router.ts
│           └── user-router.ts
├── test
│   ├── contact-test.ts
│   ├── result
│   │   ├── 11-18-2024_after_restructured
│   │   │   ├── contact-test.txt
│   │   │   └── user-test.txt
│   │   └── initial
│   │       ├── contact-test.txt
│   │       └── user-test.txt
│   └── user-test.ts
├── .env
├── bun.lockb
├── drizzle.config.ts
├── package.json
├── README.md
└── tsconfig.json
```

## How to run
To install dependencies:
```sh
bun install
```

Copy `.env.example` to `.env` and fill in the values
```sh
cp .env.example .env
```

Generate and migrate database schema
```sh
bun db:gen
bun db:migrate
```

To run:
```sh
bun run dev
```

## How to test
To run tests:
```sh
bun test ./test/user-test.ts
bun test ./test/contact-test.ts 
```
