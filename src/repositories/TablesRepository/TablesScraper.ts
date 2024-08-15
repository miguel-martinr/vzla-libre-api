import puppeteer from "puppeteer";

import { ScrapedGetTableResponseItem } from "./types";

export class TablesScraper {
  constructor() { }

  async getTablesForCenter(centerCode: number): Promise<ScrapedGetTableResponseItem[]> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(`https://resultadosconvzla.com/centro/${centerCode}`, {
      waitUntil: 'domcontentloaded'
    });

    const tablesDetails = await page.evaluate(async () => {
      const tableBody = document.getElementById('dependencyTableBody');
      if (!tableBody) throw { status: 404, message: 'tableBody not found' };

      const rows = tableBody.querySelectorAll('tr');

      return Promise.all(Array.from(rows).map(async (row) => {
        const columns = row.querySelectorAll("td");
        const code = columns[0].textContent;
        if (!code) throw { status: 404, message: 'Code not found' };

        const linkToTable = columns[1].querySelector('a');
        if (!linkToTable) throw { status: 404, message: 'Link to table not found' };

        return {
          tableCode: code,
          link: linkToTable.href
        };
      }));

    });
    
    await page.close();

    const tables = await Promise.all(tablesDetails.map(async ({ tableCode, link }) => {
      const tablePage = await browser.newPage();      
      await tablePage.goto(link, {
        waitUntil: 'domcontentloaded'
      });

      const btnActa = await tablePage.$('#btnActa');
      if (!btnActa) throw { status: 404, message: 'btnActa not found' };

      await btnActa.click();
            
      const imgActaSrc = await tablePage.evaluate(() => {
        const imgActa = document.querySelector('#acta>img');
        if (!imgActa) throw { status: 404, message: 'imgActa not found' };
        return (imgActa as HTMLImageElement).src;
      });      

      await tablePage.close();
      return {
        code: parseInt(tableCode),
        url: imgActaSrc,
        centerCode,
      };
    }));

    await browser.close();
    return tables;
  }
}