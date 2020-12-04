import ProjectModel from '../schemas/ProjectSchema'
import IProjectRepository from './interfaces/IProjectRepository'

class ProjectRepository implements IProjectRepository {
  save(user_name: string, project_name: string) {
    console.log("HELLooooo, DO I EVEN GET HERE!?")
    const query = { user_name, project_name }
    const update = { project_name }
    const options = { upsert: true, setDefaultsOnInsert: true }

    // const Project = new ProjectModel()
    ProjectModel.updateOne(query, update, options, (error, reuslt) => {
      if (error) {
        console.error("An error occured while saving")
        console.error(error)
      }
    })
  }

  remove() {

  }

  findAll() {

  }

  findById() {

  }
}

export = ProjectRepository