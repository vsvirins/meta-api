import dotenv from 'dotenv'
import * as jwt from 'jsonwebtoken'
import Crypto from '../../modules/Crypto'
import Token from '../models/Token'
dotenv.config()
const crypto = new Crypto()

class TokenRepository {
  private _accesKey: string = process.env.JWT_SECRET!
  private _refreshKey: string = process.env.JWT_REFRESH_SECRET!

  createAccessToken(id: string) {
    return jwt.sign({id}, this._accesKey, {expiresIn: '15m'})
  }

  createRefreshToken(id: string) {
    return jwt.sign({id}, this._refreshKey, {expiresIn: '30d'})
  }

  /**
   * Create encoded access & refresh tokens tied to the users.
   * @param id - User id.
   * @returns - An object containing the access & refresh tokens.
   */
  createTokens(id: string) {
    return {accessToken: this.createAccessToken(id), refreshToken: this.createRefreshToken(id)}
  }

  /**
   * Checks the database if there's a token tied to the user's id.
   * @param id - User id.
   * @returns - True if the user exsists, otherwise false -duh-
   */
  async checkIfUserExsists(id: string): Promise<boolean> {
    return await Token.exists({id})
  }

  async compareRefreshTokens(id: string, refreshToken: string): Promise<boolean | void> {
    const target = await Token.findOne({id})
    return await crypto.verify(target!.refreshToken, refreshToken)
  }

  /**
   * Verifies the refresh token with a secret key.
   * @param refreshToken - Encrypted refresh token.
   * @param id - User id.
   * @callback {@link VerifyCallback}
   * @throws {@link jwt.NotBeforeError}
   * @throws {@link jwt.TokenExpiredError}
   * @returns The decoded token.
   *
   * @todo fix links
   */
  verifyRefreshToken(refreshToken: string, id: string, callback: jwt.VerifyCallback) {
    jwt.verify(refreshToken, this._refreshKey, (err, tokenInfo) => {
      callback(err, tokenInfo)
    })
  }

  /**
   * Deletes the refresh token tied to the user's id.
   * @param id - User id.
   */
  async deleteRefreshToken(id: string) {
    await Token.deleteOne({id})
  }

  /**
   * Creates a new document in the database with the hashed refresh token tied to the user's id.
   * @param token User's token.
   * @param id User's id.
   */
  async storeRefreshToken(token: string, id: string) {
    const hashedToken = await crypto.hash(token)
    new Token({id, refreshToken: hashedToken}).save()
  }
}

export default TokenRepository
