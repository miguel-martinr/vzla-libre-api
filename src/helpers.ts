import { getDbConnection } from "./database"
import { CentersRepository } from "./repositories/CentersRepository";
import { MunicipalitiesRepository } from "./repositories/MunicipalitiesRepository";
import { ParishesRepository } from "./repositories/ParishesRepository";
import { StatesRepository } from "./repositories/StatesRepository"

export const getStatesRepository = async () => {
  return new StatesRepository(await getDbConnection());
}

export const getMunicipalitiesRepository = async () => {
  return new MunicipalitiesRepository(await getDbConnection());
}

export const getParishesRepository = async () => {
  return new ParishesRepository(await getDbConnection());
}

export const getCentersRepository = async () => {
  return new CentersRepository(await getDbConnection());
}

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}