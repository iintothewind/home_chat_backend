
import IORedis from 'ioredis'
import { cfg } from '../util'

const redis = new IORedis({ host: cfg.redis.host, port: cfg.redis.port, password: cfg.redis.password })

const enqueue = async (topic: string, message: string): Promise<string> => {
  console.log(`enqueue topic: ${topic}, message: ${message}`)
  return redis.xadd(topic, '*', 'message', message)
}

const loadPreviousMessages = async (topic: string, end: string): Promise<string[]> => {
  if (topic && end) {
    const entries = await redis.xrevrange(topic, end, '-', 'count', cfg.redis.pageCount)
    const messages = entries.map(_entry => _entry[1]).reverse().map(fields => fields[1])
    return messages
  } else {
    return Promise.reject('load history failed')
  }
}

export { enqueue, loadPreviousMessages }


