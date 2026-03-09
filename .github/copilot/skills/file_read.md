# file_read

## Description
读取指定路径的文件内容，支持文本文件和二进制文件（返回 Base64 编码）。

## Category
file

## Parameters

### path (required)
- Type: string
- Description: 文件的绝对或相对路径

### encoding (optional)
- Type: string
- Description: 文件编码方式
- Allowed values: utf8, ascii, base64, binary
- Default: utf8

## Returns
返回包含以下字段的对象：
- `content`: 文件内容（文本或 Base64 编码）
- `size`: 文件大小（字节）
- `encoding`: 实际使用的编码方式

## Example Usage

### Example 1: Read Text File
**Input:**
```json
{
  "path": "./config.json",
  "encoding": "utf8"
}
```

**Output:**
```json
{
  "content": "{\n  \"name\": \"MyApp\",\n  \"version\": \"1.0.0\"\n}",
  "size": 42,
  "encoding": "utf8"
}
```

### Example 2: Read Binary File
**Input:**
```json
{
  "path": "./image.png",
  "encoding": "base64"
}
```

**Output:**
```json
{
  "content": "iVBORw0KGgoAAAANSUhEUgA...",
  "size": 15234,
  "encoding": "base64"
}
```

## Usage Instructions
1. 确定要读取的文件路径
2. 如果是文本文件，使用默认的 utf8 编码
3. 如果是二进制文件（图片、视频等），指定 base64 编码
4. 调用 file_read 技能
5. 处理返回的文件内容

## Related Skills
- file_write: 写入文件
- file_list: 列出目录内容
