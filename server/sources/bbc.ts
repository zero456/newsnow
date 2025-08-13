import { rss2json } from '#/utils/rss2json'
import type { NewsItem } from '@shared/types'

const realtime = defineSource(async () => {
  const rssUrl = "http://www.bbc.co.uk/zhongwen/simp/index.xml"

  const rssInfo = await rss2json(rssUrl)

  if (!rssInfo || !rssInfo.items) {
    return []
  }

  const news: NewsItem[] = rssInfo.items.map(item => ({
    id: item.id,
    title: item.title,
    url: item.link,
    pubDate: item.created,
    extra: {
      info: 'BBC 中文网', // Add a static author string
    },
  }))

  return news
})

export default defineSource({
  "bbc": realtime,
})
