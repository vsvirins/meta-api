import { Router } from 'express'
import ProjectController from '../controllers/ProjectController'

const router = Router()
const pc = new ProjectController()

router.post('/', (req, res) => {
  pc.create(req, res)
})

router.get('/', (req, res) => {
  pc.getAll(req, res)
})

router.get('/:project_name', (req, res) => {
  pc.getOne(req, res)
})

router.put('/:project_name', (req, res) => {
  pc.update(req, res)
})

router.delete('/:project_name', (req, res) => {
  pc.remove(req, res)
})


export default router