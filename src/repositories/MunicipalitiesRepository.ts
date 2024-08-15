import { Knex } from "knex";

export type GetMunicipalityResponseItem = {
  code: number
  name: string
}

const Columns = {
  CodEdo: 'COD_EDO',
  CodMun: 'COD_MUN',
  Mun: 'MUN'
};

export class MunicipalitiesRepository {
  constructor(private connection: Knex) { }

  async getMunicipalitiesForState(stateCode: number) {
    return this.connection
      .select({
        code: Columns.CodMun,
        name: Columns.Mun
      })
      .from('Resultados_Vzla_2024')
      .where(Columns.CodEdo, stateCode)
      .distinct<GetMunicipalityResponseItem[]>();
  }
}