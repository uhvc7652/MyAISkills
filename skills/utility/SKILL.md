---
name: utility
description: General utility skills for common tasks
category: utility
version: 1.0.0
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
```

## Use Cases

- **Time Management**: Get current time for logging, scheduling, or time tracking
- **Date Formatting**: Convert dates to different formats for display or storage
- **Math Operations**: Perform calculations for data processing or analysis
- **Unit Conversions**: Convert between different units (currency, length, weight, etc.)
- **Expression Evaluation**: Evaluate complex mathematical expressions
