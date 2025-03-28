/**
 * Advanced Features Example
 * 
 * This example demonstrates advanced features of the Outhad Search SDK,
 * including CLI integration and more complex search operations.
 */

// Import the SDK
const { OuthadSearch } = require('outhadsearch-sdk-js');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

// Initialize the client
const client = new OuthadSearch({
  host: 'http://your-outhadsearch-host:7700',
  apiKey: 'your-api-key'
});

// Function to execute CLI commands programmatically
async function executeCliCommand(args) {
  console.log(`\nExecuting CLI command: outhadsearch ${args.join(' ')}`);
  
  return new Promise((resolve, reject) => {
    // In a real implementation, you would use the installed CLI
    // For demonstration, we're showing how you would call it
    const command = spawn('outhadsearch', args);
    
    let stdout = '';
    let stderr = '';
    
    command.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    command.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    command.on('close', (code) => {
      console.log(`CLI command exited with code ${code}`);
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });
  });
}

// Example showing integration between programmatic API and CLI
async function demonstrateAdvancedFeatures() {
  try {
    console.log('--- Advanced Features Demonstration ---');
    
    // Create a test index
    const indexName = `advanced-demo-${Date.now()}`;
    console.log(`\nCreating test index: ${indexName}`);
    await client.indexes.create(indexName, { primaryKey: 'id' });
    
    // Create a temporary JSON file for CLI import
    const tempFilePath = path.join(__dirname, 'temp-data.json');
    const sampleData = [
      { id: 101, title: 'Big Data Analytics', content: 'Methods for analyzing large datasets', tags: ['data', 'analytics'] },
      { id: 102, title: 'Machine Learning Basics', content: 'Introduction to machine learning algorithms', tags: ['ml', 'ai'] },
      { id: 103, title: 'Advanced Search Techniques', content: 'Implementing complex search functionality', tags: ['search', 'algorithms'] }
    ];
    
    await fs.writeFile(tempFilePath, JSON.stringify(sampleData, null, 2));
    console.log(`\nCreated temporary data file: ${tempFilePath}`);
    
    // Demonstrate CLI command to add documents (simulation)
    console.log('\nIn a real implementation, you would run:');
    console.log(`outhadsearch documents add ${indexName} --file ${tempFilePath}`);
    
    // Instead, we'll use the API directly for the demo
    console.log('\nAdding documents via API:');
    await client.documents.add(indexName, sampleData);
    console.log('Documents added successfully');
    
    // Wait for indexing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demonstrate advanced search features
    console.log('\nAdvanced search with multiple options:');
    const advancedSearchResult = await client.search(indexName, 'search', {
      limit: 10,
      offset: 0,
      attributes: ['id', 'title', 'content'],
      filter: { tags: { $contains: 'search' } },
      sort: [{ id: 'desc' }],
      highlightPreTag: '<strong>',
      highlightPostTag: '</strong>',
      cropLength: 10
    });
    
    console.log('Advanced search results:');
    console.log(JSON.stringify(advancedSearchResult, null, 2));
    
    // Demonstrate faceted search (if supported)
    console.log('\nFaceted search demonstration:');
    try {
      const facetedResults = await client.search(indexName, 'data', {
        facets: ['tags']
      });
      console.log('Facets:', facetedResults.facets);
    } catch (e) {
      console.log('Faceted search not supported or error occurred:', e.message);
    }
    
    // Clean up
    console.log('\nCleaning up resources:');
    await fs.unlink(tempFilePath);
    console.log(`Deleted temporary file: ${tempFilePath}`);
    
    await client.indexes.delete(indexName);
    console.log(`Deleted test index: ${indexName}`);
    
    // Show how to use the CLI to get configuration
    console.log('\nIn a real implementation, CLI commands like these would be available:');
    console.log('1. outhadsearch config get');
    console.log('2. outhadsearch indexes list');
    console.log('3. outhadsearch search my-index "query" --limit 5 --highlight');
    
  } catch (error) {
    console.error('Error during advanced features demonstration:', error);
  }
}

// Run the demonstration
demonstrateAdvancedFeatures(); 