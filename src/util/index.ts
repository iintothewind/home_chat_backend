
const cfg = {
  mqtt: {
    url: process.env.PORT ? 'mqtts://mqtt.ivarchen.xyz:8883' : 'mqtt://192.168.0.147:1883',
    topicPrefix: 'home_chat/',
    defaultTopic: 'home_chat/general',
    wildcardTopic: 'home_chat/#',
    sender: 'api',
    category: 'plain'
  },
  redis: {
    host: process.env.PORT ? 'home-chat.ivarchen.xyz' : '192.168.0.147',
    port: process.env.PORT ? 16379 : 6379,
    password: process.env.PORT ? process.env.REDIS_PASSWORD : 'admin',
    pageCount: 50
  },
  auth: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
  port: Number(process.env.PORT) || 8081,
  origin: process.env.ORIGIN || `http://localhost:8081`,
}

export { cfg }