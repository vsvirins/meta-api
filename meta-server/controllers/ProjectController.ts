import express from "express"
import ProjectModel from '../models/ProjectModel'

const apiv = process.env.API_VERSION || 'latest'

class ProjectController {
  async create(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.body.project_name

      if (user_name === undefined || project_name === undefined) {
        return res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to create a project!"
          }
        })
      }

      const filter = { user_name, project_name }
  
      const exists = await ProjectModel.exists(filter)
      
      if (exists) {
        return res.status(409).send({
          error: {
            status: 409,
            message: `There is already a project with the name ${project_name} for this user. Please try another project name.`
          }
        })
      }
      
      const Project = new ProjectModel({ user_name, project_name, endpoints: [] })
      await Project.save()

      return res.status(201).send({
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
      })
    }
    catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async update(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.params.project_name
      const new_project_name: string = req.body.new_project_name

      if (user_name === undefined || project_name === undefined || new_project_name === undefined) {
        return res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to update this project!"
          }
        })
      }

      // Check if project_name exists. If not, return 404
      const projectExists = await ProjectModel.exists({ user_name, project_name })

      if (!projectExists) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `There is no project ${project_name} for this user. Try using the form to update the project!`
          }
        })
      }

        // Check if new_project_name exists. If it does, return 409
      const newProjectNameIsTaken = await ProjectModel.exists({ user_name, new_project_name })

      if (newProjectNameIsTaken) {
        return res.status(409).send({
          error: {
            status: 409,
            message: `There is already a project with the name ${new_project_name} for this user. Please try another project name.`
          }
        }).end()
      } else {
        await ProjectModel.updateOne({ user_name, project_name }, { '$set': { project_name: new_project_name }})

        return res.status(200).send({
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
        })
      }
    }
    catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async remove(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.params.project_name

      if (user_name === undefined || project_name === undefined) {
        return res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to delete this project!"
          }
        })
      }

      const filter = { user_name, project_name }
  
      const exists = await ProjectModel.exists(filter)

      if (!exists) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `There is no project ${project_name} for this user. Try using the form to delete this project!`
          }
        })
      } else {
        ProjectModel.deleteOne({ user_name, project_name }, (err: any) => {
          if (err) {
            throw(err)
          }

          return res.status(200).send({
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
          })
        })
      }
    }
    catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async getAll(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.body.user_name

      if (user_name === undefined) {
        return res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to create a project!"
          }
        })
      }

      const projects = await ProjectModel.find({ user_name })

      if (projects.length === 0) {
        return res.status(204).send({
          error: {
            status: 204,
            message: `No projects available for user ${user_name}`
          }
        })
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

        return res.status(200).send({
          "data": project_data,
          "status": 200,
          "message": `Successfully retrieved all projects for user ${user_name}`
        })
      }
    }
    catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async getOne(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.params.project_name

      if (user_name === undefined || project_name === undefined) {
        return res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to get information about a project!"
          }
        })
      }

      const exists = await ProjectModel.exists({ user_name, project_name })

      if (exists === false) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `Couldn't find project ${project_name} for user ${user_name}`
          }
        })
      } else {
        return res.status(200).send({
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
        })
      }
    }
    catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }
}

export default ProjectController 