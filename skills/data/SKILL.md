---
name: data
description: Data processing and transformation skills
category: data
version: 1.0.0
---

# Data Skills

This directory contains skills for parsing, transforming, and processing various data formats.

## Available Skills

### data_parse_json
Parse JSON strings into JavaScript objects and validate JSON structure.

**Usage**: When you need to parse JSON data, validate JSON format, or extract specific fields from JSON strings.

### data_transform
Transform data from one format to another (e.g., CSV to JSON, XML to JSON).

**Supported Formats**: JSON, CSV, XML, YAML

**Usage**: When you need to convert data between different formats or restructure data.

## Examples

### Parse JSON
```javascript
// Parse and validate JSON string
data_parse_json({
  json_string: '{"name": "John", "age": 30}'
})
```

### Transform Data
```javascript
// Convert CSV to JSON
data_transform({
  input_data: "name,age\nJohn,30\nJane,25",
  input_format: "csv",
  output_format: "json"
})
```

## Use Cases

- **Data Validation**: Validate JSON, CSV, or XML data structure
- **Format Conversion**: Convert between JSON, CSV, XML, and YAML
- **Data Extraction**: Extract specific fields from structured data
- **Data Restructuring**: Transform data structure to match required format
