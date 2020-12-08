import express from "express"
import ProjectModel from '../models/ProjectModel'

import { API_VERSION as apiv } from '../config/Constants'

class ProjectController {
  create(req: express.Request, res: express.Response): void {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.body.project_name

      if (user_name === undefined || project_name === undefined) {
        res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to create a project!"
          }
        }).end()

        return
      }

      const filter = { user_name, project_name }
  
      ProjectModel.exists(filter, (err: any, exists: boolean) => {
        if (err) {
          throw(err)
        }

        if (exists) {
          res.status(409).send({
            error: {
              status: 409,
              message: `There is already a project with the name ${project_name} for this user. Please try another project name.`
            }
          }).end()
        } else {
          const Project = new ProjectModel(filter)
          Project.save()

          res.status(201).send({
            "data": {
              "project_name": `${project_name}`,
              "_links": [
                {
                  "method": "GET",
                  "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/`
                },
                {
                  "method": "GET",
                  "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}`
                },
                {
                  "method": "PUT",
                  "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}`
                },
                {
                  "method": "DELETE",
                  "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}`
                },
                {
                  "method": "POST",
                  "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints`
                },
              ]
            },
            "status": 201,
            "message": `The project ${project_name} has been successully created for user ${user_name}`
          }).end()
        }
      })
    }
    catch (e) {
      console.error(e)

      res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" }).end()
    }
  }

  update(req: express.Request, res: express.Response): void {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.params.project_name
      const new_project_name: string = req.body.new_project_name

      if (user_name === undefined || project_name === undefined || new_project_name === undefined) {
        res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to update this project!"
          }
        }).end()

        return
      }

      // Check if project_name exists. If not, return 404
      ProjectModel.exists({ user_name, project_name }, (err: any, exists: boolean) => {
        if (err) {
          throw(err)
        }

        if (!exists) {
          res.status(404).send({
            error: {
              status: 404,
              message: `There is no project ${project_name} for this user. Try using the form to update the project!`
            }
          }).end()

          return
        }

        // Check if new_project_name exists. If it does, return 409
        ProjectModel.exists({ user_name, new_project_name }, (err: any, exists: boolean) => {
          if (err) {
            throw(err)
          }

          if (exists) {
            res.status(409).send({
              error: {
                status: 409,
                message: `There is already a project with the name ${new_project_name} for this user. Please try another project name.`
              }
            }).end()
          } else {
            ProjectModel.updateOne({ user_name, project_name }, { '$set': { project_name: new_project_name }}, (err: any) => {
              if (err) {
                throw(err)
              }

              res.status(200).send({
                "data": {
                  "project_name": `${new_project_name}`,
                  "_links": [
                    {
                      "method": "GET",
                      "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/`
                    },
                    {
                      "method": "GET",
                      "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${new_project_name}`
                    },
                    {
                      "method": "DELETE",
                      "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${new_project_name}`
                    },
                    {
                      "method": "GET",
                      "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${new_project_name}/endpoints`
                    },
                    {
                      "method": "POST",
                      "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${new_project_name}/endpoints`
                    },
                  ]
                },
                "status": 200,
                "message": `The project ${project_name} has been successully updated for user ${user_name}`
              }).end()
            })
          }
        })
      })
    }
    catch (e) {
      console.error(e)

      res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" }).end()
    }
  }

  remove(req: express.Request, res: express.Response): void {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.params.project_name

      if (user_name === undefined || project_name === undefined) {
        res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to delete this project!"
          }
        }).end()

        return
      }

      const filter = { user_name, project_name }
  
      ProjectModel.exists(filter, (err: any, exists: boolean) => {
        if (err) {
          throw(err)
        }

        if (!exists) {
          res.status(404).send({
            error: {
              status: 404,
              message: `There is no project ${project_name} for this user. Try using the form to delete this project!`
            }
          }).end()
        } else {
          ProjectModel.deleteOne({ user_name, project_name }, (err: any) => {
            if (err) {
              throw(err)
            }
            
            res.status(200).send({
              "data": {
                "project_name": `${project_name}`,
                "_links": [
                  {
                    "method": "GET",
                    "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects`
                  },
                  {
                    "method": "POST",
                    "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects`
                  }
                ]
              },
              "status": 200,
              "message": `The project ${project_name} has been successully deleted for user ${user_name}`
            }).end()
          })
        }
      })
    }
    catch (e) {
      console.error(e)

      res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" }).end()
    }
  }

  getAll(req: express.Request, res: express.Response): void {
    try {
      const user_name: string = req.body.user_name

      if (user_name === undefined) {
        res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to create a project!"
          }
        }).end()

        return
      }

      ProjectModel.find({ user_name }, (err: any, projects: Document[]) => {
        if (err) {
          throw(err)
        }

        if (projects.length === 0) {
          res.status(204).send({
            error: {
              status: 204,
              message: `No projects available for user ${user_name}`
            }
          }).end()
        } else {
          const project_data: any[] = projects.map(({ project_name }: any) => ({
            "project_name": `${project_name}`,
            "_links": [
              {
                "method": "GET",
                "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}`
              },
              {
                "method": "PUT",
                "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}`
              },
              {
                "method": "DELETE",
                "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}`
              },
              {
                "method": "POST",
                "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints`
              },
            ]
          }))

          res.status(200).send({
            "data": project_data,
            "status": 200,
            "message": `Successfully retrieved all projects for user ${user_name}`
          }).end()
        }
      })
    }
    catch (e) {
      console.error(e)

      res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" }).end()
    }
  }

  getOne(req: express.Request, res: express.Response): void {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.params.project_name

      if (user_name === undefined || project_name === undefined) {
        res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to get information about a project!"
          }
        }).end()

        return
      }

      ProjectModel.exists({ user_name, project_name }, (err: any, exists: Boolean) => {
        if (err) {
          throw(err)
        }

        if (exists === false) {
          res.status(404).send({
            error: {
              status: 404,
              message: `Couldn't find project ${project_name} for user ${user_name}`
            }
          }).end()
        } else {
          res.status(200).send({
            "data": {
              "project_name": `${project_name}`,
              "_links": [
                {
                  "method": "GET",
                  "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/`
                },
                {
                  "method": "PUT",
                  "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}`
                },
                {
                  "method": "DELETE",
                  "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}`
                },
                {
                  "method": "GET",
                  "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints`
                },
                {
                  "method": "POST",
                  "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints`
                },
              ]
            },
            "status": 200,
            "message": `Successfully retrieved project ${project_name} for user ${user_name}`
          }).end()
        }
      })
    }
    catch (e) {
      console.error(e)

      res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" }).end()
    }
  }
}

export default ProjectController 