import { Hono } from 'hono'
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from "@hono/swagger-ui";
import { logger } from 'hono/logger'
import { userRouter } from './presentation/routers/user-router';
import { contactRouter } from './presentation/routers/contact-router';


const app = new OpenAPIHono()

app.use(logger())
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/', userRouter)
app.route('/', contactRouter)

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
      title: 'Hono RESTful API',
      description: 'Hono RESTful API',
      version: '1.0.0',
  },
})

app.get("/ui", swaggerUI({ url: "/doc" }));

export default app
