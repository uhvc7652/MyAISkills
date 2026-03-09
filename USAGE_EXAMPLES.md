# 使用示例 / Usage Examples

本文档展示如何在不同场景下使用 MyAISkills。

This document shows how to use MyAISkills in different scenarios.

---

## 场景 1：在 Node.js 项目中使用 / Scenario 1: Use in Node.js Projects

### 方法 1：通过 npm link（推荐） / Method 1: Via npm link (Recommended)

```bash
# 1. 在 MyAISkills 目录下创建全局链接
cd /path/to/MyAISkills
npm link

# 2. 在你的项目中链接 myaiskills
cd /path/to/your-project
npm link myaiskills

# 3. 在代码中使用
```

```javascript
// your-project/index.js
const registry = require('myaiskills');

// 列出所有技能
console.log('Available skills:');
registry.list().forEach(skill => {
  console.log(`  [${skill.category}] ${skill.name} - ${skill.description}`);
});

// 调用技能
async function main() {
  // 获取当前时间
  const timeResult = await registry.invoke('get_current_time', {
    timezone: 'Asia/Shanghai',
    format: 'readable'
  });
  console.log('Current time:', timeResult.datetime);

  // 数学计算
  const calcResult = await registry.invoke('calculate', {
    expression: 'sqrt(144) + 10',
    precision: 2
  });
  console.log('Calculation result:', calcResult.result);
}

main();
```

### 方法 2：直接引用路径 / Method 2: Direct Path Reference

```javascript
// 假设 MyAISkills 克隆在 ~/MyAISkills
const registry = require('~/MyAISkills');

// 使用方式相同
const skills = registry.list();
```

---

## 场景 2：在 Python 项目中使用 / Scenario 2: Use in Python Projects

### 设置环境变量 / Set Environment Variables

```bash
# 在 MyAISkills 目录下运行
cd /path/to/MyAISkills
npm link
eval "$(myaiskills env)"

# 或者手动设置
export MYAI_SKILLS_DIR="/path/to/MyAISkills/skills"
```

### Python 代码示例 / Python Code Example

```python
# your-project/main.py
import os
import json
import glob

def load_all_skills():
    """加载所有技能定义"""
    skills_dir = os.environ.get('MYAI_SKILLS_DIR')
    if not skills_dir:
        raise ValueError('MYAI_SKILLS_DIR environment variable not set')
    
    skills = []
    pattern = os.path.join(skills_dir, "**", "*.json")
    for filepath in sorted(glob.glob(pattern, recursive=True)):
        with open(filepath, encoding='utf-8') as f:
            skill = json.load(f)
            skills.append(skill)
    
    return skills

def skills_to_openai_format(skills):
    """转换为 OpenAI tools 格式"""
    return [
        {
            "type": "function",
            "function": {
                "name": skill["name"],
                "description": skill["description"],
                "parameters": skill["parameters"]
            }
        }
        for skill in skills
    ]

# 使用示例
if __name__ == '__main__':
    skills = load_all_skills()
    print(f'Loaded {len(skills)} skills')
    
    # 打印所有技能名称
    for skill in skills:
        print(f'  [{skill["category"]}] {skill["name"]}')
    
    # 转换为 OpenAI 格式
    openai_tools = skills_to_openai_format(skills)
    print(f'\nGenerated {len(openai_tools)} OpenAI tools')
```

---

## 场景 3：与 OpenAI API 集成 / Scenario 3: Integrate with OpenAI API

```python
# openai_example.py
import os
import json
import glob
from openai import OpenAI

# 加载技能
skills_dir = os.environ['MYAI_SKILLS_DIR']
skills = []
for filepath in glob.glob(os.path.join(skills_dir, "**", "*.json"), recursive=True):
    with open(filepath, encoding='utf-8') as f:
        skills.append(json.load(f))

# 转换为 OpenAI tools 格式
tools = [
    {
        "type": "function",
        "function": {
            "name": s["name"],
            "description": s["description"],
            "parameters": s["parameters"]
        }
    }
    for s in skills
]

# 使用 OpenAI API
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "现在是几点？帮我计算 sqrt(2) 的值"}
    ],
    tools=tools,
    tool_choice="auto"
)

print(response.choices[0].message)
```

