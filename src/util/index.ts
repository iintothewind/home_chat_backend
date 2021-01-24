import * as fs from 'fs'

const cfg = {
  mqtt: {
    url: process.env.SERVICE_PROVIDER === 'vultr' ? 'mqtt://home_chat_emqx:1883' : 'mqtt://192.168.0.147:1883',
    topicPrefix: 'home_chat/',
    defaultTopic: 'home_chat/general',
    wildcardTopic: 'home_chat/#',
    sender: 'api',
    category: 'plain'
  },
  redis: {
    host: process.env.SERVICE_PROVIDER === 'vultr' ? 'home_chat_redis' : '192.168.0.147',
    port: process.env.SERVICE_PROVIDER === 'vultr' ? 16379 : 6379,
    password: process.env.SERVICE_PROVIDER === 'vultr' ? process.env.REDIS_PASSWORD : 'admin',
    pageCount: 50
  },
  auth: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
  dict: {
    operation: '@dict ',
    host: process.env.SERVICE_PROVIDER === 'vultr' ? 'home_dict_node' : 'ivarchen.xyz',
    port: 7443,
  },
  http: {
    port: 8081,
  },
  https: {
    key: fs.readFileSync(process.env.SERVICE_PROVIDER === 'vultr' ? '/etc/cert/key.pem' : './etc/cert/key.pem'),
    cert: fs.readFileSync(process.env.SERVICE_PROVIDER === 'vultr' ? '/etc/cert/cert.pem' : './etc/cert/cert.pem'),
    port: 8443,
  },
  host: process.env.SERVICE_PROVIDER === 'vultr' ? 'home-chat.ivarchen.xyz' : '192.168.0.147'
}

export { cfg }