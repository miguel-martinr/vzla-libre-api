import { Request, Response } from 'express';
import { capitalizeFirstLetter, getCentersRepository, getParishesRepository } from '../helpers';
import { CentersScrapper } from '../repositories/CentersRepository';

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
    const centers = await centersRepository.getCentersForParish(parishCode);

    res.json({ centers: centers });

    centersRepository.addCenters(centers).catch((error) => {
      console.error('Error adding centers to database', error);
    });
  } catch (error: any) {
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