# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StewLang is a domain-specific language for creating and parsing recipe instructions. The project consists of two main workspaces:
- `lang/` - Core language parser, scanner, and resolver
- `cli/` - Interactive CLI built with React/Ink and XState

## Development Commands

### Running the CLI
```bash
deno task run    # Run the interactive CLI application
```

### Code Quality
```bash
deno fmt         # Format all code
deno lint        # Lint all code
```

### Working with the Language Module
```bash
cd lang
deno run cli/main.ts <file.sw>   # Parse .sw recipe files
```

## Architecture

### Language Module (`lang/`)
The language processing pipeline follows this flow:
1. **Scanner** (`scanner/scanner.ts`) - Tokenizes input text
2. **Parser** (`parser/parser.ts`) - Creates AST from tokens
3. **Resolver** (`resolver/resolver.ts`) - Resolves identifiers and validates
4. **StewLang** (`mod.ts`) - Main API entry point

Key classes:
- `Recipe` - Root node of the AST
- `Ingredient` - Represents ingredients with amounts and details
- `Step` - Represents cooking steps
- `Environment` - Manages variable scoping

### CLI Module (`cli/`)
Interactive terminal application using:
- React/Ink for rendering
- XState for state management
- File browser and preview functionality

Entry point: `cli/main.ts`

## File Extensions
- `.sw` - StewLang recipe files (see `lang/cli/main.ts:5`)

## Language Syntax
StewLang uses a parenthetical syntax for recipes. See `lang/parser/README.md` for grammar details.

Example format:
```
ingredient-name ( 
  - step description
  nested-ingredient (details)
)
```