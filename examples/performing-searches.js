/**
 * Performing Searches Example
 * 
 * This example demonstrates the various search capabilities of the Outhad Search SDK,
 * including basic search, filters, faceting, multi-search, placeholder search, and more.
 */

// Import the SDK
const { OuthadSearch } = require('outhadsearch-sdk-js');

// Initialize the client
const client = new OuthadSearch({
  host: 'OUTHADSEARCH_HOST',
  apiKey: 'OUTHADSEARCH_API_KEY'
});

// Sample documents for search demonstration
const sampleProducts = [
  { id: 1, name: 'Smartphone X', description: 'Latest smartphone with advanced features and 5G connectivity', price: 999.99, category: 'Electronics', inStock: true, tags: ['mobile', 'tech', '5G'] },
  { id: 2, name: 'Wireless Headphones', description: 'Premium noise-canceling headphones with 20 hours battery life', price: 199.99, category: 'Audio', inStock: true, tags: ['wireless', 'audio'] },
  { id: 3, name: 'Smart Watch', description: 'Track your fitness and stay connected with smart notifications', price: 299.99, category: 'Wearables', inStock: false, tags: ['wearable', 'fitness'] },
  { id: 4, name: 'Laptop Pro', description: 'Powerful laptop for professionals with high performance CPU', price: 1499.99, category: 'Computers', inStock: true, tags: ['computer', 'work'] },
  { id: 5, name: 'Bluetooth Speaker', description: 'Portable speaker with amazing sound quality and waterproof design', price: 79.99, category: 'Audio', inStock: true, tags: ['speaker', 'portable', 'wireless'] },
  { id: 6, name: 'Tablet Ultra', description: 'Lightweight tablet with a beautiful display and long battery life', price: 399.99, category: 'Electronics', inStock: true, tags: ['tablet', 'portable'] },
  { id: 7, name: 'Gaming Console', description: 'Next-generation gaming with advanced graphics and fast performance', price: 499.99, category: 'Gaming', inStock: false, tags: ['gaming', 'entertainment'] },
  { id: 8, name: 'Wireless Earbuds', description: 'Comfortable earbuds with noise isolation and premium sound', price: 129.99, category: 'Audio', inStock: true, tags: ['wireless', 'earbuds', 'portable'] }
];

