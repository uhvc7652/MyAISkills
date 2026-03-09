# file_list

## Description
列出指定目录下的所有文件和子目录，支持递归列举和过滤功能。

## Category
file

## Parameters

### path (required)
- Type: string
- Description: 目录路径（绝对或相对路径）

### recursive (optional)
- Type: boolean
- Description: 是否递归列出子目录内容
- Default: false

### filter (optional)
- Type: string
- Description: 文件名过滤模式（支持通配符 *, ?）
- Example: "*.js", "test_*.py"

## Returns
返回包含以下字段的对象：
- `path`: 扫描的目录路径
- `items`: 文件和目录列表，每项包含：
  - `name`: 文件/目录名
  - `type`: 类型（file 或 directory）
  - `size`: 文件大小（仅文件，字节）
  - `modified`: 最后修改时间（ISO 8601 格式）

## Example Usage

### Example 1: List Directory
**Input:**
```json
{
  "path": "./src",
  "recursive": false
}
```

**Output:**
```json
{
  "path": "./src",
  "items": [
    {
      "name": "index.js",
      "type": "file",
      "size": 1024,
      "modified": "2024-03-09T10:30:00Z"
    },
    {
      "name": "utils",
      "type": "directory",
      "modified": "2024-03-08T15:20:00Z"
    }
  ]
}
```

### Example 2: Recursive List with Filter
**Input:**
```json
{
  "path": "./src",
  "recursive": true,
  "filter": "*.test.js"
}
```

**Output:**
```json
{
  "path": "./src",
  "items": [
    {
      "name": "index.test.js",
      "type": "file",
      "size": 512,
      "modified": "2024-03-09T10:30:00Z"
    },
    {
      "name": "utils/helper.test.js",
      "type": "file",
      "size": 768,
      "modified": "2024-03-08T15:20:00Z"
    }
  ]
}
```

## Usage Instructions
1. 指定要列出的目录路径
2. 决定是否需要递归扫描子目录
3. 如果只需要特定类型的文件，设置过滤模式
4. 调用 file_list 技能
5. 处理返回的文件列表

## Related Skills
- file_read: 读取文件
- file_write: 写入文件
