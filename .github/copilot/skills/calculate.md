# calculate

## Description
执行数学计算，支持基本运算、科学计算和数学表达式求值。

## Category
utility

## Parameters

### expression (required)
- Type: string
- Description: 数学表达式（支持标准数学运算符和函数）
- Examples: "2 + 3 * 4", "sqrt(16)", "sin(pi/2)"

### precision (optional)
- Type: number
- Description: 结果保留的小数位数
- Default: -1 (不限制)
- Range: -1 到 15

### unit (optional)
- Type: string
- Description: 角度单位（用于三角函数）
- Allowed values: radians, degrees
- Default: radians

## Returns
返回包含以下字段的对象：
- `result`: 计算结果
- `expression`: 原始表达式
- `formatted`: 格式化的结果字符串

## Example Usage

### Example 1: Basic Calculation
**Input:**
```json
{
  "expression": "2 + 3 * 4",
  "precision": 2
}
```

**Output:**
```json
{
  "result": 14.00,
  "expression": "2 + 3 * 4",
  "formatted": "14.00"
}
```

### Example 2: Scientific Calculation
**Input:**
```json
{
  "expression": "sqrt(144) + pow(2, 3)",
  "precision": 0
}
```

**Output:**
```json
{
  "result": 20,
  "expression": "sqrt(144) + pow(2, 3)",
  "formatted": "20"
}
```

### Example 3: Trigonometric Function
**Input:**
```json
{
  "expression": "sin(90)",
  "unit": "degrees",
  "precision": 4
}
```

**Output:**
```json
{
  "result": 1.0000,
  "expression": "sin(90)",
  "formatted": "1.0000"
}
```

## Supported Functions
- Basic: +, -, *, /, %, ^, ()
- Mathematical: sqrt, pow, abs, ceil, floor, round
- Trigonometric: sin, cos, tan, asin, acos, atan
- Logarithmic: log, log10, log2, exp
- Constants: pi, e

## Usage Instructions
1. 构造数学表达式
2. 设置精度（可选）
3. 如果使用三角函数，指定角度单位
4. 调用 calculate 技能
5. 使用返回的计算结果

## Related Skills
- get_current_time: 获取当前时间
- data_transform: 数据转换
