import express from 'express';

export const main = async () => {

  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(8000, () => {
    console.log('Server started on http://localhost:8000');
  });
}