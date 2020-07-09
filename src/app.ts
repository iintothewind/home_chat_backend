import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as compress from 'koa-compress'
import * as cors from 'koa2-cors'
import { router } from './route'

const app = new Koa()

app
  .use(logger())
  .use(cors({
    origin: ctx => ctx.url.startsWith('/home_chat') ? '*' : false,
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 86400,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  }))
  .use(compress())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(8081)