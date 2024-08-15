import { Knex } from "knex";
import { GetCenterResponseItem } from "./types";

const Columns = {
  Code: "code",
  Name: "name",
  ParishCode: "parish_code"
};

export class CentersRepository {

  constructor(private connection: Knex) { }

  async getCentersForParish(parishCode: number) {
    return this.connection("Centers")
      .select([Columns.Code, Columns.Name])
      .where<GetCenterResponseItem[]>(Columns.ParishCode, parishCode);
  }

  async addCenters(centers: GetCenterResponseItem[]) {
    return this.connection("Centers")
      .insert(centers.map((center) => {
        const { code, name, parishCode } = center;
        return {
          [Columns.Code]: code,
          [Columns.Name]: name,
          [Columns.ParishCode]: parishCode
        };
      }));
  }
}