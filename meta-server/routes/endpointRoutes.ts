import { Router } from 'express'
import EndpointController from '../controllers/EndpointController'

const router = Router()
const ec = new EndpointController()

router.post('/', ec.createEndpoint)
router.get('/', ec.getAllEndpoints)

router.get('/:endpoint_name', ec.getEndpoint)
router.patch('/:endpoint_name', ec.updateEndpoint)
router.delete('/:endpoint_name', ec.removeEndpoint)
router.post('/:endpoint_name', ec.addEndpointMethod)

router.get('/:endpoint_name/:method', ec.getEndpointMethod)
router.delete('/:endpoint_name/:method', ec.removeEndpointMethod)

export default router