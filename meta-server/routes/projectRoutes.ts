import { Router } from 'express'
import ProjectController from '../controllers/ProjectController'

const router = Router()
const pc = new ProjectController()

router.post('/', (req, res) => {
  pc.create(req, res)

  res.status(201).send("Woop you did it, woho, good job, you're amazing......")
})

export default router