---

## 场景 4：与 Anthropic Claude 集成 / Scenario 4: Integrate with Anthropic Claude

```python
# anthropic_example.py
import os
import json
import glob
import anthropic

# 加载技能
skills_dir = os.environ['MYAI_SKILLS_DIR']
skills = []
for filepath in glob.glob(os.path.join(skills_dir, "**", "*.json"), recursive=True):
    with open(filepath, encoding='utf-8') as f:
        skills.append(json.load(f))

# Anthropic 直接使用技能的 JSON 格式
tools = [
    {
        "name": s["name"],
        "description": s["description"],
        "input_schema": s["parameters"]
    }
    for s in skills
]

# 使用 Anthropic API
client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    tools=tools,
    messages=[
        {"role": "user", "content": "帮我读取 data.txt 文件的内容"}
    ]
)

print(response.content)
```

---

## 场景 5：在 Docker 容器中使用 / Scenario 5: Use in Docker Containers

### Dockerfile 示例 / Dockerfile Example

```dockerfile
FROM node:16

WORKDIR /app

# 克隆 MyAISkills（或者通过 volume 挂载）
RUN git clone https://github.com/uhvc7652/MyAISkills.git /opt/myaiskills

# 设置环境变量
ENV MYAI_SKILLS_ROOT=/opt/myaiskills
ENV MYAI_SKILLS_DIR=/opt/myaiskills/skills
ENV MYAI_SKILL_SCHEMA=/opt/myaiskills/schema/skill.schema.json

# 复制你的应用代码
COPY . .

# 安装依赖
RUN npm install

CMD ["node", "index.js"]
```

### 在应用中使用 / Use in Application

```javascript
// 直接通过环境变量引用
const skillsDir = process.env.MYAI_SKILLS_DIR;
const fs = require('fs');
const path = require('path');

// 或者直接 require
const registry = require(process.env.MYAI_SKILLS_ROOT);
console.log(registry.list());
```

---

## 场景 6：在 GitHub Actions 中使用 / Scenario 6: Use in GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test with MyAISkills

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout your code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      
      - name: Clone MyAISkills
        run: |
          git clone https://github.com/uhvc7652/MyAISkills.git /tmp/myaiskills
          cd /tmp/myaiskills
          npm link
      
      - name: Link MyAISkills
        run: npm link myaiskills
      
      - name: Set environment variables
        run: |
          echo "MYAI_SKILLS_DIR=/tmp/myaiskills/skills" >> $GITHUB_ENV
      
      - name: Run tests
        run: npm test
```

---

## 验证安装 / Verify Installation

运行以下命令验证一切正常：
Run these commands to verify everything works:

```bash
# 检查安装
npm run check-setup

# 验证技能
npm run validate

# 测试 CLI
myaiskills paths

# 测试注册表
node -e "const r = require('myaiskills'); console.log('Skills:', r.list().length)"
```

---

## 常见问题 / Common Issues

### 问题 1：找不到 myaiskills 模块 / Issue 1: Cannot find module 'myaiskills'

```bash
# 解决方案：确保已经运行 npm link
cd /path/to/MyAISkills
npm link

cd /path/to/your-project
npm link myaiskills
```

### 问题 2：环境变量未设置 / Issue 2: Environment variables not set

```bash
# 解决方案：运行 myaiskills env 并添加到 shell 配置
eval "$(myaiskills env)"

# 或永久添加到 ~/.bashrc 或 ~/.zshrc
echo 'eval "$(myaiskills env)"' >> ~/.bashrc
```

### 问题 3：Docker 中找不到技能 / Issue 3: Skills not found in Docker

```dockerfile
# 确保 MyAISkills 在构建时可用
# 方法 1：在构建时克隆
RUN git clone https://github.com/uhvc7652/MyAISkills.git /opt/myaiskills

# 方法 2：通过 volume 挂载
# docker run -v /path/to/MyAISkills:/opt/myaiskills ...
```

---

## 下一步 / Next Steps

- 查看 [examples/](../examples/) 目录获取更多示例
- 阅读 [CONTRIBUTING.md](../CONTRIBUTING.md) 了解如何添加新技能
- 查看 [README.md](../README.md) 了解完整文档
