# Hono Bun Turso
Example of using Hono with Bun and Turso

## We're using
- Hono as web framework
- Bun as Package Manager & Runtime
- Turso as Database
- Drizzle as ORM
- Zod as Schema Validator

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
