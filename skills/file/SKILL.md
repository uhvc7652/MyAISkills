---
name: file
description: File system operations for reading, writing, and listing files
---

# File Skills

This directory contains skills for file system operations including reading, writing, and listing files.

## Available Skills

### file_read
Read the contents of local files. Supports text files, JSON, CSV, and other formats.

**Usage**: When you need to view or analyze file contents, read configuration files, or process text data.

**Features**:
- Support for various encodings (UTF-8, ASCII, etc.)
- Partial reading (specify start and end lines)
- File size and line count information

### file_write
Write content to local files. Can create new files or overwrite existing ones.

**Usage**: When you need to save data to files, create configuration files, or export results.

**Features**:
- Create new files
- Overwrite existing files
- Append to existing files
- Support for various encodings

### file_list
List files and directories in a given path. Supports filtering and recursive listing.

**Usage**: When you need to explore directory structure, find specific files, or get file metadata.

**Features**:
- Recursive directory traversal
- File filtering by pattern
- File metadata (size, modified time, etc.)

## Examples

### Read File
```javascript
// Read first 10 lines of a file
file_read({
  path: "/home/user/notes.txt",
  start_line: 1,
  end_line: 10
})
```

### Write File
```javascript
// Write content to a file
file_write({
  path: "/home/user/output.txt",
  content: "Hello, World!",
  mode: "overwrite"
})
```

### List Files
```javascript
// List all JavaScript files in a directory
file_list({
  path: "/home/user/project",
  pattern: "*.js",
  recursive: true
})
```

## Use Cases

- **Configuration Management**: Read/write config files
- **Log Analysis**: Read and process log files
- **Data Export**: Save processed data to files
- **Project Navigation**: Explore directory structure and find files
- **Backup Creation**: Read files for backup or migration

