import axios from 'axios'
import * as moment from 'moment'
import { cfg } from './util'
import { Message, Translation } from './model'


const loadHistory = async () => {
  const before = moment(moment(), 'x').subtract(1, 'second').format('x')
  const params = new URLSearchParams({ topic: 'home_chat/sarah_home', before: before })
  const headers = { 'Accept': 'application/json' }
  axios
    .get<{ messages: Message[] }>(`https://mqttchat.herokuapp.com/home_chat/history`, { params: params, headers: headers })
    .then(response => response.data.messages.forEach(message => console.log(`message: ${JSON.stringify(message)}`)))
}

const lookup = async (word: string) => {
  const headers = { 'Accept': 'application/json' }
  const params = new URLSearchParams({ user: 'ivar', word: word })
  axios
    .get<Translation>(`https://${cfg.dict.host}:${cfg.dict.port}/home_dict/translate`, { params: params, headers: headers })
    .then(response => console.log(`translation: ${JSON.stringify(response.data)}`))
}

// loadHistory()
lookup('word')