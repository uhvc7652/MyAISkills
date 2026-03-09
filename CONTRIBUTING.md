# Contributing to MyAISkills

感谢您考虑为 MyAISkills 贡献新的技能！本指南将帮助您了解如何添加新技能。

Thank you for considering contributing to MyAISkills! This guide will help you understand how to add new skills.

---

## 快速开始 / Quick Start

### 1. 设置开发环境 / Set Up Development Environment

```bash
# Clone the repository
git clone https://github.com/uhvc7652/MyAISkills.git
cd MyAISkills

# Link locally for testing
npm link

# Verify setup
npm run check-setup
```

### 2. 添加新技能 / Add a New Skill

每个技能需要两个文件：
Each skill requires two files:

- `<skill_name>.json` - 技能定义 / Skill definition (for AI to read)
- `<skill_name>.js` - 技能实现 / Skill implementation (executable code)

---

## 技能创建步骤 / Skill Creation Steps

### Step 1: 选择合适的类别 / Choose the Right Category

技能应放在适当的类别目录下：
Skills should be placed in the appropriate category directory:

- `skills/code/` - 代码分析、生成、重构等 / Code analysis, generation, refactoring
- `skills/file/` - 文件读写、目录操作 / File read/write, directory operations
- `skills/web/` - 网络搜索、页面抓取 / Web search, page scraping
- `skills/data/` - 数据解析、转换 / Data parsing, transformation
- `skills/utility/` - 通用工具 / General utilities

如果现有类别不适合，请在 Pull Request 中说明为什么需要新类别。
If existing categories don't fit, explain in your Pull Request why a new category is needed.

### Step 2: 创建 JSON 定义文件 / Create JSON Definition File

在适当的类别目录下创建 `<skill_name>.json`：
Create `<skill_name>.json` in the appropriate category directory:

```json
{
  "name": "skill_name",
  "description": "清晰描述技能的功能，让 AI 能够理解何时应该调用这个技能。A clear description of what the skill does, so AI knows when to call it.",
  "category": "code|file|web|data|utility",
  "version": "1.0.0",
  "parameters": {
    "type": "object",
    "properties": {
      "required_param": {
        "type": "string",
        "description": "参数说明 / Parameter description"
      },
      "optional_param": {
        "type": "number",
        "description": "可选参数 / Optional parameter",
        "default": 10
      }
    },
    "required": ["required_param"]
  },
  "returns": {
    "type": "object",
    "description": "返回值说明 / Return value description",
    "properties": {
      "result": {
        "type": "string",
        "description": "结果 / Result"
      },
      "success": {
        "type": "boolean",
        "description": "是否成功 / Whether successful"
      }
    }
  },
  "examples": [
    {
      "input": {
        "required_param": "example value"
      },
      "output": {
        "result": "example output",
        "success": true
      }
    }
  ]
}
```

**重要规则 / Important Rules:**

1. `name` 必须与文件名匹配（不含 `.json` 扩展名）
   `name` must match the filename (without `.json` extension)

2. `description` 应该清楚地说明何时使用这个技能
   `description` should clearly explain when to use this skill

3. 至少提供一个完整的示例
   Provide at least one complete example

4. 使用 JSON Schema Draft-7 格式定义参数
   Use JSON Schema Draft-7 format for parameters

### Step 3: 创建 JS 实现文件 / Create JS Implementation File

在同一目录下创建 `<skill_name>.js`：
Create `<skill_name>.js` in the same directory:

```javascript
/**
 * @fileoverview 技能的简短描述 / Brief description of the skill
 */

'use strict';

/** @typedef {import('../types.js').SkillDefinition} SkillDefinition */

/**
 * 技能函数的详细描述 / Detailed description of the skill function
 *
 * @async
 * @param {Object} params - 输入参数 / Input parameters
 * @param {string} params.required_param - 必需参数说明 / Required parameter description
 * @param {number} [params.optional_param=10] - 可选参数说明 / Optional parameter description
 * @returns {Promise<Object>} 返回值说明 / Return value description
 * @returns {string} returns.result - 结果 / Result
 * @returns {boolean} returns.success - 是否成功 / Whether successful
 * @throws {Error} 错误说明 / Error description
 *
 * @example
 * const result = await skillName({ required_param: 'value' });
 * console.log(result.result);
 */
async function skillName(params) {
  const startTime = Date.now();
  
  try {
    // 1. 参数验证 / Parameter validation
    if (!params.required_param) {
      throw new Error('required_param is required / 缺少必需参数 required_param');
    }
    
    // 2. 执行技能逻辑 / Execute skill logic
    const result = 'your implementation here';
    
    // 3. 返回结果 / Return result
    return {
      result,
      success: true,
      duration_ms: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      duration_ms: Date.now() - startTime,
    };
  }
}

// 使用驼峰命名法导出（skill_name -> skillName）
// Export using camelCase (skill_name -> skillName)
exports.skillName = skillName;
```

