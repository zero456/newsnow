import { rss2json } from '#/utils/rss2json'
import type { NewsItem } from '@shared/types'

const realtime = defineSource(async () => {
  const rssUrl = "https://news.google.com/rss/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx1YlY4U0JYcG9MVU5PR2dKRFRpZ0FQAQ?hl=zh-CN&gl=CN"

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
      info: item.author || '',
    },
  }))

  return news
})

export default defineSource({
  "googlenews": realtime,
})
