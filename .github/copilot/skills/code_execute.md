# code_execute

## Description
在安全的沙箱环境中执行代码，支持多种编程语言。

## Category
code

## Parameters

### code (required)
- Type: string
- Description: 需要执行的代码字符串

### language (required)
- Type: string
- Description: 编程语言
- Allowed values: python, javascript, typescript, bash

### timeout (optional)
- Type: number
- Description: 执行超时时间（秒）
- Default: 30
- Range: 1-300

### stdin (optional)
- Type: string
- Description: 标准输入内容

## Returns
返回包含以下字段的对象：
- `stdout`: 标准输出内容
- `stderr`: 标准错误输出
- `exit_code`: 退出代码（0 表示成功）
- `execution_time`: 执行时间（毫秒）

## Example Usage

### Example 1: Execute Python Code
**Input:**
```json
{
  "code": "print('Hello, World!')\\nprint(2 + 2)",
  "language": "python"
}
```

**Output:**
```json
{
  "stdout": "Hello, World!\\n4\\n",
  "stderr": "",
  "exit_code": 0,
  "execution_time": 45
}
```

### Example 2: Execute with Input
**Input:**
```json
{
  "code": "name = input('Enter name: ')\\nprint(f'Hello, {name}!')",
  "language": "python",
  "stdin": "Alice"
}
```

**Output:**
```json
{
  "stdout": "Enter name: Hello, Alice!\\n",
  "stderr": "",
  "exit_code": 0,
  "execution_time": 52
}
```

### Example 3: Handle Error
**Input:**
```json
{
  "code": "console.log(undefinedVariable);",
  "language": "javascript"
}
```

**Output:**
```json
{
  "stdout": "",
  "stderr": "ReferenceError: undefinedVariable is not defined",
  "exit_code": 1,
  "execution_time": 23
}
```

## Usage Instructions
1. 准备要执行的代码
2. 指定编程语言
3. 设置超时时间（可选）
4. 如果需要输入，提供 stdin
5. 调用 code_execute 技能
6. 检查 exit_code 确认执行状态
7. 查看 stdout 和 stderr 获取输出

## Security Notes
- 代码在隔离的沙箱环境中执行
- 限制了系统资源访问
- 自动应用执行超时
- 不支持网络访问（某些语言）

## Related Skills
- code_analyze: 代码分析
- code_generate_tests: 生成测试
- file_write: 保存输出结果
