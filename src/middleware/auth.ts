import * as Router from 'koa-router';
import { cfg, axiosInstance } from '../util'
import { URLSearchParams } from 'url'

const acquireToken: Router.IMiddleware = async ctx => {
  const { code } = ctx.query as { code?: string }
  if (code) {
    if (cfg.auth.clientId && cfg.auth.clientSecret) {
      const params = new URLSearchParams({ client_id: cfg.auth.clientId, client_secret: cfg.auth.clientSecret, code: code })
      const headers = { 'Accept': 'application/json' }
      await axiosInstance.post<{ access_token?: string }>('https://github.com/login/oauth/access_token', null, { params: params, headers: headers })
        .then(resp => {
          ctx.status = resp.data.access_token ? 200 : 500
          ctx.body = resp.data
        }).catch(reason => {
          ctx.status = 500
          ctx.body = { error: String(reason) }
        })
    } else {
      ctx.status = 500
      ctx.body = { error: 'clientId or clientSecret is empty' }
    }
  } else {
    ctx.status = 400
    ctx.body = { error: 'expected request parameter: code' }
  }
}

interface User {
  login?: string
  name?: string
  avatarUrl?: string
}

const retrieveUser: Router.IMiddleware = async ctx => {
  const { code } = ctx.query as { code?: string }
  if (code) {
    if (cfg.auth.clientId && cfg.auth.clientSecret && cfg.host) {
      const params = new URLSearchParams({ client_id: cfg.auth.clientId, client_secret: cfg.auth.clientSecret, code: code })
      const origin = `https://${cfg.host}/`
      const headers = { 'Accept': 'application/json' }
      await axiosInstance.post<{ access_token?: string }>('https://github.com/login/oauth/access_token', null, { params: params, headers: headers })
        .then(resp => resp.data.access_token ? Promise.resolve(resp.data.access_token) : Promise.reject(resp.data))
        .then(token => axiosInstance.get<User>('https://api.github.com/user', { headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}`, 'Origin': origin } }))
        .then(resp => {
          ctx.status = 200
          ctx.body = resp.data
        })
        .catch(error => {
          ctx.status = 500
          ctx.body = error
        })
    } else {
      ctx.status = 500
      ctx.body = { error: 'config error, check config for clientId, clientSecret, and origin' }
    }
  } else {
    ctx.status = 400
    ctx.body = { error: 'expected request parameter: code' }
  }
}


export { acquireToken, retrieveUser }