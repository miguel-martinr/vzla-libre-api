import puppeteer from "puppeteer";

import { GetCenterResponseItem } from "./types";

export class CentersScraper {
  constructor() { }

  async getCentersForParish(parishCode: number): Promise<GetCenterResponseItem[]> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(`https://resultadosconvzla.com/parroquia/${parishCode}`, {
      waitUntil: 'domcontentloaded'
    });

    const centers = await page.evaluate((parishCode: number) => {
      const tableBody = document.getElementById('dependencyTableBody');
      if (!tableBody) throw { status: 404, message: 'tableBody not found' };

      const rows = tableBody.querySelectorAll('tr');

      return Array.from(rows).map((row) => {
        const columns = row.querySelectorAll("td");
        const name = columns[0].textContent;
        const code = columns[1].querySelector('a')?.href.split('/').pop();

        if (!code) throw { status: 404, message: 'Code not found' };
        if (!name) throw { status: 404, message: 'Name not found' };

        return {
          code: parseInt(code),
          parishCode,
          name: name
        }
      })

    }, parishCode);

    await browser.close();

    return centers;
  }
}