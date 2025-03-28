/**
 * Managing Indexes Example
 * 
 * This example demonstrates how to create, list, get information about, and delete indexes.
 */

// Import the SDK
const { OuthadSearch } = require('outhadsearch-sdk-js');

// Initialize the client
const client = new OuthadSearch({
  host: 'OUTHADSEARCH_HOST',
  apiKey: 'OUTHADSEARCH_API_KEY'
});

// Define an async function to demonstrate index operations
async function demonstrateIndexOperations() {
  try {
    console.log('--- Index Management Operations ---');

    // List all indexes
    console.log('\nListing all indexes:');
    const indexResults = await client.getIndexes();
    // The response contains the results as a property, not directly as an array
    console.log('Available Indexes:');
    if (indexResults && indexResults.results) {
      console.log(`Found ${indexResults.results.length} indexes`);
      indexResults.results.forEach(index => {
        console.log(`- ${index.uid} (Primary Key: ${index.primaryKey || 'Not set'})`);
      });
    } else {
      console.log('No indexes found or unexpected response format');
      console.log('Raw response:', indexResults);
    }
    
    // Create a new index
    console.log('\nCreating a new index:');
    const indexName = `products-${Date.now()}`;
    const newIndex = await client.createIndex(indexName, { primaryKey: 'id' });
    console.log(`Created index: ${indexName}`);
    
    // Get information about an index
    console.log('\nGetting index information:');
    const indexInfo = await client.getIndex(indexName);
    console.log('Index info:', indexInfo);
    
    // List updated indexes to confirm creation
    console.log('\nListing updated indexes:');
    const updatedIndexResults = await client.getIndexes();
    console.log('Updated Index List:');
    if (updatedIndexResults && updatedIndexResults.results) {
      console.log(`Now found ${updatedIndexResults.results.length} indexes`);
      updatedIndexResults.results.forEach(index => {
        console.log(`- ${index.uid} (Primary Key: ${index.primaryKey || 'Not set'})`);
      });
    } else {
      console.log('Unexpected response format');
      console.log('Raw response:', updatedIndexResults);
    }
    
    // Delete the index
    console.log('\nDeleting the index:');
    await client.deleteIndex(indexName);
    console.log(`Deleted index: ${indexName}`);
    
    // List indexes again to confirm deletion
    console.log('\nFinal index list:');
    const finalIndexResults = await client.getIndexes();
    console.log('Final Index List:');
    if (finalIndexResults && finalIndexResults.results) {
      console.log(`Found ${finalIndexResults.results.length} indexes after deletion`);
      finalIndexResults.results.forEach(index => {
        console.log(`- ${index.uid} (Primary Key: ${index.primaryKey || 'Not set'})`);
      });
    } else {
      console.log('Unexpected response format');
      console.log('Raw response:', finalIndexResults);
    }
    
  } catch (error) {
    console.error('Error during index operations:', error);
  }
}

// Run the demonstration
demonstrateIndexOperations(); 