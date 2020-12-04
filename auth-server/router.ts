import Router from 'express';
import TokenHandler from './TokenHandler';

const tokenHandler = new TokenHandler();

const router = Router();

router.post('/login', (req, res) => {
  if (!req.body || !req.body.id) return res.sendStatus(400);

  const tokens = tokenHandler.createTokens(req.body.id);
  tokenHandler.storeRefreshToken(tokens.refreshToken, req.body.id);
  res.status(201).json(tokens);
});

router.post('/token', (req, res) => {
  if (!req.body.id || !req.body.refreshToken) return res.sendStatus(400);

  const id = req.body.id;
  const refreshToken = req.body.refreshToken;

  const userExsists = tokenHandler.checkIfUserExsists(id);
  if (!userExsists) return res.sendStatus(401);

  const idAndRefreshTokenMatch = tokenHandler.checkIfIdAndRefreshTokenMatch(id, refreshToken);
  if (!idAndRefreshTokenMatch) return res.sendStatus(401);

  tokenHandler.verifyRefreshToken(refreshToken, req.body.id, (err, tokenInfo: any) => {
    if (err) return res.sendStatus(403);
    const accessToken = tokenHandler.createAccessToken({id: tokenInfo.id});
    res.status(201).json(accessToken);
  });
});

router.delete('/logout', (req, res) => {
  if (!req.body.id) return res.sendStatus(400);
  tokenHandler.deleteRefreshToken(req.body.id);
  res.sendStatus(204);
});

export default router;
