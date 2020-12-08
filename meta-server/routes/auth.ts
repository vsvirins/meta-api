import Router from 'express';

const router = Router();

router.get('/login', (req, res) => {
  res.sendStatus(200);
});

router.get('/logout', (req, res) => {
  res.status(200).send('logout');
});

router.get('/github', (req, res) => {
  //Passport
  res.status(200).send('logging in with github');
});

console.log('hello!');

// Callback
export default router;
