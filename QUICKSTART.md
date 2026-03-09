# 快速开始 / Quick Start Guide

## 3 分钟快速开始 / 3-Minute Quick Start

### 步骤 1：克隆并设置 / Step 1: Clone and Setup

```bash
# 克隆仓库 / Clone repository
git clone https://github.com/uhvc7652/MyAISkills.git
cd MyAISkills

# 验证安装 / Verify installation
npm run check-setup
```

### 步骤 2：全局链接（可选但推荐）/ Step 2: Global Link (Optional but Recommended)

```bash
# 创建全局链接 / Create global link
npm link

# 设置环境变量 / Set environment variables
eval "$(myaiskills env)"

# 添加到 shell 配置（可选）/ Add to shell config (optional)
echo 'eval "$(myaiskills env)"' >> ~/.bashrc  # 或 ~/.zshrc
```

### 步骤 3：在项目中使用 / Step 3: Use in Your Project

#### Node.js 项目 / Node.js Projects

```bash
cd /path/to/your-project
npm link myaiskills
```

```javascript
// index.js
const registry = require('myaiskills');

// 列出所有技能 / List all skills
console.log(registry.list());

// 调用技能 / Invoke a skill
const result = await registry.invoke('calculate', {
  expression: '2 + 2',
  precision: 0
});
console.log(result.result); // 4
```

#### Python 项目 / Python Projects

```python
# main.py
import os
import json
import glob

# 加载所有技能 / Load all skills
skills_dir = os.environ['MYAI_SKILLS_DIR']
skills = []
for filepath in glob.glob(f"{skills_dir}/**/*.json", recursive=True):
    with open(filepath) as f:
        skills.append(json.load(f))

print(f"Loaded {len(skills)} skills")
```

---

## 完成！/ Done!

现在你可以：
Now you can:

✅ 在任何 Node.js 项目中使用 `require('myaiskills')`  
✅ 在任何 Python 项目中通过 `$MYAI_SKILLS_DIR` 加载技能  
✅ 将技能转换为 OpenAI 或 Anthropic 格式  
✅ 调用任何已定义的技能  

---

## 下一步 / Next Steps

- 📖 查看 [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) 了解更多使用场景
- 🔧 查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何添加新技能
- 📚 查看 [README.md](README.md) 了解完整文档

---

## 常用命令 / Common Commands

```bash
# 验证技能定义 / Validate skill definitions
npm run validate

# 检查安装设置 / Check installation setup
npm run check-setup

# 查看路径信息 / View path information
myaiskills paths

# 输出环境变量 / Output environment variables
myaiskills env
```

---

## 需要帮助？/ Need Help?

- 查看 [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) 中的常见问题解答
- 在 GitHub Issues 中提问
- 查看 `examples/` 目录中的完整示例代码
