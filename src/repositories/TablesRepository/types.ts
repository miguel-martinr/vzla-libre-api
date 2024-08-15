export type GetTableResponseItem = {
  code: number,
  url: string 
}

export type ScrapedGetTableResponseItem = GetTableResponseItem & {
  url: string
  centerCode: number
}