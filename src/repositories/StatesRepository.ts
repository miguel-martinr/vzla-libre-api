import { Knex } from "knex";

export type GetStateResponseItem = {
  code: number
  name: string
}

const PropertiesToColumnsMap = {
  Code: 'COD_EDO',
  Name: 'EDO'
};

export class StatesRepository {
  constructor(private connection: Knex) { }

  async getStates() {
    return this.connection
      .select({
        code: PropertiesToColumnsMap.Code,
        name: PropertiesToColumnsMap.Name
      })
      .from('Resultados_Vzla_2024')
      .distinct<GetStateResponseItem[]>();
  }
}