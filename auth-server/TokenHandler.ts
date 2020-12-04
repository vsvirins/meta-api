import dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

interface refreshToken {
  id: string;
  token: string;
}

class TokenHandler {
  // Replace with database
  private _refreshTokens: refreshToken[] = [];
  private _accesKey: string = process.env.JWT_SECRET!;
  private _refreshKey: string = process.env.JWT_REFRESH_SECRET!;

  createAccessToken(id: object) {
    return jwt.sign(id, this._accesKey, {expiresIn: '15m'});
  }

  createRefreshToken(id: object) {
    return jwt.sign(id, this._refreshKey, {expiresIn: '30d'});
  }

  createTokens(id: string) {
    return {accessToken: this.createAccessToken({id}), refreshToken: this.createRefreshToken({id})};
  }

  checkIfUserExsists(id: string) {
    return this._refreshTokens.filter(usr => usr.id === id).length > 0;
  }

  checkIfIdAndRefreshTokenMatch(id: string, refreshToken: string) {
    const user = this._refreshTokens.filter(usr => usr.id === id)[0];
    return user.token === refreshToken;
  }

  verifyRefreshToken(refreshToken: string, id: string, callback: jwt.VerifyCallback) {
    jwt.verify(refreshToken, this._refreshKey, (err, tokenInfo) => {
      callback(err, tokenInfo);
    });
  }

  deleteRefreshToken(id: string) {
    this._refreshTokens = this._refreshTokens.filter(token => token.id !== id);
  }

  storeRefreshToken(token: string, id: string) {
    //Hash the token
    //crypto.createHash('');
    //Store in DB
    this._refreshTokens.push({id, token});
  }
}

export default TokenHandler;
