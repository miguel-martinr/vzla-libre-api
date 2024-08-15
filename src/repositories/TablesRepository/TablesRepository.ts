import { Knex } from "knex";
import { GetTableResponseItem, ScrapedGetTableResponseItem } from "./types";

const ResultadosColumn = {
  TableCode: 'MESA',
  CenterCode: 'CENTRO',
  CodePar: 'COD_PAR',
  ImageUrl: 'URL'
};

const CenterColumns = {

}

const TablesColumns = {
  Ordinal: 'ordinal',
  WebCenterCode: 'web_center_code',
  ImageUrl: 'image_url',
}

export class TablesRepository {
  constructor(private connection: Knex) { }

  async getTablesForCenter(centerCode: number) {
    return this.connection('Tables')
      .select({
        code: TablesColumns.Ordinal,
        url: TablesColumns.ImageUrl
      })
      .where<GetTableResponseItem[]>(TablesColumns.WebCenterCode, centerCode);      
  }

  async addScrapedTables(tables: ScrapedGetTableResponseItem[]) {
    return this.connection("Tables")
      .insert(tables.map((table) => {
        return {
          [TablesColumns.Ordinal]: table.code,
          [TablesColumns.WebCenterCode]: table.centerCode,
          [TablesColumns.ImageUrl]: table.url,
        }
      }))
  }
}