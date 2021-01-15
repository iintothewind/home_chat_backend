import { cfg } from '../util'
import { enqueue } from '../util/redis'
import { connect, MqttClient } from 'mqtt'

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
    enqueue(_topic, payload).catch(error=>{
      if(error) {
        console.error(`equeue error: ${error}`)
      }
    })
  })

export { mqttClient }