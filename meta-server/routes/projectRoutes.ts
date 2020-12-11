import { Router } from 'express'
import ProjectController from '../controllers/ProjectController'

const router = Router()
const pc = new ProjectController()

router.post('/', pc.create)
router.get('/', pc.getAll)

router.get('/:project_name', pc.getOne)
router.put('/:project_name', pc.update)
router.delete('/:project_name', pc.remove)

export default router