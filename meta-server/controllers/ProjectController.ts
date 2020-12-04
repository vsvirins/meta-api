import express from "express"
import IProjectRepository from "../storage/repository/interfaces/IProjectRepository"

import ProjectRepository from '../storage/repository/ProjectRepository'

class ProjectController {
  projectRepository: IProjectRepository

  constructor() {
    this.projectRepository = new ProjectRepository()
  }

  create(req: express.Request, res: express.Response): void {
    try {
      const user_name: string = req.body.user_name !
      const project_name: string = req.body.project_name !

      this.projectRepository.save(user_name, project_name)
    }
    catch (e) {
      console.log(e)

      res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  update(req: express.Request, res: express.Response): void {
    try {
      
    }
    catch (e) {
      console.log(e)
      res.send({ "error": "error in your request" })
    }
  }

  remove(req: express.Request, res: express.Response): void {
    try {
      var _id: string = req.params._id
    }
    catch (e) {
      console.log(e)
      res.send({ "error": "error in your request" })
    }
  }

  get(req: express.Request, res: express.Response): void {
    try {

    }
    catch (e) {
      console.log(e)
      res.send({ "error": "error in your request" })
    }
  }
}

export default ProjectController 