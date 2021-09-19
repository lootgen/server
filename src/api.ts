import * as core from 'express-serve-static-core';

const registerExpressAPI = (app: core.Express): void => {
  app.get('/image/:lootId', (req, res) => {
    console.log(req.params.lootId);
    res.send('hello world');
  });
};

export default registerExpressAPI;
