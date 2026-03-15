# MyAISkills — AI 技能仓库

[English](README_EN.md) | 中文

一个结构化的、可供 AI 代理直接使用的技能（工具）定义仓库。所有技能定义和实现都集中在 `skills/` 目录下，支持：

- **OpenAI Function Calling** - 通过 JSON 格式的技能定义
- **Anthropic Tool Use** - 直接使用 JSON schema  
- **Node.js 项目集成** - 通过 npm link 和注册表 API
- **Python 等其他语言** - 通过环境变量访问技能目录

📖 **详细使用示例请参阅 [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md)**

---

## 目录结构

```
MyAISkills/
├── skills/                  # 所有技能定义和实现（按类别组织）
│   ├── types.js             # 全局 JSDoc 类型定义
│   ├── index.js             # 技能注册表（统一入口）
│   ├── web/                 # 网络相关技能
│   │   ├── web_search.json  # 技能定义（供 AI 读取）
│   │   ├── web_search.js    # 技能实现（含 JSDoc 注释）
│   │   ├── web_fetch.json
│   │   └── web_fetch.js
│   ├── code/                # 代码相关技能
│   │   ├── code_execute.json
│   │   ├── code_execute.js
│   │   ├── code_analyze.json
│   │   ├── code_analyze.js
│   │   ├── code_add_jsdoc.json
│   │   ├── code_add_jsdoc.js
│   │   ├── code_add_comments.json
│   │   ├── code_add_comments.js
│   │   ├── code_refactor_suggest.json
│   │   ├── code_refactor_suggest.js
│   │   ├── code_generate_tests.json
│   │   └── code_generate_tests.js
│   ├── file/                # 文件操作技能
│   │   ├── file_read.json
│   │   ├── file_read.js
│   │   ├── file_write.json
│   │   ├── file_write.js
│   │   ├── file_list.json
│   │   └── file_list.js
│   ├── data/                # 数据处理技能
│   │   ├── data_parse_json.json
│   │   ├── data_parse_json.js
│   │   ├── data_transform.json
│   │   └── data_transform.js
│   └── utility/             # 通用工具技能
│       ├── get_current_time.json
│       ├── get_current_time.js
│       ├── calculate.json
│       ├── calculate.js
│       ├── requirements_clarify.json
│       └── requirements_clarify.js
├── schema/                  # 技能定义的 JSON Schema
│   └── skill.schema.json
├── scripts/                 # 辅助脚本
│   ├── validate-skills.js   # 验证技能定义
│   └── check-setup.js       # 检查安装设置
├── bin/                     # CLI 工具
│   └── myaiskills.js        # 命令行工具
├── examples/                # 使用示例
│   ├── openai_function_calling.py
│   └── anthropic_tool_use.py
├── index.js                 # 包入口文件
└── package.json             # npm 包配置
```

> **技能格式说明**：
> 每个技能由一对同名文件组成：
> - **`.json` 文件** - 描述技能的接口（name, description, parameters, returns）
> - **`.js` 文件** - 提供技能的实际实现代码

---

## 技能格式

每个技能文件均为一个 JSON 对象，遵循 `schema/skill.schema.json` 定义：

```json
{
  "name": "skill_name",
  "description": "技能功能描述（供 AI 理解并决定何时调用）",
  "category": "web | code | file | data | utility",
  "version": "1.0.0",
  "parameters": {
    "type": "object",
    "properties": {
      "param_name": {
        "type": "string",
        "description": "参数说明"
      }
    },
    "required": ["param_name"]
  },
  "returns": {
    "type": "object",
    "description": "返回值结构说明"
  },
  "examples": [
    {
      "input": { "param_name": "示例值" },
      "output": { "result": "示例返回" }
    }
  ]
}
```

---

## 快速开始

### 安装和验证

```bash
# 1. 克隆仓库
git clone https://github.com/uhvc7652/MyAISkills.git
cd MyAISkills

# 2. 链接到全局（可选，用于其他项目访问）
npm link

# 3. 验证安装是否正确
npm run check-setup

# 4. 验证所有技能定义
npm run validate
```

### 技能列表

所有技能都位于 `skills/` 目录下，按类别组织：

