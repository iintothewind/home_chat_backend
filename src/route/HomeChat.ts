import * as Router from 'koa-router';
import * as koaBody from 'koa-body'
import { sendMessage } from '../middleware/HomeChat'

const router = new Router()

router.post('/home_chat/message', koaBody(), sendMessage)

export default { router }
