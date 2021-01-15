import { Middleware } from 'koa'

const enforceHttps = (hostname: string, httpsPort: string, httpStatusCode = 301): Middleware => (ctx, next) => {
  if (ctx.secure) {
    return next()
  } else {
    const urlRedirect = ctx.request.URL
    urlRedirect.protocol = 'https'
    if (httpsPort) urlRedirect.port = httpsPort
    if (hostname) urlRedirect.hostname = hostname

    ctx.response.status = httpStatusCode
    ctx.response.redirect(urlRedirect.href);
  }
}

export { enforceHttps }