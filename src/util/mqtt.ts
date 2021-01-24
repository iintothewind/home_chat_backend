import { cfg } from '../util'
import * as https from 'https'
import axios from 'axios'
import { enqueue } from '../util/redis'
import { Message, Translation } from '../model'
import { connect, MqttClient } from 'mqtt'

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})

const consumeDict = (topic: string, message: Message) => {
  if (topic && message && message.content && message.content.startsWith(cfg.dict.operation)) {
    const user = message.sender
    const word = message.content.substr(cfg.dict.operation.length)
    const headers = { 'Accept': 'application/json' }
    axiosInstance
      .get<Translation>(`https://${cfg.dict.host}:${cfg.dict.port}/home_dict/translate`, { params: new URLSearchParams({ user: user, word: word }), headers: headers })
      .then(resp => `单词: ${resp.data.word} 读音: ${resp.data.phonetic} \n英义: \n${resp.data.definition} \n翻译: \n${resp.data.translation} \n变换: ${resp.data.exchange}`)
      .then(translation => axiosInstance.post<Message>(
        `https://localhost:${cfg.https.port}/home_chat/message`,
        { topic: topic.startsWith(cfg.mqtt.topicPrefix) ? topic.substr(cfg.mqtt.topicPrefix.length) : topic, content: translation } as Message))
      .catch(error => console.log(`error in conumeDict: ${error}`))
  }
}

const mqttClient: MqttClient = connect(cfg.mqtt.url, { clean: true, clientId: cfg.mqtt.sender, rejectUnauthorized: false })
mqttClient
  .on('error', error => console.warn('mqtt error: '.concat(error.message)))
  .on('connect', () => {
    mqttClient.subscribe({ [cfg.mqtt.wildcardTopic]: { qos: 2 } }, (error, granted) => {
      if (error) {
        console.warn(`mqtt url: ${cfg.mqtt.url} subscription failed: ${error.message}`)
      }
    })
  })
  .on('message', (_topic, buffer) => {
    const payload = buffer.toString()
    const message = JSON.parse(payload)
    enqueue(_topic, payload).catch(error => {
      if (error) {
        console.error(`equeue error: ${error}`)
      }
    }).then(_ => consumeDict(_topic, message))
  })

export { mqttClient }