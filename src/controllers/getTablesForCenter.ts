import { Request, Response } from 'express';
import { getTablesRepository, getTablesScraper } from '../helpers';

type GetTablesForCenterRequest = Request & {
  params: {
    centerCode: number
  }
}

export const getTablesForCenter = async (req: GetTablesForCenterRequest, res: Response) => {
  try {
    _validateRequest(req);

    const { centerCode } = req.params;
    const tablesRepository = await getTablesRepository();
    const tablesScraper = getTablesScraper();
    
    const tablesInDb = await tablesRepository.getTablesForCenter(centerCode);
    if (tablesInDb.length > 0) {
      console.log("Tables found in db");
      return res.json({ tables: tablesInDb });
    }

    console.log("Centers not found in db, scraping web");
    const tablesInWeb = await tablesScraper.getTablesForCenter(centerCode);
    res.json({ tables: tablesInWeb });
    tablesRepository.addScrapedTables(tablesInWeb).catch((error) => {
      console.error('Error adding tables to database', error);
    });
  } catch (error: any) {
    console.log("Error while calling getTablesForCenter", error);
    const status = error.status || 500;
    const errorMessage = error.message || 'Internal server error';
    res.status(status).json({ error: errorMessage });
  }
}

const _validateRequest = (req: Request) => {
  const { centerCode } = req.params;
  if (!centerCode) {
    throw { status: 400, message: 'Missing center code' };
  }
  if (isNaN(parseInt(centerCode))) {
    throw { status: 400, message: 'Invalid center code' };
  }
}