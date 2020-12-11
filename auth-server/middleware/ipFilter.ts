import {NextFunction, Request, Response} from 'express'

function ipFilter(whiteList: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!whiteList.includes(req.ip)) {
      console.log(`Access denied to address ${req.ip}`)
      return res.sendStatus(403)
    }
    next()
  }
}

export default ipFilter
