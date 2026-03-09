# MyAISkills — AI 技能仓库

一个结构化的、可供 AI 代理直接使用的技能（工具）定义仓库。每个技能都遵循统一的 JSON Schema，可无缝对接 OpenAI Function Calling、Anthropic Tool Use 等主流 AI 框架。

---

## 目录结构

```
MyAISkills/
├── schema/                  # 技能定义的 JSON Schema
│   └── skill.schema.json
├── skills/                  # 技能定义文件（按类别组织）
│   ├── web/                 # 网络相关技能
│   │   ├── web_search.json
│   │   └── web_fetch.json
│   ├── code/                # 代码相关技能
│   │   ├── code_execute.json
│   │   └── code_analyze.json
│   ├── file/                # 文件操作技能
│   │   ├── file_read.json
│   │   ├── file_write.json
│   │   └── file_list.json
│   ├── data/                # 数据处理技能
│   │   ├── data_parse_json.json
│   │   └── data_transform.json
│   └── utility/             # 通用工具技能
│       ├── get_current_time.json
│       └── calculate.json
└── examples/                # 使用示例
    ├── openai_function_calling.py
    └── anthropic_tool_use.py
```

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

### 在 OpenAI 中加载技能

```python
import json, glob

skills = [json.load(open(f)) for f in glob.glob("skills/**/*.json", recursive=True)]
tools  = [{"type": "function", "function": s} for s in skills]

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
import json, glob

skills = [json.load(open(f)) for f in glob.glob("skills/**/*.json", recursive=True)]

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    tools=skills,
    messages=[{"role": "user", "content": "帮我读取 data.txt 的内容"}]
)
```

完整示例请参阅 [examples/anthropic_tool_use.py](examples/anthropic_tool_use.py)。

---

## 贡献技能

1. 在对应类别目录下新建 `<skill_name>.json`
2. 确保内容通过 `schema/skill.schema.json` 校验
3. 在 `examples` 字段中提供至少一个输入/输出示例
4. 提交 Pull Request，说明技能的用途和适用场景

---

## 许可证

MIT
