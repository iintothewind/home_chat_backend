import * as Router from 'koa-router';
import { connect, MqttClient } from 'mqtt'
import * as moment from 'moment'
import Message from '../model/message'
import { default as cfg } from '../config'

const mqttClient: MqttClient = connect(cfg.mqtt.url, { clean: true, clientId: cfg.mqtt.sender })
mqttClient.on('error', error => console.warn('mqtt error: '.concat(error.message)))

const sendMessage: Router.IMiddleware = ctx => {
  const msg: Message = ctx.request.body as Message
  if (msg.content) {
    const message = {
      'sender': msg.sender || cfg.mqtt.sender,
      'moment': msg.moment || moment().format('x'),
      'content': msg.content,
      'topic': msg.topic || cfg.mqtt.topic
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

export { sendMessage }
