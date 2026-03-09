# get_current_time

## Description
获取当前时间，支持多种时区和格式化选项。

## Category
utility

## Parameters

### timezone (optional)
- Type: string
- Description: 时区标识符
- Examples: UTC, America/New_York, Asia/Shanghai, Europe/London
- Default: UTC

### format (optional)
- Type: string
- Description: 时间格式
- Allowed values: iso8601, unix, human
- Default: iso8601

## Returns
返回包含以下字段的对象：
- `time`: 格式化的时间字符串
- `timezone`: 使用的时区
- `timestamp`: Unix 时间戳（毫秒）

## Example Usage

### Example 1: Get UTC Time
**Input:**
```json
{
  "timezone": "UTC",
  "format": "iso8601"
}
```

**Output:**
```json
{
  "time": "2024-03-09T10:30:00.000Z",
  "timezone": "UTC",
  "timestamp": 1709981400000
}
```

### Example 2: Get Local Time in Human Format
**Input:**
```json
{
  "timezone": "Asia/Shanghai",
  "format": "human"
}
```

**Output:**
```json
{
  "time": "2024年3月9日 18:30:00",
  "timezone": "Asia/Shanghai",
  "timestamp": 1709981400000
}
```

### Example 3: Get Unix Timestamp
**Input:**
```json
{
  "format": "unix"
}
```

**Output:**
```json
{
  "time": "1709981400",
  "timezone": "UTC",
  "timestamp": 1709981400000
}
```

## Usage Instructions
1. 确定需要的时区（可选，默认 UTC）
2. 选择时间格式（ISO 8601、Unix 时间戳或人类可读格式）
3. 调用 get_current_time 技能
4. 使用返回的时间信息

## Related Skills
- calculate: 数学计算
- file_write: 写入文件（如记录日志）
