import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"
import md5 from 'md5'

const realtime = defineSource(async () => {
  const url = "https://zh.wikipedia.org/wiki/Portal:%E6%96%B0%E8%81%9E%E5%8B%95%E6%85%8B"
  const html: string = await myFetch(url)
  const $ = cheerio.load(html)
  const news: NewsItem[] = []

  $("h2:has(span.mw-headline), h3:has(span.mw-headline)").each((_, el) => {
    const date = $(el).find('span.mw-headline').text().trim()

    // Find the next <ul> element which contains the news items for that date
    const list = $(el).nextAll('ul').first()

    list.find('li').each((_, item) => {
      const title = $(item).text().trim()

      // Remove reference links like [1], [2]...
      const cleanTitle = title.replace(/\[\d+\]/g, '').trim()

      if (cleanTitle) {
        news.push({
          id: md5(cleanTitle), // Use md5 hash of title as a unique id
          title: cleanTitle,
          url: url, // Link back to the main portal page
          pubDate: date, // Use the date string as pubDate
        })
      }
    })
  })

  return news.slice(0, 30) // Return up to 30 items
})

export default defineSource({
  "wikipedia": realtime,
})
