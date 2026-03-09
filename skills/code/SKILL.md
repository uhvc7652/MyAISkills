---
name: code
description: Code-related skills for analyzing, executing, and improving code
category: code
version: 1.0.0
---

# Code Skills

This directory contains skills for code analysis, execution, documentation, and improvement.

## Available Skills

### code_analyze
Perform static analysis on code to identify potential issues, code style problems, security vulnerabilities, and provide improvement suggestions.

**Supported Languages**: Python, JavaScript, TypeScript, Java, Go, Rust

**Usage**: When you need to analyze code quality, find security issues, or get code improvement suggestions.

### code_execute
Execute code snippets in various programming languages and return the results.

**Supported Languages**: Python, JavaScript, Shell scripts

**Usage**: When you need to run code and see the output, test small snippets, or validate code behavior.

### code_add_comments
Add explanatory comments to code to improve readability and maintainability.

**Usage**: When code lacks documentation or needs better inline explanations.

### code_add_jsdoc
Add JSDoc-style documentation comments to JavaScript/TypeScript code.

**Usage**: When you need to document JavaScript/TypeScript functions, classes, and modules with proper JSDoc annotations.

### code_generate_tests
Generate unit tests for given code based on the programming language and testing framework.

**Usage**: When you need to create test cases for functions, classes, or modules.

### code_refactor_suggest
Analyze code and provide refactoring suggestions to improve code quality, readability, and maintainability.

**Usage**: When code needs optimization, simplification, or restructuring.

## Examples

### Analyze Code
```javascript
// Check Python code for security issues
code_analyze({
  code: "password = '123456'\nprint(password)",
  language: "python",
  checks: ["security"]
})
```

### Execute Code
```javascript
// Run a Python script
code_execute({
  language: "python",
  code: "print('Hello, World!')"
})
```

### Generate Tests
```javascript
// Generate tests for a JavaScript function
code_generate_tests({
  code: "function add(a, b) { return a + b; }",
  language: "javascript",
  framework: "jest"
})
```
