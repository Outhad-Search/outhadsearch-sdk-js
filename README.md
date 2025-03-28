# Outhad Search SDK Showcase

This repository demonstrates how to use the [outhadsearch-sdk-js](https://www.npmjs.com/package/outhadsearch-sdk-js) package, a TypeScript SDK for interacting with Outhad Search services.

## Overview

Outhad Search provides a powerful search engine solution, and this SDK offers a convenient way to interact with its services through JavaScript/TypeScript. This showcase repository demonstrates key features and use cases.

## Installation

```bash
npm install outhadsearch-sdk-js
```

## Features

The SDK provides both a programmatic API and a CLI tool:

### CLI Capabilities
- **Configuration**: Set up connection to your Outhad Search instance
- **Index Management**: Create, list, view, and delete indexes
- **Document Management**: Add, retrieve, and delete documents
- **Search**: Perform searches with advanced options like filtering, highlighting, and sorting

### JavaScript/TypeScript API
- Full access to Outhad Search functionality
- Type-safe interactions
- Promise-based API

## Usage Examples

This repository contains examples demonstrating:

1. [Basic Configuration](./examples/basic-configuration.js)
2. [Managing Indexes](./examples/managing-indexes.js)
3. [Working with Documents](./examples/working-with-documents.js)
4. [Performing Searches](./examples/performing-searches.js)
5. [Using Advanced Features](./examples/advanced-features.js)

## CLI Examples

```bash
# Configure the CLI
outhadsearch config set --host http://your-outhadsearch-host:7700 --api-key your-api-key

# List available indexes
outhadsearch indexes list

# Create a new index
outhadsearch indexes create my-index --primary-key id

# Add documents from a JSON file
outhadsearch documents add my-index --file data.json

# Search documents
outhadsearch search my-index "search query" --highlight
```

## Resources

- [Official Documentation](https://github.com/outhadsearch/outhadsearch-sdk-js#readme)
- [NPM Package](https://www.npmjs.com/package/outhadsearch-sdk-js)

## License

This showcase repository is MIT licensed. 