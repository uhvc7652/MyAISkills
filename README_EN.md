# MyAISkills — AI Skills Repository

English | [中文](README.md)

A structured, AI-agent-ready skills (tools) repository. All skill definitions and implementations are centralized in the `skills/` directory, supporting:

- **OpenAI Function Calling** - Through JSON-formatted skill definitions
- **Anthropic Tool Use** - Direct use of JSON schema
- **Node.js Project Integration** - Via npm link and registry API
- **Python and Other Languages** - Access skills directory through environment variables

📖 **See [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) for detailed usage examples**

---

## Directory Structure

```
MyAISkills/
├── .github/
│   └── copilot/             # GitHub Copilot skill definitions (Markdown format)
│       ├── instructions.md  # Copilot main entry file
│       └── skills/          # Markdown format skill files
│           ├── code_analyze.md
│           ├── file_read.md
│           ├── web_search.md
│           └── ...          # Other skills
├── schema/                  # JSON Schema for skill definitions
│   └── skill.schema.json
├── skills/                  # Skill definitions and implementations (JSON format, organized by category)
│   ├── types.js             # Global JSDoc type definitions
│   ├── index.js             # Skills registry (unified entry point)
│   ├── web/                 # Web-related skills
│   │   ├── web_search.json  # Skill definition (for AI to read)
│   │   ├── web_search.js    # Skill implementation (with JSDoc comments)
│   │   ├── web_fetch.json
│   │   └── web_fetch.js
│   ├── code/                # Code-related skills
│   ├── file/                # File operation skills
│   ├── data/                # Data processing skills
│   └── utility/             # General utility skills
├── scripts/                 # Setup and validation scripts
│   ├── validate-skills.js   # Validate skill definitions
│   └── check-setup.js       # Verify installation
└── examples/                # Usage examples
    ├── openai_function_calling.py
    └── anthropic_tool_use.py
```

> **Two Format Explanation**:
> - **Markdown Format** (`.github/copilot/`): For GitHub Copilot in VS Code, callable via `/` commands
> - **JSON Format** (`skills/`): Each skill consists of two files — `.json` describes the interface, `.js` provides the implementation

---

## Skill Format

Each skill file is a JSON object following the schema defined in `schema/skill.schema.json`:

```json
{
  "name": "skill_name",
  "description": "Skill functionality description (for AI to understand when to call)",
  "category": "web | code | file | data | utility",
  "version": "1.0.0",
  "parameters": {
    "type": "object",
    "properties": {
      "param_name": {
        "type": "string",
        "description": "Parameter description"
      }
    },
    "required": ["param_name"]
  },
  "returns": {
    "type": "object",
    "description": "Return value structure description"
  },
  "examples": [
    {
      "input": { "param_name": "example value" },
      "output": { "result": "example return" }
    }
  ]
}
```

---

## Quick Start

### Installation and Verification

```bash
# 1. Clone the repository
git clone https://github.com/uhvc7652/MyAISkills.git
cd MyAISkills

# 2. Link globally (optional, for access from other projects)
npm link

# 3. Verify installation
npm run check-setup

# 4. Validate all skill definitions
npm run validate
```

### Available Skills

All skills are located in the `skills/` directory, organized by category:

**Code Category** - `skills/code/`
- `code_analyze` - Static code analysis
- `code_refactor_suggest` - Refactoring suggestions
- `code_add_comments` - Add comments
- `code_add_jsdoc` - Generate JSDoc documentation
- `code_generate_tests` - Generate test cases
- `code_execute` - Execute code

**File Category** - `skills/file/`
- `file_read` - Read files
- `file_write` - Write files
- `file_list` - List directories

**Web Category** - `skills/web/`
- `web_search` - Web search
- `web_fetch` - Fetch web content

**Data Category** - `skills/data/`
- `data_parse_json` - JSON parsing
- `data_transform` - Data transformation

**Utility Category** - `skills/utility/`
- `get_current_time` - Get current time
- `calculate` - Mathematical calculations

---

### Use as Machine-Wide Shared Skills (Node.js / Python)

This repository can be cloned locally and used as a set of shared skills for all projects on your machine.

```bash
# Clone and link
git clone https://github.com/uhvc7652/MyAISkills.git
cd MyAISkills
npm link

# Recommended: Add to ~/.zshrc, ~/.bashrc or similar shell config
eval "$(myaiskills env)"
# This exports:
# - MYAI_SKILLS_ROOT
# - MYAI_SKILLS_DIR
# - MYAI_SKILL_SCHEMA
```

- Node.js projects can directly `require('myaiskills')`
- Python / other language projects can directly read the `MYAI_SKILLS_DIR` directory
- `myaiskills paths` outputs the absolute path information for the current repository, convenient for script reuse

### Verify Installation

```bash
# Check if everything is set up correctly
npm run check-setup

# Validate all skill definitions
npm run validate
```

### Call Skills Through Registry

```javascript
const registry = require('myaiskills');

// List all registered skills
registry.list().forEach(s => console.log(`[${s.category}] ${s.name}`));

// Call directly by name
const result = await registry.invoke('calculate', { expression: 'sqrt(144)', precision: 0 });
console.log(result.result); // 12

// Convert to OpenAI tools format
const openAITools = registry.toOpenAITools();

// Convert to Anthropic tools format
const anthropicTools = registry.toAnthropicTools();

// Get global shared directory
console.log(registry.paths.skillsDir);
```

### Load Skills in OpenAI

```python
import json, glob, os

skills_dir = os.environ["MYAI_SKILLS_DIR"]
skills = [json.load(open(f)) for f in glob.glob(os.path.join(skills_dir, "**", "*.json"), recursive=True)]
tools  = [{"type": "function", "function": {"name": s["name"], "description": s["description"], "parameters": s["parameters"]}} for s in skills]

# Pass to OpenAI API
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Search for the latest AI news"}],
    tools=tools
)
```

See [examples/openai_function_calling.py](examples/openai_function_calling.py) for a complete example.

### Load Skills in Anthropic Claude

```python
import json, glob, os

skills_dir = os.environ["MYAI_SKILLS_DIR"]
skills = [json.load(open(f)) for f in glob.glob(os.path.join(skills_dir, "**", "*.json"), recursive=True)]

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    tools=skills,
    messages=[{"role": "user", "content": "Help me read the contents of data.txt"}]
)
```

See [examples/anthropic_tool_use.py](examples/anthropic_tool_use.py) for a complete example.

---

## Contributing Skills

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on how to add new skills.

Quick overview:
1. Create `<skill_name>.json` in the appropriate category directory
2. Create `<skill_name>.js` with the implementation
3. Ensure content passes `schema/skill.schema.json` validation
4. Provide at least one input/output example in the `examples` field
5. Submit a Pull Request explaining the skill's purpose and use cases

---

## Testing & Validation

```bash
# Validate all skills (checks JSON/JS pairs, schema compliance, registry loading)
npm run validate

# Check setup and installation
npm run check-setup

# Run both
npm test
```

---

## License

MIT
