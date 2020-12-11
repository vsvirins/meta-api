import express from "express"

import ProjectModel from '../models/ProjectModel'
import GenericModel from '../models/GenericModel'

const apiv = process.env.API_VERSION || 'latest'

class GenericController {
  constructor() {
    this.isEndpointValid = this.isEndpointValid.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
    this.getAll = this.getAll.bind(this)
    this.getOne = this.getOne.bind(this)
  }

  async isEndpointValid(user_name: string, project_name: string, endpoint_name: string) {
    try {
      if (user_name === undefined || project_name === undefined || endpoint_name === undefined) {
        return false
      }
      
      const filter = { user_name, project_name }
      const project = await ProjectModel.findOne(filter)
      
      if (project === null) {
        return false
      }

      const endpoint = project.endpoints.find(endpoint => endpoint.endpoint_name === endpoint_name)

      if (endpoint === undefined) {
        return false
      }
      
      return true
    } catch (e) {
      console.error(e)
    }
  }

  async create(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.params.user_name
      const project_name: string = req.params.project_name
      const endpoint_name: string = req.params.endpoint_name
      const data: any = req.body.data

      if (!this.isEndpointValid(user_name, project_name, endpoint_name)) {
        return res.status(404).send({
          error: {
            status: 404,
            message: "Invalid endpoint"
          }
        })
      }

      const projectFilter = { user_name, project_name }
      const project = await ProjectModel.findOne(projectFilter)
      const endpoint = project?.endpoints.find(endpoint => endpoint.endpoint_name === endpoint_name) !

      let validData = true

      const required = endpoint.fields.reduce((acc: string[], field: any) => {
        if (field.required === true)
          acc.push(field.name)

        return acc
      }, [])

      required.map(field => {
        if (Object.keys(data).indexOf(field) === -1)
          validData = false
      })

      Object.keys(data).map(d => {
        if (endpoint.fields.find(field => field.name === d && typeof(data[d]) !== field.type))
          validData = false
      })

      if (!validData) {
        return res.status(400).send({
          error: {
            status: 400,
            message: endpoint.responses.find(response => response.method === "POST" && response.status === 400)?.message || "Invalid data"
          }
        })
      }

      const Model = GenericModel(user_name, project_name, endpoint_name, endpoint.fields)

      const entity = new Model(data)
      await entity.save()

      return res.status(201).send({
        "data": {
          "entity_id": `${entity._id}`,
          "_links": [
            {
              "method": "GET",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/api/${user_name}/${project_name}/${endpoint_name}`
            },
            {
              "method": "PUT",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/api/${user_name}/${project_name}/${endpoint_name}/${entity._id}`
            },
            {
              "method": "DELETE",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/api/${user_name}/${project_name}/${endpoint_name}/${entity._id}`
            }
          ]
        },
        "status": 201,
        "message": endpoint.responses.find(response => response.method === "POST" && response.status === 201)?.message || "Entity created"
      })
    } catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async update(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.params.user_name
      const project_name: string = req.params.project_name
      const endpoint_name: string = req.params.endpoint_name
      const entity_id: string = req.params.entity_id

      const data: any = req.body.data

      if (!this.isEndpointValid(user_name, project_name, endpoint_name)) {
        return res.status(404).send({
          error: {
            status: 404,
            message: "Invalid endpoint"
          }
        })
      }

      const projectFilter = { user_name, project_name }
      const project = await ProjectModel.findOne(projectFilter)
      const endpoint = project?.endpoints.find(endpoint => endpoint.endpoint_name === endpoint_name) !

      const Model = GenericModel(user_name, project_name, endpoint_name, endpoint.fields)
      const entity = await Model.findOneAndUpdate({ _id: entity_id }, data, { new: true })

      return res.status(200).send({
        "data": {
          "entity": entity,
          "_links": [
            {
              "method": "GET",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/api/${user_name}/${project_name}/${endpoint_name}`
            },
            {
              "method": "DELETE",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/api/${user_name}/${project_name}/${endpoint_name}/${entity._id}`
            }
          ]
        },
        "status": 200,
        "message": endpoint.responses.find(response => response.method === "PUT" && response.status === 200)?.message || "Entity updated"
      })
    } catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async delete(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.params.user_name
      const project_name: string = req.params.project_name
      const endpoint_name: string = req.params.endpoint_name
      const entity_id: string = req.params.entity_id

      const filter: any = req.body.filter
      const data: any = req.body.data

      if (!this.isEndpointValid(user_name, project_name, endpoint_name)) {
        return res.status(404).send({
          error: {
            status: 404,
            message: "Invalid endpoint"
          }
        })
      }

      const projectFilter = { user_name, project_name }
      const project = await ProjectModel.findOne(projectFilter)
      const endpoint = project?.endpoints.find(endpoint => endpoint.endpoint_name === endpoint_name) !

      const Model = GenericModel(user_name, project_name, endpoint_name, endpoint.fields)
      const entity = await Model.findOneAndDelete({ _id: entity_id })

      return res.status(200).send({
        "data": {
          "entity": entity,
          "_links": [
            {
              "method": "GET",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/api/${user_name}/${project_name}/${endpoint_name}`
            }
          ]
        },
        "status": 200,
        "message": endpoint.responses.find(response => response.method === "DELETE" && response.status === 200)?.message || "Entity deleted"
      })
    } catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async getAll(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.params.user_name
      const project_name: string = req.params.project_name
      const endpoint_name: string = req.params.endpoint_name

      const page: number = parseInt(req.query.page?.toString() || "1")
      const show: number = parseInt(req.query.show?.toString() || "20")

      const filter: any = req.body.filter || {}

      if (!this.isEndpointValid(user_name, project_name, endpoint_name)) {
        return res.status(404).send({
          error: {
            status: 404,
            message: "Invalid endpoint"
          }
        })
      }

      const projectFilter = { user_name, project_name }
      const project = await ProjectModel.findOne(projectFilter)
      const endpoint = project?.endpoints.find(endpoint => endpoint.endpoint_name === endpoint_name) !

      const Model = GenericModel(user_name, project_name, endpoint_name, endpoint.fields)
      
      const total = await Model.countDocuments(filter)
      const maxPages = total % +show

      const prevPage = page > 1 ? `page=${page - 1}` : ``
      const nextPage = page < maxPages ? `page=${page + 1}` : ``

      const entities = await Model.find(filter).skip((page - 1) * show).limit(show)

      entities.map(entity => {
        entity.link = `https://metaapi.zerozipzilch.com/${apiv}/api/${user_name}/${project_name}/${endpoint_name}/${entity._id}`
      })

      const resData: { total: number, entities: any, _links: { [key: string]: string }[] } = {
        "total": total,
        "entities": entities,
        "_links": [
          {
            "method": "POST",
            "url": `https://metaapi.zerozipzilch.com/${apiv}/api/${user_name}/${project_name}/${endpoint_name}`
          }
        ]
      }

      if (prevPage !== ``) {
        resData['_links'].push({
          'method': 'GET',
          'prevPage': `https://metaapi.zerozipzilch.com/${apiv}/api/${user_name}/${project_name}/${endpoint_name}?show=${show}&page=${prevPage}`
        })
      }
      if (nextPage !== ``) {
        resData['_links'].push({
          'method': 'GET',
          'nextPage': `https://metaapi.zerozipzilch.com/${apiv}/api/${user_name}/${project_name}/${endpoint_name}?show=${show}&page=${nextPage}`
        })
      }

      return res.status(200).send({
        "data": resData,
        "status": 200,
        "message": endpoint.responses.find(response => response.method === "GET" && response.status === 200)?.message || "OK"
      })
    } catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }

  async getOne(req: express.Request, res: express.Response) {
    try {
      const user_name: string = req.params.user_name
      const project_name: string = req.params.project_name
      const endpoint_name: string = req.params.endpoint_name
      const entity_id: string = req.params.entity_id

      if (!this.isEndpointValid(user_name, project_name, endpoint_name)) {
        return res.status(404).send({
          error: {
            status: 404,
            message: "Invalid endpoint"
          }
        })
      }

      const projectFilter = { user_name, project_name }
      const project = await ProjectModel.findOne(projectFilter)
      const endpoint = project?.endpoints.find(endpoint => endpoint.endpoint_name === endpoint_name) !

      const Model = GenericModel(user_name, project_name, endpoint_name, endpoint.fields)
      const entity = await Model.findOne({ _id: entity_id })

      return res.status(200).send({
        "data": {
          "entity": entity,
          "_links": [
            {
              "method": "GET",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/api/${user_name}/${project_name}/${endpoint_name}`
            },
            {
              "method": "PUT",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/api/${user_name}/${project_name}/${endpoint_name}/${entity._id}`
            },
            {
              "method": "DELETE",
              "url": `https://metaapi.zerozipzilch.com/${apiv}/api/${user_name}/${project_name}/${endpoint_name}/${entity._id}`
            }
          ]
        },
        "status": 200,
        "message": endpoint.responses.find(response => response.method === "GET" && response.status === 200)?.message || "OK"
      })
    } catch (e) {
      console.error(e)

      return res.send({ error: "Listen yao, we don't do 500's here, we're too good for that" })
    }
  }
}

export default GenericController 