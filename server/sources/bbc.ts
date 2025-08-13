import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

const realtime = defineSource(async () => {
  const baseURL = "https://www.bbc.com"
  const html: string = await myFetch("https://www.bbc.com/zhongwen/simp")
  const $ = cheerio.load(html)

  const news: NewsItem[] = []

  // Use a more general selector to get all potential article links
  $("a[href^='/zhongwen/simp/']").each((_, el) => {
    const url = $(el).attr("href")

    // Filter out links that don't look like articles (must end with digits)
    if (!url || !/-(\d+)$/.test(url)) {
      return
    }

    const title = $(el).find('h3, h2, span').first().text().trim()

    if (title && !news.some(item => item.title === title)) {
      news.push({
        url: `${baseURL}${url}`,
        title,
        id: url,
      })
    }
  })

  return news.slice(0, 20) // Limit to 20 items to be safe
})

export default defineSource({
  "bbc": realtime,
})
