import puppeteer from "puppeteer";

import { GetCenterResponseItem } from "./types";

export class CentersScrapper {
  constructor() { }

  async getCentersForParish(parishCode: number): Promise<GetCenterResponseItem[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://resultadosconvzla.com/parroquia/${parishCode}`, {
      waitUntil: 'domcontentloaded'
    });

    const centers = await page.evaluate(() => {
      const tableBody = document.getElementById('dependencyTableBody');
      if (!tableBody) throw { status: 404, message: 'Table not found' };

      const rows = tableBody.querySelectorAll('tr');

      return Array.from(rows).map((row) => {
        const columns = row.querySelectorAll("td");
        const name = columns[0].textContent;
        const code = columns[1].querySelector('a')?.href.split('/').pop();

        if (!code) throw { status: 404, message: 'Code not found' };
        if (!name) throw { status: 404, message: 'Name not found' };

        return {
          code: parseInt(code),
          name: name
        }
      })

    });

    await browser.close();

    return centers;
  }
}