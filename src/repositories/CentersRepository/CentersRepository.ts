import { Knex } from "knex";
import { CentersScrapper } from "./CentersScrapper";
import { GetCenterResponseItem } from "./types";


export class CentersRepository {
  private scraper: CentersScrapper;
  constructor(private connection: Knex) {
    this.scraper = new CentersScrapper();
  }

  async getCentersForParish(parishCode: number) {
    return this.scraper.getCentersForParish(parishCode);
  }

  async addCenters(centers: GetCenterResponseItem[]) {
    return this.connection("Centers")
      .insert(centers);
  }
}