# Hono Bun Starter
A minimal starter template for building web applications using Hono & Bun.

## We're using
- 🚀 **Web Framework**: Hono
- 🧊 **Runtime & Package Manager**: Bun
- 💾 **Database**: Turso (Serverless SQLite)
- 🛠️ **ORM**: Drizzle
- 📧 **Email Service**: Resend
- 🔐 **Validation**: Zod

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

open http://localhost:3000
