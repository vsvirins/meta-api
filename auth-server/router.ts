import Router from 'express'
import TokenController from './controllers/TokenController'

const tc = new TokenController()
const router = Router()

router.post('/login', tc.login)
router.post('/refresh', tc.generateNewAccessToken)
router.delete('/logout', tc.logout)

export default router
