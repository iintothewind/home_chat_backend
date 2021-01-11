
import IORedis from 'ioredis'
import Message from '../model/message'
import { cfg } from '../util'

const redis = new IORedis({ host: cfg.redis.host, port: cfg.redis.port, password: cfg.redis.password })

const enqueue = async (topic: string, message: string): Promise<string> => {
  console.log(`enqueue topic: ${topic}, message: ${message}`)
  return redis.xadd(topic, '*', 'message', message)
}

const loadPreviousMessages = async (topic: string, end: string): Promise<Message[]> => {
  if (topic && end) {
    const entries = await redis.xrevrange(topic, end, '-', 'count', cfg.redis.pageCount)
    const messages = entries.map(_entry => _entry[1]).reverse().map(fields => JSON.parse(fields[1]) as Message)
    return messages
  } else {
    return Promise.reject('load history failed')
  }
}

export { enqueue, loadPreviousMessages }