**代码类 (Code)** - `skills/code/`
- `code_analyze` - 代码静态分析
- `code_refactor_suggest` - 重构建议
- `code_add_comments` - 添加注释
- `code_add_jsdoc` - 生成 JSDoc 文档
- `code_generate_tests` - 生成测试用例
- `code_execute` - 执行代码

**文件类 (File)** - `skills/file/`
- `file_read` - 读取文件
- `file_write` - 写入文件
- `file_list` - 列出目录

**网络类 (Web)** - `skills/web/`
- `web_search` - 网络搜索
- `web_fetch` - 获取网页内容

**数据类 (Data)** - `skills/data/`
- `data_parse_json` - JSON 解析
- `data_transform` - 数据转换

**工具类 (Utility)** - `skills/utility/`
- `get_current_time` - 获取当前时间
- `calculate` - 数学计算
- `requirements_clarify` - 需求澄清与方案取舍问题生成

---

### 作为本机全局 Skills 使用（Node.js / Python）

这个仓库可以在本地克隆后，作为本机所有项目共享的一套通用 skills。

```bash
git clone https://github.com/uhvc7652/MyAISkills.git
cd MyAISkills
npm link

# 建议写入 ~/.zshrc、~/.bashrc 等 shell 配置
export MYAI_SKILLS_ROOT="$(myaiskills repo)"
export MYAI_SKILLS_DIR="$(myaiskills skills)"
export MYAI_SKILL_SCHEMA="$(myaiskills schema)"
```

- Node.js 项目可直接 `require('myaiskills')`
- Python / 其他语言项目可直接读取 `MYAI_SKILLS_DIR` 指向的 skills 目录
- `myaiskills paths` 可输出当前仓库的绝对路径信息，方便脚本复用

### 通过注册表调用技能

```javascript
const registry = require('myaiskills');

// 列出所有已注册技能
registry.list().forEach(s => console.log(`[${s.category}] ${s.name}`));

// 直接按名称调用
const result = await registry.invoke('calculate', { expression: 'sqrt(144)', precision: 0 });
console.log(result.result); // 12

// 转换为 OpenAI tools 格式
const openAITools = registry.toOpenAITools();

// 转换为 Anthropic tools 格式
const anthropicTools = registry.toAnthropicTools();

// 获取全局共享目录
console.log(registry.paths.skillsDir);
```

### 在 OpenAI 中加载技能

```python
import json, glob, os

skills_dir = os.environ["MYAI_SKILLS_DIR"]
skills = [json.load(open(f)) for f in glob.glob(os.path.join(skills_dir, "**", "*.json"), recursive=True)]
tools  = [{"type": "function", "function": {"name": s["name"], "description": s["description"], "parameters": s["parameters"]}} for s in skills]

# 传入 OpenAI API
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "搜索最新的 AI 新闻"}],
    tools=tools
)
```

完整示例请参阅 [examples/openai_function_calling.py](examples/openai_function_calling.py)。

### 在 Anthropic Claude 中加载技能

```python
import json, glob, os

skills_dir = os.environ["MYAI_SKILLS_DIR"]
skills = [json.load(open(f)) for f in glob.glob(os.path.join(skills_dir, "**", "*.json"), recursive=True)]

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    tools=skills,
    messages=[{"role": "user", "content": "帮我读取 data.txt 的内容"}]
)
```

完整示例请参阅 [examples/anthropic_tool_use.py](examples/anthropic_tool_use.py)。

---

## 测试与验证

```bash
# 验证所有技能（检查 JSON/JS 配对、schema 合规性、注册表加载）
npm run validate

# 检查设置和安装
npm run check-setup

# 运行所有检查
npm test
```

---

## 贡献技能

欢迎贡献新的技能！详细指南请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。

快速概览：
1. 在对应类别目录下新建 `<skill_name>.json` 和 `<skill_name>.js`
2. 确保内容通过 `schema/skill.schema.json` 校验
3. 在 `examples` 字段中提供至少一个输入/输出示例
4. 在 `skills/index.js` 中注册技能
5. 运行 `npm run validate` 确保一切正常
6. 提交 Pull Request，说明技能的用途和适用场景

---

## 许可证

MIT
