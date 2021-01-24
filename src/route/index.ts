import * as Router from 'koa-router';
import * as koaBody from 'koa-body'
import { sendMessage, loadHistory } from '../middleware/message'
import { acquireToken, retrieveUser } from '../middleware/auth'
import { Option, cacheControl } from '../middleware/cache'

const router = new Router()
const opt = { maxAge: 86400 } as Option

router.post('/home_chat/message', koaBody(), sendMessage)
router.get('/home_chat/auth', acquireToken)
router.get('/home_chat/user', cacheControl(opt), retrieveUser)
router.get('/home_chat/history', loadHistory)

export { router }