**实现指南 / Implementation Guidelines:**

1. **始终使用 async/await** - 即使不是异步操作
   **Always use async/await** - Even if not asynchronous

2. **参数验证** - 验证所有必需参数
   **Parameter validation** - Validate all required parameters

3. **错误处理** - 使用 try-catch 捕获所有错误
   **Error handling** - Use try-catch to catch all errors

4. **性能跟踪** - 包含 `duration_ms` 在返回值中
   **Performance tracking** - Include `duration_ms` in return value

5. **一致的返回格式** - 总是返回包含 `success` 的对象
   **Consistent return format** - Always return an object with `success`

6. **JSDoc 注释** - 提供完整的类型和说明
   **JSDoc comments** - Provide complete types and descriptions

7. **命名约定** - JSON 中使用 snake_case，JS 中使用 camelCase
   **Naming convention** - Use snake_case in JSON, camelCase in JS

### Step 4: 注册技能 / Register the Skill

在 `skills/index.js` 中注册新技能：
Register the new skill in `skills/index.js`:

```javascript
// 1. 导入实现 / Import implementation
const { skillName } = require('./category/skill_name');

// 2. 导入定义 / Import definition
const skillNameDef = require('./category/skill_name.json');

// 3. 添加到注册表 / Add to registry
const _registry = new Map([
  // ... existing skills ...
  ['skill_name', { definition: skillNameDef, handler: skillName }],
]);
```

### Step 5: 验证技能 / Validate the Skill

```bash
# 验证技能定义和实现 / Validate skill definition and implementation
npm run validate

# 检查设置 / Check setup
npm run check-setup

# 测试技能调用 / Test skill invocation
node -e "const registry = require('.'); registry.invoke('skill_name', { required_param: 'test' }).then(console.log);"
```

### Step 6: 添加文档（可选）/ Add Documentation (Optional)

如果您想让技能在 GitHub Copilot 中可用，创建 Markdown 文件：
If you want the skill to be available in GitHub Copilot, create a Markdown file:

`.github/copilot/skills/<skill_name>.md`:

```markdown
# skill_name

技能描述 / Skill description

## 参数 / Parameters

- `required_param` (string, required): 参数说明 / Parameter description
- `optional_param` (number, optional): 可选参数说明 / Optional parameter description

## 示例 / Examples

\`\`\`javascript
// 示例用法 / Example usage
const result = await skillName({ required_param: 'value' });
\`\`\`

## 返回值 / Returns

返回对象包含 / Returns object containing:
- `result`: 结果 / Result
- `success`: 是否成功 / Whether successful
```

---

## 技能质量检查清单 / Skill Quality Checklist

提交 Pull Request 前，请确认：
Before submitting a Pull Request, ensure:

- [ ] JSON 文件遵循 `schema/skill.schema.json`
      JSON file follows `schema/skill.schema.json`
- [ ] JS 文件包含完整的 JSDoc 注释
      JS file contains complete JSDoc comments
- [ ] 技能名称在 JSON 和 JS 中一致（snake_case vs camelCase）
      Skill name is consistent in JSON and JS (snake_case vs camelCase)
- [ ] 提供至少一个有意义的示例
      At least one meaningful example is provided
- [ ] 包含适当的错误处理
      Includes appropriate error handling
- [ ] 参数验证完整
      Parameter validation is complete
- [ ] 返回值格式一致（包含 success, duration_ms）
      Return value format is consistent (includes success, duration_ms)
- [ ] `npm run validate` 通过
      `npm run validate` passes
