import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

const realtime = defineSource(async () => {
  const baseURL = "https://www.bbc.com"
  const debugNews: NewsItem[] = []

  try {
    const html: string = await myFetch("https://www.bbc.com/zhongwen/simp", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    debugNews.push({
      id: "debug-html-start",
      title: "DEBUG: Fetched HTML (first 500 chars)",
      url: "#",
      extra: {
        hover: html.substring(0, 500),
      }
    })

    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    $("a[href^='/zhongwen/simp/']").each((_, el) => {
      const url = $(el).attr("href")

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

    if (news.length === 0) {
      debugNews.push({
        id: "debug-no-items",
        title: "DEBUG: No news items found after parsing.",
        url: "#",
        extra: {
          hover: "The scraper ran but did not find any matching elements. The HTML might be different than expected."
        }
      })
    }

    return [...debugNews, ...news.slice(0, 20)]

  } catch (error: any) {
    return [
      {
        id: "debug-error",
        title: "DEBUG: An error occurred",
        url: "#",
        extra: {
          hover: error.message,
        }
      }
    ]
  }
})

export default defineSource({
  "bbc": realtime,
})
