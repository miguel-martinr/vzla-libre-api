import express from 'express';
import cors from 'cors';
import { getStates } from './controllers/getStates';
import { getMunicipalitiesForState } from './controllers/getMunicipalitiesForState';
import { getParishesForMunicipality } from './controllers/getParishesForMunicipality';
import { getCentersForParish } from './controllers/getCentersForParish';
import { getTablesForCenter } from './controllers/getTablesForCenter';
import { getImage } from './controllers/getImage';

export const main = async () => {

  const app = express();

  const corsOptions = {
    origin: [
      'http://localhost:5173',
    ],
  };

  app.use(cors(corsOptions));
  app.get('/states', getStates);
  app.get('/states/:stateCode/municipalities', getMunicipalitiesForState);
  app.get('/states/:stateCode/municipalities/:municipalityCode/parishes', getParishesForMunicipality)
  app.get('/parishes/:parishCode/centers', getCentersForParish);
  app.get('/centers/:centerCode/tables', getTablesForCenter);
  app.get('/images', getImage);

  app.listen(8000, () => {
    console.log('Server started on http://localhost:8000');
  });
}