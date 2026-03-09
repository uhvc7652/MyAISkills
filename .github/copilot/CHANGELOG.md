# 更新说明 - GitHub Copilot 技能支持

## 问题背景

用户反馈：希望技能是 Markdown 格式（.md 文件），可以在 VS Code 中通过 `/` 命令使用，类似 GitHub Copilot 的用法。

原有实现：仅提供 JSON 格式的技能定义，用于 OpenAI Function Calling 和 Anthropic Tool Use API。

## 解决方案

保持原有 JSON 格式不变，新增 **GitHub Copilot 专用的 Markdown 格式技能**。

现在仓库支持两种格式：

### 1. Markdown 格式（新增）
- **位置**: `.github/copilot/`
- **用途**: VS Code 中的 GitHub Copilot
- **使用方式**: 在 Copilot Chat 中对话使用
- **特点**: 指导 AI 理解需求，不实际执行代码

### 2. JSON 格式（保留）
- **位置**: `skills/`
- **用途**: OpenAI/Anthropic API 集成
- **使用方式**: 通过 Function Calling API
- **特点**: 可实际执行，有 JavaScript 实现

## 新增内容

### 目录结构
```
.github/copilot/
├── README.md              # Copilot 技能使用说明
├── USAGE_GUIDE.md         # 详细使用指南（中文）
├── instructions.md        # Copilot 主入口文件
└── skills/                # 15 个 Markdown 技能文件
    ├── code_analyze.md
    ├── code_refactor_suggest.md
    ├── code_add_comments.md
    ├── code_add_jsdoc.md
    ├── code_generate_tests.md
    ├── code_execute.md
    ├── file_read.md
    ├── file_write.md
    ├── file_list.md
    ├── web_search.md
    ├── web_fetch.md
    ├── data_parse_json.md
    ├── data_transform.md
    ├── get_current_time.md
    └── calculate.md
```

### 技能分类
- **代码类** (6): 分析、重构、注释、文档、测试、执行
- **文件类** (3): 读取、写入、列表
- **网络类** (2): 搜索、抓取
- **数据类** (2): JSON 解析、数据转换
- **工具类** (2): 时间、计算

## 使用方法

### 快速开始

1. **克隆仓库**
   ```bash
   git clone https://github.com/uhvc7652/MyAISkills.git
   ```

2. **在 VS Code 中打开**
   ```bash
   cd MyAISkills
   code .
   ```

3. **使用 Copilot**
   - 打开 Copilot Chat（Ctrl+Shift+I）
   - 询问："使用 code_analyze 分析这段代码..."
   - Copilot 会自动参考技能文档

### 使用示例

**示例 1: 代码分析**
```
使用 code_analyze 技能检查以下代码的安全问题：

function login(username, password) {
  const sql = "SELECT * FROM users WHERE name='" + username + "'";
  return db.query(sql);
}
```

**示例 2: 生成测试**
```
用 code_generate_tests 为 multiply 函数生成 Jest 测试，包括边界情况
```

**示例 3: 文件操作**
```
使用 file_list 递归列出 src 目录下所有 .js 文件
```

## 技能文档格式

每个技能包含：
- **Description**: 功能说明
- **Category**: 分类
- **Parameters**: 参数说明（类型、描述、默认值）
- **Returns**: 返回值结构
- **Example Usage**: 使用示例（输入/输出）
- **Usage Instructions**: 使用步骤
- **Related Skills**: 相关技能

## 两种格式对比

| 特性 | Markdown（新增） | JSON（保留） |
|------|----------------|-------------|
| 位置 | `.github/copilot/` | `skills/` |
| 用途 | VS Code Copilot | API 集成 |
| 格式 | .md 文档 | .json + .js |
| 执行 | 不执行（指导 AI） | 可执行 |
| 使用 | 对话式交互 | Function Calling |

## 注意事项

1. **Markdown 技能不执行代码**
   - 仅用于指导 Copilot 理解需求
   - 如需实际执行，使用 JSON 格式技能

2. **需要 GitHub Copilot 订阅**
   - 学生和开源维护者可免费使用
   - 企业用户需购买许可

3. **技能自动识别**
   - VS Code 自动识别 `.github/copilot/` 目录
   - 无需额外配置

4. **可自定义扩展**
   - 参考现有格式创建新技能
   - 适用于团队特定需求

## 兼容性

- ✅ **完全向后兼容**：原有 JSON 技能不受影响
- ✅ **两种格式共存**：可同时使用 Markdown 和 JSON 技能
- ✅ **独立使用**：可单独使用任一格式

## 相关文档

- [Copilot 技能 README](.github/copilot/README.md)
- [详细使用指南](.github/copilot/USAGE_GUIDE.md)
- [主 README](README.md)

## 反馈

如有问题或建议，欢迎：
- 提交 Issue
- 创建 Pull Request
- 在 Discussions 中讨论

---

**更新时间**: 2026-03-09  
**版本**: v1.0 - 首次发布 Markdown 格式技能
