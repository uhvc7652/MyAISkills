# VS Code 中使用 AI 技能指南

本指南说明如何在 VS Code 中使用这些 Markdown 格式的 AI 技能。

## 什么是 GitHub Copilot Skills？

GitHub Copilot Skills 是一种让 AI 助手（GitHub Copilot）了解特定功能和工具的方法。通过在项目中放置 `.github/copilot/` 目录，Copilot 可以自动识别并使用这些技能定义。

## 前置要求

1. **安装 VS Code**
   - 下载地址：https://code.visualstudio.com/

2. **安装 GitHub Copilot 扩展**
   - 在 VS Code 中打开扩展面板（Ctrl+Shift+X 或 Cmd+Shift+X）
   - 搜索 "GitHub Copilot"
   - 点击安装
   - 需要有 GitHub Copilot 订阅（学生和开源维护者可以免费使用）

3. **克隆本仓库**
   ```bash
   git clone https://github.com/uhvc7652/MyAISkills.git
   cd MyAISkills
   ```

## 如何使用

### 方法 1: 在本项目中使用

1. 用 VS Code 打开 MyAISkills 目录
   ```bash
   code .
   ```

2. 打开 Copilot Chat（Ctrl+Shift+I 或 Cmd+Shift+I）

3. 在 Chat 中询问 AI 关于技能的问题，例如：
   - "如何使用 code_analyze 技能分析代码？"
   - "帮我用 file_read 读取 package.json 文件"
   - "使用 calculate 技能计算 sqrt(144) + pow(2, 3)"

4. Copilot 会自动参考 `.github/copilot/skills/` 目录中的技能文档来理解你的需求

### 方法 2: 在其他项目中使用这些技能

如果你想在其他项目中使用这些技能定义：

1. **复制技能文件到你的项目**
   ```bash
   # 在你的项目根目录执行
   mkdir -p .github/copilot
   cp -r /path/to/MyAISkills/.github/copilot/* .github/copilot/
   ```

2. **或者使用符号链接**（推荐，便于更新）
   ```bash
   # 在你的项目根目录执行
   mkdir -p .github
   ln -s /path/to/MyAISkills/.github/copilot .github/copilot
   ```

3. 重新加载 VS Code 窗口（Ctrl+Shift+P -> "Reload Window"）

4. 现在你可以在任何项目中使用这些技能了！

## 使用示例

### 示例 1: 代码分析

在 Copilot Chat 中输入：
```
@workspace 使用 code_analyze 技能分析这段代码的安全问题：

function login(username, password) {
  const query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'";
  return db.execute(query);
}
```

Copilot 会参考 `code_analyze.md` 技能定义，识别出 SQL 注入漏洞。

### 示例 2: 生成测试

在 Copilot Chat 中输入：
```
使用 code_generate_tests 技能为这个函数生成测试用例：

function add(a, b) {
  return a + b;
}

使用 jest 框架，生成全面的测试
```

### 示例 3: 文件操作

在 Copilot Chat 中输入：
```
使用 file_list 技能列出 src 目录下所有的 .js 文件，递归搜索
```

## 可用的技能列表

### 代码类 (Code)
- **code_analyze** - 静态代码分析，检查语法、风格、安全问题
- **code_refactor_suggest** - 提供代码重构建议
- **code_add_comments** - 自动添加代码注释
- **code_add_jsdoc** - 生成 JSDoc 文档注释
- **code_generate_tests** - 生成单元测试用例
- **code_execute** - 在沙箱环境中执行代码

### 文件类 (File)
- **file_read** - 读取文件内容
- **file_write** - 写入文件内容
- **file_list** - 列出目录内容

### 网络类 (Web)
- **web_search** - 执行网络搜索
- **web_fetch** - 获取网页内容

### 数据类 (Data)
- **data_parse_json** - 解析和验证 JSON
- **data_transform** - 数据转换和格式化

### 工具类 (Utility)
- **get_current_time** - 获取当前时间
- **calculate** - 数学计算

## 技能文档格式

每个技能文档包含：
- **Description**: 技能功能说明
- **Category**: 技能类别
- **Parameters**: 输入参数及类型
- **Returns**: 返回值结构
- **Example Usage**: 使用示例
- **Usage Instructions**: 使用步骤
- **Related Skills**: 相关技能

## 与 JSON 格式的区别

本仓库提供两种格式的技能定义：

| 特性 | Markdown 格式 | JSON 格式 |
|------|--------------|-----------|
| 用途 | VS Code / GitHub Copilot | OpenAI / Anthropic API |
| 位置 | `.github/copilot/` | `skills/` |
| 调用方式 | Copilot Chat 对话 | Function Calling API |
| 实现 | 无需实现代码 | 配套 .js 实现文件 |

Markdown 格式主要用于**指导 AI 理解你的需求**，而不是实际执行代码。
JSON 格式则用于在应用程序中通过 API 调用实际的技能实现。

## 提示和技巧

1. **明确引用技能名称**: 在询问时明确提到技能名称，如 "使用 code_analyze 技能..."

2. **提供完整上下文**: 给 AI 提供足够的信息，包括代码片段、文件路径等

3. **参考示例**: 查看每个技能的 Example Usage 部分，了解如何正确使用

4. **组合使用**: 可以要求 AI 组合使用多个技能，例如先 file_read 读取文件，再用 code_analyze 分析

5. **自定义技能**: 你可以参考现有技能的格式，创建自己的技能文档

## 故障排除

**问题**: Copilot 没有识别技能
- 确保 `.github/copilot/` 目录在项目根目录
- 重新加载 VS Code 窗口
- 检查技能文件是否为 .md 格式

**问题**: Copilot 不理解技能参数
- 在技能文档中查看参数说明
- 提供更详细的示例
- 参考技能文档中的 Example Usage

**问题**: 想要实际执行这些技能
- Markdown 技能主要用于指导 AI，不能直接执行
- 如需执行，请使用 `skills/` 目录下的 JSON + JS 实现
- 或者参考 `examples/` 目录中的示例代码

## 贡献

欢迎提交新的技能定义！请参考现有技能的格式创建新的 .md 文件。

## 许可证

MIT
