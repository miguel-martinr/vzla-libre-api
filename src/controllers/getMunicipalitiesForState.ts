import { Request, Response } from 'express';
import { capitalizeFirstLetter, getMunicipalitiesRepository } from '../helpers';

type GetMunicipalitiesForStateRequest = Request & {
  params: {
    stateCode: number
  }
}

export const getMunicipalitiesForState = async (req: GetMunicipalitiesForStateRequest, res: Response) => {
  try {
    _validateRequest(req);

    const { stateCode } = req.params;
    const municipalitiesRepository = await getMunicipalitiesRepository();
    const municipalities = await municipalitiesRepository.getMunicipalitiesForState(stateCode);
    const municipalitiesWithPrettyName = municipalities.map((municipality) => ({
      ...municipality,
      name: municipality.name.toLowerCase().split(" ").map((word) => capitalizeFirstLetter(word)).join(" ")
    }));

    res.json({ municipalities: municipalitiesWithPrettyName });
  } catch (error: any) {
    const status = error.status || 500;
    const errorMessage = error.message || 'Internal server error';
    res.status(status).json({ error: errorMessage });
  }
}

const _validateRequest = (req: Request) => {
  const { stateCode } = req.params;
  if (!stateCode) {
    throw { status: 400, message: 'Missing state code' };
  }
  if (isNaN(parseInt(stateCode))) {
    throw { status: 400, message: 'Invalid state code' };
  }
}