import axios from 'axios'
import * as moment from 'moment'
import Message from './model/message'


const loadHistory = async () => {
  const before = moment(moment(), 'x').subtract(1, 'second').format('x')
  const params = new URLSearchParams({ topic: 'home_chat/sarah_home', before: before })
  const headers = { 'Accept': 'application/json' }
  axios
    .get<{ messages: Message[] }>(`https://mqttchat.herokuapp.com/home_chat/history`, { params: params, headers: headers })
    .then(response => response.data.messages.forEach(message => console.log(`message: ${JSON.stringify(message)}`)))
}

loadHistory()