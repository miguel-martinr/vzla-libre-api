import { Request, Response } from 'express';
import { capitalizeFirstLetter, getParishesRepository } from '../helpers';

type GetParishesForMunicipalityRequest = Request & {
  params: {
    municipalityCode: number
  }
}

export const getParishesForMunicipality = async (req: GetParishesForMunicipalityRequest, res: Response) => {
  try {
    _validateRequest(req);

    const { municipalityCode } = req.params;
    const parishesRepository = await getParishesRepository();
    const parishes = await parishesRepository.getParishesForMunicipality(municipalityCode);
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
  const { municipalityCode } = req.params;
  if (!municipalityCode) {
    throw { status: 400, message: 'Missing municipality code' };
  }
  if (isNaN(parseInt(municipalityCode))) {
    throw { status: 400, message: 'Invalid municipality code' };
  }
}