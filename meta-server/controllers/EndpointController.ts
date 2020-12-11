import express, { response } from "express"
import { isArray } from "util"
import EndpointModelInterface from "../models/interfaces/EndpointModelInterface"
import ProjectModelInterface from "../models/interfaces/ProjectModelInterface"
import ProjectModel from '../models/ProjectModel'

const apiv = process.env.API_VERSION || 'latest'

class EndpointController {
  async createEndpoint(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.body.project_name
      const endpoint_name: string = req.body.endpoint_name
      const allowed_methods: string[] = req.body.allowed_methods
      const responses: { status: number, message: string, method: string }[] = req.body.responses
      const fields: any = req.body.fields

      if (
        [user_name, project_name, endpoint_name, allowed_methods, responses, fields].some(val => val === undefined) ||
        !Array.isArray(responses) || Object.keys(fields).length === 0
      ) {
        return res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to create a project!"
          }
        })
      }

      const filter = { user_name, project_name }
      const project = await ProjectModel.findOne(filter)

      if (project === null) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `There is no project named ${project_name} for this user.`
          }
        })
      }

      const exists = project.endpoints.find((value) => value.endpoint_name === endpoint_name)
      
      if (exists) {
        return res.status(409).send({
          error: {
            status: 409,
            message: `There is already an endpoint with the name ${endpoint_name} for the project ${project_name}. Please try another endpoint name.`
          }
        })
      } else {
        project.endpoints.push({ endpoint_name, allowed_methods, responses, fields })
        await project.save()

        return res.status(201).send({
          "data": {
            "endpoint_name": `${endpoint_name}`,
            "_links": [
              {
                "method": "GET",
                "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints`
              },
              {
                "method": "GET",
                "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
              },
              {
                "method": "PATCH",
                "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
              },
              {
                "method": "DELETE",
                "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
              }
            ]
          },
          "status": 201,
          "message": `The endpoint ${endpoint_name} has been successully created for project ${project_name}`
        })
      }
    }
    catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async getAllEndpoints(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.body.project_name

      if (user_name === undefined || project_name === undefined) {
        return res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to get project endpoints!"
          }
        })
      }

      const project = await ProjectModel.findOne({ user_name, project_name })

      if (project === null) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `Could not find project ${project_name}. Try using the form to get project endpoints`
          }
        })
      }
      if (project.endpoints.length === 0) {
        return res.status(204).send({
          error: {
            status: 204,
            message: `No endpoints available for project ${project_name}`
          }
        })
      }

      const endpoint_data: any[] = project.endpoints.map(({ endpoint_name }: any) => ({
        "endpoint_name": `${endpoint_name}`,
        "_links": [
          {
            "method": "GET",
            "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
          },
          {
            "method": "PATCH",
            "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
          },
          {
            "method": "POST",
            "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
          },
          {
            "method": "DELETE",
            "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
          }
        ]
      }))

      return res.status(200).send({
        "data": endpoint_data,
        "status": 200,
        "message": `Successfully retrieved all endpoints for project ${project_name}`
      })
    }
    catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async getEndpoint(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.body.project_name
      const endpoint_name: string = req.params.endpoint_name

      if (user_name === undefined || project_name === undefined || endpoint_name === undefined) {
        return res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to get information about a project endpoint!"
          }
        })
      }

      const project = await ProjectModel.findOne({ user_name, project_name })

      if (project === null) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `Couldn't find project ${project_name} for user ${user_name}`
          }
        })
      }
      
      const endpoint = project.endpoints.find((endpoint: EndpointModelInterface) => endpoint.endpoint_name === endpoint_name)

      if (endpoint === undefined)
      {
        return res.status(404).send({
          error: {
            status: 404,
            message: `Couldn't find endpoint ${endpoint_name} for project ${project_name}`
          }
        })
      }

      return res.status(200).send({
        "data": {
          "endpoint_name": `${endpoint_name}`,
          "_links": [
            {
              "method": "GET",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints`
            },
            {
              "method": "DELETE",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
            },
            {
              "method": "PATCH",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
            },
            {
              "method": "POST",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
            },
            ...endpoint.allowed_methods.map(method => ({
                "method": "GET",
                "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}/${method}`
            }))
          ]
        },
        "status": 200,
        "message": `Successfully retrieved endpoint ${endpoint_name} for project ${project_name}`
      })
    }
    catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async updateEndpoint(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.body.project_name
      const endpoint_name: string = req.params.endpoint_name
      const responses: { status: number, message: string, method: string }[] = req.body.responses
      const fields: any = req.body.fields

      if (
        [user_name, project_name, endpoint_name, responses, fields].some(val => val === undefined) ||
        !Array.isArray(responses) || Object.keys(fields).length === 0
      ) {
        return res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to create a project!"
          }
        })
      }

      const filter = { user_name, project_name }
      const project = await ProjectModel.findOne(filter)

      if (project === null) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `There is no project named ${project_name} for this user.`
          }
        })
      }

      const endpoint = project.endpoints.find((value) => value.endpoint_name === endpoint_name)
      
      if (endpoint === undefined) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `There is no endpoint with the name ${endpoint_name} for the project ${project_name}. Try using the form to update an endpoint.`
          }
        })
      }

      await ProjectModel.updateOne(
        { user_name, project_name, endpoints: { $elemMatch: { endpoint_name } } },
        { $set: { 'endpoints.$.responses': responses, 'endpoints.$.fields': fields } }
      )

      return res.status(200).send({
        "data": {
          "endpoint_name": `${endpoint_name}`,
          "_links": [
            {
              "method": "GET",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints`
            },
            {
              "method": "GET",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
            },
            {
              "method": "PATCH",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
            },
            {
              "method": "DELETE",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
            }
          ]
        },
        "status": 200,
        "message": `The endpoint ${endpoint_name} has been successully updated for project ${project_name}`
      })
    }
    catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async removeEndpoint(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.body.project_name
      const endpoint_name: string = req.params.endpoint_name

      if (user_name === undefined || project_name === undefined || endpoint_name === undefined) {
        return res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to delete this project!"
          }
        })
      }

      const filter = { user_name, project_name }
      const project = await ProjectModel.findOne(filter)

      if (project === null) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `There is no project ${project_name} for this user. Try using the form to delete this endpoint!`
          }
        })
      }

      const endpoint = project.endpoints.find(endpoint => endpoint.endpoint_name === endpoint_name)

      if (endpoint === undefined) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `There is no project ${project_name} for this user. Try using the form to delete this endpoint!`
          }
        })
      }

      const newEndpoints = project.endpoints.reduce((acc: any, cur: EndpointModelInterface) => {
        if (cur.endpoint_name !== endpoint_name) acc.push(cur)

        return acc
      }, [])
        
      await ProjectModel.updateOne(
        { user_name, project_name },
        { $set: { endpoints: newEndpoints } }
      )

      return res.status(200).send({
        "data": {
          "endpoint_name": `${endpoint_name}`,
          "_links": [
            {
              "method": "GET",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints`
            },
            {
              "method": "POST",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints`
            }
          ]
        },
        "status": 200,
        "message": `The endpoint ${endpoint_name} has been successully deleted for project ${project_name}`
      })
    }
    catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async addEndpointMethod(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.body.project_name
      const endpoint_name: string = req.params.endpoint_name
      const method: string = req.body.method
      const responses: { status: number, message: string, method: string }[] = req.body.responses

      if ([user_name, project_name, endpoint_name, method, responses].some(val => val === undefined) || !Array.isArray(responses)) {
        return res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to create a project!"
          }
        })
      }

      const filter = { user_name, project_name }
      const project = await ProjectModel.findOne(filter)

      if (project === null) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `There is no project named ${project_name} for this user.`
          }
        })
      }

      const endpoint = project.endpoints.find((endpoint) => endpoint.endpoint_name === endpoint_name )
      
      if (endpoint === undefined) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `There is no endpoint named ${endpoint_name} for this project.`
          }
        })
      }
      
      const exists = endpoint.allowed_methods.find(method_name => method_name === method)
      
      if (exists) {
        return res.status(409).send({
          error: {
            status: 409,
            message: `The method ${method} is already registered for the endpoint ${endpoint_name}.`
          }
        })
      }

      const endpoints: any = project.endpoints.map(endpoint => {
        if (endpoint.endpoint_name === endpoint_name) {
          endpoint.responses = [...endpoint.responses, ...responses]
          endpoint.allowed_methods.push(method)
        }

        return endpoint
      })
      

      await ProjectModel.updateOne(
        { user_name, project_name },
        { $set: { endpoints } }
      )

      return res.status(201).send({
        "data": {
          "endpoint_name": `${endpoint_name}`,
          "method": `${method}`,
          "_links": [
            {
              "method": "GET",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
            },
            {
              "method": "DELETE",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}/${method}`
            }
          ]
        },
        "status": 201,
        "message": `The method ${method} has been successully created for endpoint ${endpoint_name} on project ${project_name}`
      })
    }
    catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async getEndpointMethod(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.body.project_name
      const endpoint_name: string = req.params.endpoint_name
      const method: string = req.params.method

      if ([ user_name, project_name, endpoint_name, method ].some(val => val === undefined)) {
        return res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to get information about an endpoint method!"
          }
        })
      }

      const project = await ProjectModel.findOne({ user_name, project_name })

      if (project === null) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `Couldn't find project ${project_name} for user ${user_name}`
          }
        })
      }
      
      const endpoint = project.endpoints.find(endpoint => endpoint.endpoint_name === endpoint_name)

      if (endpoint === undefined) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `Couldn't find endpoint ${endpoint_name} for project ${project_name}`
          }
        })
      }
      if (endpoint.allowed_methods.find(allowed_method => allowed_method === method) === undefined) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `Couldn't find method ${method} for endpoint ${endpoint_name}`
          }
        })
      }

      return res.status(200).send({
        "data": {
          "endpoint_name": `${endpoint_name}`,
          "method": `${method}`,
          "_links": [
            {
              "method": "GET",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
            },
            {
              "method": "DELETE",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}/${method}`
            },
          ]
        },
        "status": 200,
        "message": `Successfully retrieved method ${method} for endpoint ${endpoint_name}`
      })
    }
    catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async removeEndpointMethod(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.body.user_name
      const project_name: string = req.body.project_name
      const endpoint_name: string = req.params.endpoint_name
      const method: string = req.params.method

      if ([user_name, project_name, endpoint_name, method].some(val => val === undefined)) {
        return res.status(400).send({
          error: {
            status: 400,
            message: "I couldn't quite understand the data you sent me. Try using the form to delete an endpoint method!"
          }
        })
      }

      const filter = { user_name, project_name }
      const project = await ProjectModel.findOne(filter)

      if (project === null) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `There is no project named ${project_name} for this user.`
          }
        })
      }

      const endpoint = project.endpoints.find((value) => value.endpoint_name === endpoint_name)
      
      if (endpoint === undefined) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `There is no endpoint with the name ${endpoint_name} for the project ${project_name}. Try using the form to update an endpoint.`
          }
        })
      } 
      
      if (endpoint.allowed_methods.find(allowed_method => allowed_method === method) === undefined) {
        return res.status(404).send({
          error: {
            status: 404,
            message: `Couldn't find method ${method} for endpoint ${endpoint_name}`
          }
        })
      }

      const allowed_methods = endpoint.allowed_methods.reduce((acc: string[], cur: string): string[] => {
        if (cur !== method) acc.push(cur)

        return acc
      }, [])

      const responses = endpoint.responses.reduce((acc: any[], cur: any): any[] => {
        if (cur.method !== method) acc.push(cur)

        return acc
      }, [])

      const endpoints: any = project.endpoints.map(endpoint => {
        if (endpoint.endpoint_name === endpoint_name) {
          endpoint.responses = responses
          endpoint.allowed_methods = allowed_methods
        }

        return endpoint
      })

      await ProjectModel.updateOne(
        { user_name, project_name },
        { $set: { endpoints } }
      )

      return res.status(200).send({
        "data": {
          "endpoint_name": `${endpoint_name}`,
          "_links": [
            {
              "method": "GET",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints`
            },
            {
              "method": "GET",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/generator/${user_name}/projects/${project_name}/endpoints/${endpoint_name}`
            }
          ]
        },
        "status": 200,
        "message": `The method ${method} has been successully deleted for endpoint ${endpoint_name}`
      })
    
    }
    catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }
}

export default EndpointController 