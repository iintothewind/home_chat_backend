import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as compress from 'koa-compress'
import * as cors from 'koa2-cors'
import { default as hc } from './route/HomeChat'

const app = new Koa()

app
  // .use(logger())
  .use(compress())
  .use(cors())
  .use(hc.router.routes())
  .use(hc.router.allowedMethods())
  .listen(8081)