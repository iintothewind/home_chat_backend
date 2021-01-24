import { Middleware } from 'koa'

interface Option {
  readonly private: string,
  readonly public: string,
  readonly noStore: string,
  readonly noCache: string,
  readonly noTransform: string,
  readonly proxyRevalidate: string,
  readonly mustRevalidate: string,
  readonly staleIfError: number,
  readonly staleWhileRevalidate: number,
  readonly maxAge: number,
  readonly sMaxAge: number
}

const cacheControl = (opt: Option): Middleware => async (ctx, next) => {
  return next().then(() => {
    const option: Option = opt || {} as Option
    const cacheControl: string[] = []

    if (option.private) {
      cacheControl.push('private');
    } else if (option.public) {
      cacheControl.push('public');
    }

    if (option.noStore) {
      cacheControl.push('no-store');
    }

    if (option.noCache) {
      cacheControl.push('no-cache');
    }

    if (option.noTransform) {
      cacheControl.push('no-transform');
    }

    if (option.proxyRevalidate) {
      cacheControl.push('proxy-revalidate');
    }

    if (option.mustRevalidate) {
      cacheControl.push('must-revalidate');
    } else if (!option.noCache) {
      if (option.staleIfError) {
        cacheControl.push(`stale-if-error=${option.staleIfError}`);
      }
      if (option.staleWhileRevalidate) {
        cacheControl.push(`stale-while-revalidate=${option.staleWhileRevalidate}`);
      }
    }

    if (Number.isInteger(option.maxAge)) {
      cacheControl.push(`max-age=${option.maxAge}`);
    }

    if (Number.isInteger(option.sMaxAge)) {
      cacheControl.push(`s-maxage=${option.sMaxAge}`);
    }

    if (cacheControl.length) {
      ctx.set('Cache-Control', cacheControl.join(','));
    }
  })
}

export { Option, cacheControl }