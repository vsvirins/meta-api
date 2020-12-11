import {Request, Response} from 'express'
import TokenRepository from '../storage/repository/TokenRepository'

const tr = new TokenRepository()

class TokenController {
  login(req: Request, res: Response) {
    if (!req.body || !req.body.id) return res.sendStatus(400)

    const tokens = tr.createTokens(req.body.id)
    tr.storeRefreshToken(tokens.refreshToken, req.body.id)
    res.status(201).json(tokens)
  }

  logout(req: Request, res: Response) {
    if (!req.body.id) return res.sendStatus(400)
    tr.deleteRefreshToken(req.body.id)
    res.sendStatus(204)
  }

  generateNewAccessToken(req: Request, res: Response) {
    if (!req.body.id || !req.body.refreshToken) return res.sendStatus(400)

    const id = req.body.id
    const refreshToken = req.body.refreshToken

    const userExsists = tr.checkIfUserExsists(id)
    if (!userExsists) return res.sendStatus(401)

    const refreshTokensMatch = tr.compareRefreshTokens(id, refreshToken)
    if (!refreshTokensMatch) return res.sendStatus(401)

    tr.verifyRefreshToken(refreshToken, req.body.id, (err, tokenInfo: any) => {
      if (err) return res.sendStatus(403)
      const accessToken = tr.createAccessToken(tokenInfo.id)
      res.status(201).json(accessToken)
    })
  }
}

export default TokenController
