import { Request, Response } from 'express';
import { getCentersRepository, getCentersScraper } from '../helpers';

type GetCentersForParishRequest = Request & {
  params: {
    parishCode: number
  }
}

export const getCentersForParish = async (req: GetCentersForParishRequest, res: Response) => {
  try {
    _validateRequest(req);

    const { parishCode } = req.params;
    const centersRepository = await getCentersRepository();
    const centersScraper = getCentersScraper();
    const centersInDb = await centersRepository.getCentersForParish(parishCode);
    if (centersInDb.length > 0) {
      console.log("Centers found in db");
      return res.json({ centers: centersInDb });
    }

    console.log("Centers not found in db, scraping web");
    const centersInWeb = await centersScraper.getCentersForParish(parishCode);
    res.json({ centers: centersInWeb });
    centersRepository.addCenters(centersInWeb).catch((error) => {
      console.error('Error adding centers to database', error);
    });
  } catch (error: any) {
    console.log("Error while calling getCentersForParish", error);
    const status = error.status || 500;
    const errorMessage = error.message || 'Internal server error';
    res.status(status).json({ error: errorMessage });
  }
}

const _validateRequest = (req: Request) => {
  const { parishCode } = req.params;
  if (!parishCode) {
    throw { status: 400, message: 'Missing parish code' };
  }
  if (isNaN(parseInt(parishCode))) {
    throw { status: 400, message: 'Invalid parish code' };
  }
}