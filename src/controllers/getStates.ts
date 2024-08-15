import { Request, Response } from 'express';
import { capitalizeFirstLetter, getStatesRepository } from '../helpers';


export const getStates = async (req: Request, res: Response) => {
  const statesRepository = await getStatesRepository();
  const states = await statesRepository.getStates();
  const statesWithPrettyName = states.map((state) => ({
    ...state,
    name: capitalizeFirstLetter(state.name.replace('EDO. ', '').toLowerCase())
  }));

  res.json({ states: statesWithPrettyName });
}