import { Request, Response } from 'express';
import { capitalizeFirstLetter, getParishesRepository } from '../helpers';

type GetParishesForMunicipalityRequest = Request & {
  params: {
    stateCode: number,
    municipalityCode: number
  }
}

export const getParishesForMunicipality = async (req: GetParishesForMunicipalityRequest, res: Response) => {
  try {
    _validateRequest(req);

    const { municipalityCode, stateCode } = req.params;
    const parishesRepository = await getParishesRepository();
    const parishes = await parishesRepository.getParishes(stateCode, municipalityCode);
    const parishesWithPrettyName = parishes.map((parish) => ({
      ...parish,
      name: parish.name.toLowerCase().split(" ").map((word) => capitalizeFirstLetter(word)).join(" ")
    }));

    res.json({ parishes: parishesWithPrettyName });
  } catch (error: any) {
    const status = error.status || 500;
    const errorMessage = error.message || 'Internal server error';
    res.status(status).json({ error: errorMessage });
  }
}

const _validateRequest = (req: Request) => {
  const { municipalityCode, stateCode } = req.params;
  if (!municipalityCode) {
    throw { status: 400, message: 'Missing municipality code' };
  }
  if (isNaN(parseInt(municipalityCode))) {
    throw { status: 400, message: 'Invalid municipality code' };
  }
  if (!stateCode) {
    throw { status: 400, message: 'Missing state code' };
  }
  if (isNaN(parseInt(stateCode))) {
    throw { status: 400, message: 'Invalid state code' };
  }
}