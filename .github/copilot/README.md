# GitHub Copilot Skills

这个目录包含了可以在 VS Code 中通过 GitHub Copilot 使用的 AI 技能定义。

## 文件结构

```
.github/copilot/
├── README.md           # 本文件
├── USAGE_GUIDE.md      # 详细使用指南
├── instructions.md     # Copilot 主入口文件
└── skills/             # 技能定义文件
    ├── code_analyze.md
    ├── file_read.md
    └── ...
```

## 什么是 Copilot Skills？

GitHub Copilot Skills 是一种让 AI 助手理解项目特定功能的方法。通过在 `.github/copilot/` 目录中放置 Markdown 文件，你可以：

- 📚 教会 Copilot 了解你的自定义工具和 API
- 🎯 提供结构化的指导，帮助 AI 更准确地理解需求
- 🔧 定义可重用的操作模板
- 📖 为团队提供统一的 AI 交互方式

## 快速开始

### 基础使用

1. 在 VS Code 中打开包含此目录的项目
2. 打开 Copilot Chat（`Ctrl+Shift+I` 或 `Cmd+Shift+I`）
3. 询问 AI 关于技能的问题，例如：
   ```
   使用 code_analyze 技能分析我的代码安全问题
   ```

### 在对话中使用技能

你可以通过多种方式让 Copilot 使用这些技能：

**直接引用技能名称**：
```
使用 file_read 技能读取 package.json
```

**描述你想做的事**：
```
帮我分析这段代码的性能问题（AI 会自动选择 code_analyze 技能）
```

**组合多个技能**：
```
先用 file_list 找到所有测试文件，然后用 code_analyze 检查它们
```

## 可用技能

### 🔨 代码类
| 技能 | 描述 |
|------|------|
| `code_analyze` | 代码静态分析，检查语法、风格、安全问题 |
| `code_refactor_suggest` | 提供代码重构建议 |
| `code_add_comments` | 自动添加代码注释 |
| `code_add_jsdoc` | 生成 JSDoc 文档注释 |
| `code_generate_tests` | 生成单元测试用例 |
| `code_execute` | 在沙箱环境执行代码 |

### 📁 文件类
| 技能 | 描述 |
|------|------|
| `file_read` | 读取文件内容 |
| `file_write` | 写入文件内容 |
| `file_list` | 列出目录内容 |

### 🌐 网络类
| 技能 | 描述 |
|------|------|
| `web_search` | 执行网络搜索 |
| `web_fetch` | 获取网页内容 |

### 📊 数据类
| 技能 | 描述 |
|------|------|
| `data_parse_json` | 解析和验证 JSON |
| `data_transform` | 数据转换和格式化 |

### 🛠️ 工具类
| 技能 | 描述 |
|------|------|
| `get_current_time` | 获取当前时间 |
| `calculate` | 数学计算 |

## 使用示例

### 示例 1: 代码安全检查

**输入**：
```
使用 code_analyze 检查以下代码的安全问题：

function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id=" + userId;
  return db.query(query);
}
```

**Copilot 会**：
- 识别 SQL 注入漏洞
- 提供修复建议
- 给出代码质量评分

### 示例 2: 生成测试

**输入**：
```
用 code_generate_tests 为 add 函数生成 Jest 测试用例
```

**Copilot 会**：
- 生成全面的测试用例
- 包括正向测试、负向测试和边界测试
- 使用指定的测试框架

### 示例 3: 数据转换

**输入**：
```
使用 data_transform 将这个对象转换为 CSV 格式：
[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]
```

**Copilot 会**：
- 将 JSON 转换为 CSV
- 提供转换后的结果
- 说明应用的转换规则

## 技能文档格式

每个技能文档（.md 文件）包含以下部分：

```markdown
# skill_name

## Description
技能的功能描述

## Category
技能所属类别

## Parameters
输入参数的详细说明

## Returns
返回值的结构说明

## Example Usage
具体使用示例

## Usage Instructions
使用步骤指南

## Related Skills
相关联的其他技能
```

## 高级用法

### 自定义技能

你可以创建自己的技能定义：

1. 在 `skills/` 目录创建新的 `.md` 文件
2. 遵循现有技能的格式
3. 包含清晰的参数说明和示例
4. 重启 VS Code 或重新加载窗口

### 在其他项目中使用

**方法 1 - 复制**：
```bash
cp -r .github/copilot /path/to/your/project/.github/
```

**方法 2 - 符号链接**（推荐）：
```bash
cd /path/to/your/project
mkdir -p .github
ln -s /path/to/MyAISkills/.github/copilot .github/copilot
```

### 团队协作

- 将技能定义提交到团队仓库
- 团队成员自动获得相同的 AI 技能
- 统一的 AI 交互体验
- 易于维护和更新

## 与 JSON Skills 的区别

本仓库同时提供两种格式：

| 特性 | Markdown（本目录） | JSON（`skills/` 目录） |
|------|-------------------|---------------------|
| **用途** | VS Code Copilot 指导 | API Function Calling |
| **执行** | 不执行，仅指导 AI | 可实际执行 |
| **格式** | Markdown 文档 | JSON + JS 实现 |
| **使用场景** | 开发辅助、代码生成 | 应用集成、自动化 |

**选择建议**：
- 在 VS Code 中编码时 → 使用 Markdown 技能
- 在应用中集成 AI → 使用 JSON 技能
- 两者可以共存，互不影响

## 常见问题

**Q: Copilot 没有识别我的技能？**  
A: 确保文件在 `.github/copilot/` 目录下，然后重新加载 VS Code 窗口。

**Q: 技能可以实际执行代码吗？**  
A: Markdown 技能主要用于指导 AI，不实际执行。如需执行，请使用 `skills/` 目录下的 JSON + JS 实现。

**Q: 如何让 Copilot 更好地使用技能？**  
A: 在询问时明确提到技能名称，提供清晰的上下文和参数。

**Q: 可以修改现有技能吗？**  
A: 可以！直接编辑 `.md` 文件，保存后重新加载窗口即可。

## 更多资源

- 📖 [详细使用指南](./USAGE_GUIDE.md)
- 📝 [技能定义标准](../../README.md#技能格式)
- 💡 [贡献新技能](../../README.md#贡献技能)
- 🔗 [GitHub Copilot 官方文档](https://docs.github.com/en/copilot)

## 贡献

欢迎贡献新的技能定义！请：

1. Fork 本仓库
2. 创建新的技能 `.md` 文件
3. 遵循现有格式
4. 提交 Pull Request

## 许可证

MIT
