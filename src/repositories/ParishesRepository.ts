import { Knex } from "knex";

export type GetParishesResponseItem = {
  code: number
  name: string
}

const Columns = {
  CodEdo: 'COD_EDO',
  CodMun: 'COD_MUN',
  CodPar: 'COD_PAR',
  Par: 'PAR'
};

export class ParishesRepository {
  constructor(private connection: Knex) { }

  async getParishes(stateCode: number, municipalityCode: number) {
    return this.connection
      .select({
        code: Columns.CodPar,
        name: Columns.Par
      })
      .from('Resultados_Vzla_2024')
      .where(Columns.CodEdo, stateCode)
      .where(Columns.CodMun, municipalityCode)      
      .distinct<GetParishesResponseItem[]>();
  }
}