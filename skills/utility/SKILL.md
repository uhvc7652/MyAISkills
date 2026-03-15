---
name: utility
description: General utility skills for common tasks
---

# Utility Skills

This directory contains general-purpose utility skills for common tasks like calculations and time operations.

## Available Skills

### get_current_time
Get the current date and time in various formats and timezones.

**Usage**: When you need to know the current time, format dates, or work with different timezones.

**Features**:
- Multiple output formats (ISO 8601, Unix timestamp, custom formats)
- Timezone support
- Relative time calculations

### calculate
Perform mathematical calculations and evaluate expressions.

**Usage**: When you need to perform arithmetic operations, evaluate mathematical expressions, or do unit conversions.

**Features**:
- Basic arithmetic operations (+, -, *, /)
- Advanced math functions (sin, cos, sqrt, pow, etc.)
- Expression evaluation
- Unit conversions

### requirements_clarify
Generate structured clarification questions before implementation, emphasizing implementation details, branch trade-offs, and optional feature choices.

**Usage**: When user requirements are not fully specified and you need to align scope, options, constraints, and acceptance criteria.

**Features**:
- Prioritized clarification questions by category
- Branch trade-off prompts (speed vs quality vs extensibility)
- Optional feature planning and default toggle guidance
- Decision checklist for implementation kickoff

## Examples

### Get Current Time
```javascript
// Get current time in ISO format
get_current_time({
  format: "iso",
  timezone: "Asia/Shanghai"
})
```

### Calculate
```javascript
// Evaluate mathematical expression
calculate({
  expression: "2 + 3 * 4",
  precision: 2
})

// Unit conversion
calculate({
  expression: "100",
  from_unit: "USD",
  to_unit: "CNY"
})

// Generate requirement clarification questions
requirements_clarify({
  problem_statement: "Build an order export feature",
  focus_areas: ["implementation_details", "branch_tradeoffs", "optional_features"],
  max_questions: 10,
  question_style: "concise"
})
```

## Use Cases

- **Time Management**: Get current time for logging, scheduling, or time tracking
- **Date Formatting**: Convert dates to different formats for display or storage
- **Math Operations**: Perform calculations for data processing or analysis
- **Unit Conversions**: Convert between different units (currency, length, weight, etc.)
- **Expression Evaluation**: Evaluate complex mathematical expressions
- **Requirement Discovery**: Clarify implementation details and decision branches before coding

