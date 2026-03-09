---
name: web
description: Web-related skills for searching and fetching online content
category: web
version: 1.0.0
---

# Web Skills

This directory contains skills for interacting with the web, including searching the internet and fetching web content.

## Available Skills

### web_search
Search for information on the internet. Use this when users ask about latest news, current events, facts, or any content that requires online searching.

**Usage**: When you need to find current information, news, facts, or any content that requires internet search.

**Features**:
- Natural language query support
- Customizable number of results
- Language preference settings
- Returns title, URL, and snippet for each result

### web_fetch
Fetch and retrieve content from web pages. Extract text, HTML, or specific data from URLs.

**Usage**: When you need to retrieve content from specific websites, scrape web data, or access online resources.

**Features**:
- Fetch HTML content
- Extract text from web pages
- Support for various HTTP methods
- Handle redirects and authentication

## Examples

### Search the Web
```javascript
// Search for latest AI model rankings
web_search({
  query: "2025年最新AI大模型排行",
  num_results: 5,
  language: "zh-CN"
})
```

### Fetch Web Content
```javascript
// Fetch content from a URL
web_fetch({
  url: "https://example.com/article",
  extract_text: true
})
```

## Use Cases

- **Information Retrieval**: Find latest news, facts, or research
- **Content Analysis**: Fetch and analyze web content
- **Data Collection**: Scrape data from websites
- **Research**: Gather information from multiple sources
- **Fact Checking**: Verify information with online sources
- **News Monitoring**: Track latest developments on specific topics

## Best Practices

- Use `web_search` for general information discovery
- Use `web_fetch` when you have a specific URL to retrieve
- Always respect website terms of service and robots.txt
- Cache frequently accessed content to reduce network requests
