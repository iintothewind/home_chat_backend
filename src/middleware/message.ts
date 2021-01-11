import Router from 'koa-router';
import moment from 'moment'
import Message from '../model/message'
import { cfg } from '../util'
import { mqttClient } from '../util/mqtt'
import { loadPreviousMessages } from '../util/redis'


const sendMessage: Router.IMiddleware = ctx => {
  const msg: Message = ctx.request.body as Message
  if (msg.content) {
    const message: Message = {
      topic: `${cfg.mqtt.topicPrefix}${msg.topic}` || cfg.mqtt.defaultTopic,
      moment: msg.moment || moment().format('x'),
      sender: msg.sender || cfg.mqtt.sender,
      category: msg.category || cfg.mqtt.category,
      content: msg.content,
    }
    mqttClient.publish(message.topic, JSON.stringify(message), { qos: 2 }, error => {
      if (error) {
        console.log('publish failed'.concat(error.message))
        ctx.status = 500
        ctx.body = { error: 'publish failed: '.concat(error.message) }
      }
    })
    ctx.body = { message: message }
  } else {
    ctx.status = 400
    ctx.body = { error: 'message content is required' }
  }
}

const loadHistory: Router.IMiddleware = async ctx => {
  const { topic, before } = ctx.query as { topic?: string, before?: string }
  if (topic && before) {
    const messages = await loadPreviousMessages(topic, before)
    ctx.body = { messages: messages }
  } else {
    ctx.status = 400
    ctx.body = { error: 'request parameters: topic and moment are required' }
  }
}

export { sendMessage, loadHistory }
