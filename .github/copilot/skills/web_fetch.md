# web_fetch

## Description
获取指定 URL 的网页内容，支持 HTML 和纯文本提取。

## Category
web

## Parameters

### url (required)
- Type: string
- Description: 要获取的网页 URL

### format (optional)
- Type: string
- Description: 返回内容格式
- Allowed values: html, text, markdown
- Default: text

### timeout (optional)
- Type: number
- Description: 请求超时时间（秒）
- Default: 30
- Range: 5-120

## Returns
返回包含以下字段的对象：
- `url`: 请求的 URL
- `content`: 网页内容（根据 format 参数格式化）
- `title`: 页面标题
- `status`: HTTP 状态码

## Example Usage

### Example 1: Fetch as Text
**Input:**
```json
{
  "url": "https://example.com/article",
  "format": "text",
  "timeout": 30
}
```

**Output:**
```json
{
  "url": "https://example.com/article",
  "content": "Example Domain\\n\\nThis domain is for use in illustrative examples...",
  "title": "Example Domain",
  "status": 200
}
```

### Example 2: Fetch as Markdown
**Input:**
```json
{
  "url": "https://github.com/user/repo/README.md",
  "format": "markdown"
}
```

**Output:**
```json
{
  "url": "https://github.com/user/repo/README.md",
  "content": "# Project Title\\n\\n## Description\\n\\nThis is a sample project...",
  "title": "README.md",
  "status": 200
}
```

## Usage Instructions
1. 确定要获取的网页 URL
2. 选择合适的内容格式
3. 设置超时时间（可选）
4. 调用 web_fetch 技能
5. 处理返回的网页内容
6. 根据需要进行进一步解析或处理

## Related Skills
- web_search: 网络搜索
- data_parse_json: JSON 解析
