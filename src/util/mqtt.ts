import { cfg, axiosInstance } from '../util'
import { enqueue } from '../util/redis'
import { Message, Translation } from '../model'
import { connect, MqttClient } from 'mqtt'
import { AxiosError } from 'axios'


const consumeDict = (topic: string, message: Message) => {
  if (topic && message && message.content && message.content.startsWith(cfg.dict.operation)) {
    const user = message.sender
    const word = message.content.substr(cfg.dict.operation.length, cfg.dict.maxWordLength).trim()
    const headers = { 'Accept': 'application/json' }
    if (user && word) {
      axiosInstance
        .get<Translation>(`https://${cfg.dict.host}:${cfg.dict.port}/home_dict/translate`, { params: new URLSearchParams({ user: user, word: word }), headers: headers })
        .then(resp => `单词: ${resp.data.word} 读音: ${resp.data.phonetic} \n英义: \n${resp.data.definition} \n翻译: \n${resp.data.translation} \n变换: \n${resp.data.exchange}`)
        .catch((error: AxiosError) => `lookup word: ${word} failed with: ${error.response ? JSON.stringify(error.response.data) : error.message}`)
        .then(translation => axiosInstance.post<Message>(
          `https://localhost:${cfg.https.port}/home_chat/message`,
          { topic: topic.startsWith(cfg.mqtt.topicPrefix) ? topic.substr(cfg.mqtt.topicPrefix.length) : topic, content: translation } as Message))
        .catch(error => console.log(`error in consumeDict: ${error}`))
    }
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
    enqueue(_topic, payload).then(_ => consumeDict(_topic, message)).catch(error => {
      if (error) {
        console.error(`consume message error: ${error}`)
      }
    })
  })

export { mqttClient }