- [ ] 技能在 `skills/index.js` 中注册
      Skill is registered in `skills/index.js`
- [ ] 描述清楚，AI 能理解何时使用
      Description is clear, AI can understand when to use it

---

## 安全指南 / Security Guidelines

**重要 / Important:** 技能可能会被 AI 自动调用，因此安全性至关重要。
**Important:** Skills may be automatically called by AI, so security is crucial.

### 必须做 / Must Do:

1. **验证所有输入** - 不信任任何用户输入
   **Validate all inputs** - Don't trust any user input

2. **限制文件访问** - 使用路径验证，防止目录遍历攻击
   **Limit file access** - Use path validation, prevent directory traversal attacks

3. **避免代码注入** - 不要使用 `eval()` 或动态代码执行
   **Avoid code injection** - Don't use `eval()` or dynamic code execution

4. **限制资源使用** - 设置超时和大小限制
   **Limit resource usage** - Set timeouts and size limits

5. **清理敏感数据** - 不要在日志中记录密码或密钥
   **Sanitize sensitive data** - Don't log passwords or keys

### 示例：安全的文件读取 / Example: Safe File Read

```javascript
const path = require('path');
const fs = require('fs').promises;

async function safeFileRead(params) {
  // 1. 验证并规范化路径 / Validate and normalize path
  const filePath = path.resolve(path.normalize(params.path));
  
  // 2. 防止目录遍历 / Prevent directory traversal
  // 确保规范化后的路径在允许的目录内
  const allowedDir = path.resolve('/allowed/directory');
  if (!filePath.startsWith(allowedDir)) {
    throw new Error(`Access denied: File must be within ${allowedDir}`);
  }
  
  // 3. 检查文件存在 / Check file exists
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`File not found: ${params.path}`);
  }
  
  // 4. 限制文件大小 / Limit file size
  const stats = await fs.stat(filePath);
  if (stats.size > 10 * 1024 * 1024) { // 10MB
    throw new Error(`File too large: ${stats.size} bytes (max 10MB)`);
  }
  
  // 5. 读取文件 / Read file
  return await fs.readFile(filePath, 'utf8');
}
```

---

## Pull Request 流程 / Pull Request Process

1. **Fork 仓库** / Fork the repository
2. **创建特性分支** / Create a feature branch
   ```bash
   git checkout -b add-skill-name
   ```
3. **添加您的技能** / Add your skill
4. **运行验证** / Run validation
   ```bash
   npm run validate
   ```
5. **提交更改** / Commit changes
   ```bash
   git add .
   git commit -m "Add skill_name skill for [purpose]"
   ```
6. **推送到 Fork** / Push to fork
   ```bash
   git push origin add-skill-name
   ```
7. **创建 Pull Request** / Create Pull Request

### PR 描述应包含 / PR Description Should Include:

- 技能的目的和用例 / Purpose and use cases of the skill
- 为什么这个技能有用 / Why this skill is useful
- 使用示例 / Usage examples
- 任何依赖或限制 / Any dependencies or limitations

---

## 代码审查标准 / Code Review Standards

您的 Pull Request 将根据以下标准进行审查：
Your Pull Request will be reviewed based on:

1. **代码质量** / Code quality
   - 遵循现有的代码风格
   - Follows existing code style
   
2. **功能性** / Functionality
   - 技能按预期工作
   - Skill works as expected
   
3. **文档** / Documentation
   - JSDoc 注释完整
   - JSDoc comments are complete
   
4. **测试** / Testing
   - 通过验证脚本
   - Passes validation scripts
   
5. **安全性** / Security
   - 没有明显的安全问题
   - No obvious security issues

---

## 获取帮助 / Getting Help

如果您在贡献过程中遇到问题：
If you encounter issues during contribution:

1. 检查现有技能作为参考
   Check existing skills as reference
   
2. 查看 [README.md](README.md) 和 [README_EN.md](README_EN.md)
   Review [README.md](README.md) and [README_EN.md](README_EN.md)
   
3. 在 GitHub Issues 中提问
   Ask questions in GitHub Issues

---

## 许可证 / License

通过贡献代码，您同意您的贡献将在与项目相同的 MIT 许可证下发布。
By contributing, you agree that your contributions will be licensed under the same MIT License as the project.
