# file_write

## Description
将内容写入到指定路径的文件，支持创建新文件或覆盖现有文件。

## Category
file

## Parameters

### path (required)
- Type: string
- Description: 目标文件的路径（绝对或相对路径）

### content (required)
- Type: string
- Description: 要写入的内容（文本或 Base64 编码的二进制数据）

### encoding (optional)
- Type: string
- Description: 内容编码方式
- Allowed values: utf8, ascii, base64, binary
- Default: utf8

### mode (optional)
- Type: string
- Description: 写入模式
- Allowed values: overwrite, append
- Default: overwrite

## Returns
返回包含以下字段的对象：
- `path`: 写入的文件路径
- `size`: 写入的字节数
- `mode`: 使用的写入模式

## Example Usage

### Example 1: Write Text File
**Input:**
```json
{
  "path": "./output.txt",
  "content": "Hello, World!",
  "encoding": "utf8",
  "mode": "overwrite"
}
```

**Output:**
```json
{
  "path": "./output.txt",
  "size": 13,
  "mode": "overwrite"
}
```

### Example 2: Append to File
**Input:**
```json
{
  "path": "./log.txt",
  "content": "\\n[2024-03-09] New log entry",
  "mode": "append"
}
```

**Output:**
```json
{
  "path": "./log.txt",
  "size": 28,
  "mode": "append"
}
```

## Usage Instructions
1. 确定目标文件路径
2. 准备要写入的内容
3. 选择适当的编码方式（文本使用 utf8，二进制使用 base64）
4. 选择写入模式（覆盖或追加）
5. 调用 file_write 技能
6. 确认写入成功

## Related Skills
- file_read: 读取文件
- file_list: 列出目录内容
