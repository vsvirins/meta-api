import {Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
  const params = req.params

  Object.keys(params).map((param: string) => {
    req.body[param] = params[param]
  })

  next()
}