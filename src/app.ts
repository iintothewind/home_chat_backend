import * as Koa from 'koa'
import * as http from 'http'
import * as https from 'https'
import * as logger from 'koa-logger'
import * as compress from 'koa-compress'
import * as cors from 'koa2-cors'
import { router } from './route'
import { cfg } from './util'
import { enforceHttps } from './middleware/ssl'

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
  .use(router.allowedMethods())
  .use(router.routes())

if (process.env.SERVICE_PROVIDER === 'remote') {
  app.use(enforceHttps(cfg.host, String(cfg.https.port)))
  http.createServer(app.callback()).listen(cfg.http)
  https.createServer({ key: cfg.https.key, cert: cfg.https.cert }, app.callback()).listen(cfg.https)
} else {
  http.createServer(app.callback()).listen(cfg.http)

}