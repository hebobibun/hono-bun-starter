import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { userController } from './controller/user-controller'

const app = new Hono()

app.use(logger())
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/', userController)

export default app
