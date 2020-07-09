import * as Router from 'koa-router';
import * as koaBody from 'koa-body'
import { sendMessage } from '../middleware/message'
import { acquireToken, retrieveUser } from '../middleware/auth'

const router = new Router()

router.post('/home_chat/message', koaBody(), sendMessage)
router.get('/home_chat/auth', acquireToken)
router.get('/home_chat/user', retrieveUser)

export { router }
