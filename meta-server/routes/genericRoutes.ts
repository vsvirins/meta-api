import { Router } from 'express'
import GenericController from '../controllers/GenericController'

const router = Router()
const gc = new GenericController()

router.get('/:user_name/:project_name/:endpoint_name', gc.getAll)
router.post('/:user_name/:project_name/:endpoint_name', gc.create)

router.get('/:user_name/:project_name/:endpoint_name/:entity_id', gc.getOne)
router.put('/:user_name/:project_name/:endpoint_name/:entity_id', gc.update)
router.delete('/:user_name/:project_name/:endpoint_name/:entity_id', gc.delete)

export default router