// Define an async function to demonstrate search operations
async function demonstrateSearchOperations() {
  try {
    console.log('===== OUTHAD SEARCH - SEARCH CAPABILITIES DEMONSTRATION =====');
    
    // Create a test index
    const indexName = `products-search-demo-${Date.now()}`;
    console.log(`\nCreating test index: ${indexName}`);
    await client.indexes.create(indexName, { primaryKey: 'id' });
    
    // Configure index settings for filtering and faceting
    console.log('\nConfiguring index settings for search demo...');
    await client.index(indexName).updateFilterableAttributes(['category', 'price', 'inStock', 'tags']);
    await client.index(indexName).updateSortableAttributes(['price']);
    
    // Add documents to the index
    console.log('\nAdding sample documents for search:');
    await client.index(indexName).addDocuments(sampleProducts);
    console.log(`Added ${sampleProducts.length} sample documents`);
    
    // Wait for indexing to complete
    console.log('\nWaiting for indexing to complete...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 1. BASIC SEARCH
    console.log('\n1. Basic search:');
    const basicSearchResults = await client.index(indexName).search('wireless');
    console.log(`Found ${basicSearchResults.hits.length} results for 'wireless'`);
    console.log('Results:', basicSearchResults.hits.map(hit => hit.name));
    
    // 2. SEARCH WITH PAGINATION
    console.log('\n2. Search with pagination:');
    const paginatedResults = await client.index(indexName).search('smart', {
      limit: 1,
      offset: 0
    });
    console.log(`Found ${paginatedResults.estimatedTotalHits} total results, showing ${paginatedResults.hits.length} results`);
    console.log('Paginated result:', paginatedResults.hits.map(hit => hit.name));
    
    // 3. SEARCH WITH ATTRIBUTE FILTERING
    console.log('\n3. Search with specific attributes returned:');
    const filteredAttributes = await client.index(indexName).search('portable', {
      attributesToRetrieve: ['name', 'price']
    });
    console.log('Results with only name and price:', filteredAttributes.hits);
    
    // 4. SEARCH WITH FILTERING
    console.log('\n4. Search with filtering:');
    const filteredResults = await client.index(indexName).search('', {
      filter: 'category = Audio AND inStock = true'
    });
    console.log(`Found ${filteredResults.hits.length} audio products in stock`);
    console.log('Filtered results:', filteredResults.hits.map(hit => hit.name));
    
    // 5. SEARCH WITH SORTING
    console.log('\n5. Search with sorting:');
    const sortedResults = await client.index(indexName).search('', {
      sort: ['price:asc'],
      limit: 3
    });
    console.log('Top 3 cheapest products:', sortedResults.hits.map(hit => `${hit.name}: $${hit.price}`));
    
    // 6. SEARCH WITH HIGHLIGHTING
    console.log('\n6. Search with highlighting:');
    const highlightedResults = await client.index(indexName).search('performance', {
      attributesToHighlight: ['description'],
      highlightPreTag: '<em>',
      highlightPostTag: '</em>'
    });
    console.log('Highlighted results:', highlightedResults.hits.map(hit => ({
      name: hit.name,
      description: hit._formatted?.description || hit.description
    })));
    
    // 7. FACETED SEARCH
    console.log('\n7. Faceted search:');
    const facetedResults = await client.index(indexName).search('', {
      facets: ['category', 'tags']
    });
    console.log('Category distribution:', facetedResults.facetDistribution?.category);
    console.log('Tags distribution:', facetedResults.facetDistribution?.tags);
    
    // 8. PLACEHOLDER SEARCH
    console.log('\n8. Placeholder search (empty query with filters):');
    const placeholderResults = await client.index(indexName).search('', {
      filter: 'price < 200',
      sort: ['price:asc']
    });
    console.log(`Found ${placeholderResults.hits.length} products under $200:`);
    console.log(placeholderResults.hits.map(hit => `${hit.name}: $${hit.price}`));
    
    // 9. SEARCH FOR FACET VALUES
    console.log('\n9. Search for facet values:');
    try {
      const facetValueResults = await client.index(indexName).searchForFacetValues({
        facetName: 'tags',
        facetQuery: 'wire'
      });
      console.log('Matching tag facets for "wire":');
      console.log(facetValueResults.facetHits);
    } catch (error) {
      console.log('Note: searchForFacetValues may need additional configuration');
    }
    
    // 10. MULTI-SEARCH
    console.log('\n10. Multi-search (multiple queries at once):');
    const multiSearchResults = await client.multiSearch({
      queries: [
        { indexUid: indexName, q: 'wireless' },
        { indexUid: indexName, q: '', filter: 'category = Gaming' }
      ]
    });
    console.log('Multi-search results:');
    console.log('Query 1 (wireless products):', multiSearchResults.results[0].hits.map(hit => hit.name));
    console.log('Query 2 (gaming products):', multiSearchResults.results[1].hits.map(hit => hit.name));
    
    // 11. ABORTABLE SEARCH EXAMPLE
    console.log('\n11. Abortable search (demonstration):');
    console.log(`
const controller = new AbortController();

// Start a search request that can be aborted
const searchPromise = client.index('${indexName}').search('wireless', {}, {
  signal: controller.signal
});

// Abort the request before it completes
controller.abort();

// Handling the aborted request
searchPromise
  .then(results => console.log('Search results:', results))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Search was aborted');
    } else {
      console.error('Search failed:', error);
    }
  });
`);
    
    // Clean up - delete the test index
    console.log('\nCleaning up - deleting test index');
    await client.index(indexName).delete();
    
  } catch (error) {
    console.error('Error during search operations:', error);
  }
}

// Run the demonstration
demonstrateSearchOperations(); 