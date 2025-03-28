/**
 * Working with Documents Example
 * 
 * This example demonstrates how to add, get, and delete documents in an index.
 */

// Import the SDK
const { OuthadSearch } = require('outhadsearch-sdk-js');

// Initialize the client
const client = new OuthadSearch({
  host: 'OUTHADSEARCH_HOST',
  apiKey: 'OUTHADSEARCH_API_KEY'
});

// Sample documents
const sampleProducts = [
  { id: 1, name: 'Smartphone X', description: 'Latest smartphone with advanced features', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Wireless Headphones', description: 'Premium noise-canceling headphones', price: 199.99, category: 'Audio' },
  { id: 3, name: 'Smart Watch', description: 'Track your fitness and stay connected', price: 299.99, category: 'Wearables' },
  { id: 4, name: 'Laptop Pro', description: 'Powerful laptop for professionals', price: 1499.99, category: 'Computers' },
  { id: 5, name: 'Bluetooth Speaker', description: 'Portable speaker with amazing sound', price: 79.99, category: 'Audio' }
];

// Define an async function to demonstrate document operations
async function demonstrateDocumentOperations() {
  try {
    console.log('--- Document Management Operations ---');
    
    // Create a test index
    const indexName = `products-docs-demo-${Date.now()}`;
    console.log(`\nCreating test index: ${indexName}`);
    await client.indexes.create(indexName, { primaryKey: 'id' });
    
    // Add documents to the index
    console.log('\nAdding documents:');
    const addResult = await client.documents.add(indexName, sampleProducts);
    console.log(`Added ${addResult.addedDocuments} documents`);
    
    // Get all documents from the index
    console.log('\nGetting all documents:');
    const allDocs = await client.documents.get(indexName);
    console.log(`Retrieved ${allDocs.length} documents`);
    console.log('First document:', allDocs[0]);
    
    // Get documents with options (limit and offset)
    console.log('\nGetting documents with pagination:');
    const paginatedDocs = await client.documents.get(indexName, { limit: 2, offset: 1 });
    console.log(`Retrieved ${paginatedDocs.length} documents starting from index 1`);
    console.log('Paginated documents:', paginatedDocs);
    
    // Delete specific documents by ID
    console.log('\nDeleting specific documents by ID:');
    const deleteByIdResult = await client.documents.delete(indexName, { ids: [1, 3] });
    console.log(`Deleted ${deleteByIdResult.deletedDocuments} documents`);
    
    // Get documents again to verify deletion
    console.log('\nGetting documents after deletion:');
    const remainingDocs = await client.documents.get(indexName);
    console.log(`${remainingDocs.length} documents remain`);
    
    // Delete documents by filter
    console.log('\nDeleting documents by filter (category = Audio):');
    const deleteByFilterResult = await client.documents.delete(indexName, { 
      filter: { category: 'Audio' } 
    });
    console.log(`Deleted ${deleteByFilterResult.deletedDocuments} documents by filter`);
    
    // Get final document count
    console.log('\nFinal document count:');
    const finalDocs = await client.documents.get(indexName);
    console.log(`${finalDocs.length} documents remain`);
    
    // Clean up - delete the test index
    console.log('\nCleaning up - deleting test index');
    await client.indexes.delete(indexName);
    
  } catch (error) {
    console.error('Error during document operations:', error);
  }
}

// Run the demonstration
demonstrateDocumentOperations(); 