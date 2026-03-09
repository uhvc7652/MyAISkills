# web_search

## Description
执行网络搜索，获取相关信息和结果摘要。

## Category
web

## Parameters

### query (required)
- Type: string
- Description: 搜索查询字符串

### max_results (optional)
- Type: number
- Description: 返回的最大结果数量
- Default: 10
- Range: 1-50

### language (optional)
- Type: string
- Description: 搜索结果的语言
- Examples: zh-CN, en-US, ja-JP
- Default: auto

## Returns
返回包含以下字段的对象：
- `query`: 原始搜索查询
- `results`: 搜索结果列表，每项包含：
  - `title`: 页面标题
  - `url`: 页面链接
  - `snippet`: 内容摘要
  - `source`: 来源网站

## Example Usage

### Example 1: Basic Search
**Input:**
```json
{
  "query": "Python async programming",
  "max_results": 5
}
```

**Output:**
```json
{
  "query": "Python async programming",
  "results": [
    {
      "title": "Async IO in Python: A Complete Walkthrough",
      "url": "https://realpython.com/async-io-python/",
      "snippet": "This tutorial will give you a firm grasp of Python's approach to async IO...",
      "source": "Real Python"
    }
  ]
}
```

## Usage Instructions
1. 构造搜索查询字符串
2. 设置需要的结果数量（可选）
3. 指定语言偏好（可选）
4. 调用 web_search 技能
5. 处理返回的搜索结果
6. 如需详细内容，使用 web_fetch 获取完整页面

## Related Skills
- web_fetch: 获取网页内容
