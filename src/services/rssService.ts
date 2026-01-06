export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
}

export const fetchNews = async (query: string): Promise<NewsItem[]> => {
  // Use Vite proxy configured in vite.config.ts
  // /rss/search?... -> https://news.google.com/rss/search?...
  const rssUrl = `/rss/search?q=${encodeURIComponent(query)}&hl=ja&gl=JP&ceid=JP:ja`;

  try {
    const response = await fetch(rssUrl);
    const data = await response.text();

    if (!data) {
      throw new Error('No content found');
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");
    const items = xmlDoc.querySelectorAll("item");

    const newsItems: NewsItem[] = Array.from(items).map((item) => {
      const title = item.querySelector("title")?.textContent || "";
      const link = item.querySelector("link")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || "";
      // description often contains HTML, stripping it for cleaner view might be needed,
      // but for now we keep it or basic text extraction.
      // Google News description is often just a link list, so we might want to clean it up or use it as is.
      // Let's try to extract text content if it's HTML
      let description = item.querySelector("description")?.textContent || "";
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = description;
      description = tempDiv.textContent || description;

      const source = item.querySelector("source")?.textContent || "Google News";

      return {
        title,
        link,
        pubDate,
        description,
        source
      };
    });

    return newsItems;
  } catch (error) {
    console.error("Error fetching news:", error);
    // Rethrow or return empty array depending on needs, but logging is crucial for debug
    throw error;
  }
};
