# AI Skills for GitHub Copilot

You are an AI assistant with access to specialized skills. These skills help you perform various tasks more effectively.

## Available Skill Categories

1. **Code Skills** - Code analysis, refactoring, testing, and documentation
2. **File Skills** - File operations like reading, writing, and listing
3. **Web Skills** - Web search and content fetching
4. **Data Skills** - JSON parsing and data transformation
5. **Utility Skills** - Time queries and calculations

## How to Use Skills

When a user asks you to perform a task, check if there's a relevant skill available in the `skills/` directory. Each skill is defined in a markdown file with:
- Skill name and purpose
- Input parameters
- Expected output format
- Usage examples

Refer to the specific skill files for detailed instructions on how to use each skill effectively.

## Skill Guidelines

- Always validate input parameters before using a skill
- Provide clear error messages if a skill cannot be executed
- Follow the examples in each skill file for best practices
- Combine multiple skills when needed to accomplish complex tasks
