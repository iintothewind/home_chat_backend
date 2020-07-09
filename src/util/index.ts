
const cfg = {
  mqtt: {
    url: process.env.PORT ? 'mqtts://mqtt.eclipse.org:8883' : 'mqtt://192.168.0.147:1883',
    topic: 'home_chat/general',
    sender: 'api',
    category: 'plain'
  },
  auth: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
  port: Number(process.env.PORT) || 8081,
  origin: process.env.ORIGIN || `http://localhost:8081`,
}

export { cfg }