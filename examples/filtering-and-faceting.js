/**
 * Filtering and Faceting Example
 * 
 * This example demonstrates how to use filters and facets with Outhad Search
 * to create refined and faceted search experiences.
 */

// Import the SDK
const { OuthadSearch } = require('outhadsearch-sdk-js');

// Initialize the client
const client = new OuthadSearch({
  host: 'OUTHADSEARCH_HOST',
  apiKey: 'OUTHADSEARCH_API_KEY'
});

// Sample products for demonstration
const products = [
  {
    id: 1,
    name: 'Ergonomic Desk Chair',
    description: 'Comfortable office chair with lumbar support',
    price: 249.99,
    category: 'Furniture',
    brand: 'ErgoMax',
    color: 'Black',
    inStock: true,
    rating: 4.5,
    tags: ['office', 'ergonomic', 'chair']
  },
  {
    id: 2,
    name: 'Wireless Mechanical Keyboard',
    description: 'Mechanical keyboard with customizable RGB lighting',
    price: 129.99,
    category: 'Electronics',
    brand: 'TechType',
    color: 'White',
    inStock: true,
    rating: 4.2,
    tags: ['keyboard', 'wireless', 'mechanical', 'gaming']
  },
  {
    id: 3,
    name: 'Ultra-Wide Monitor 34"',
    description: 'Curved ultra-wide monitor for immersive experience',
    price: 499.99,
    category: 'Electronics',
    brand: 'ViewPro',
    color: 'Black',
    inStock: false,
    rating: 4.8,
    tags: ['monitor', 'ultrawide', 'curved']
  },
  {
    id: 4,
    name: 'Adjustable Standing Desk',
    description: 'Electric height-adjustable desk for ergonomic work',
    price: 349.99,
    category: 'Furniture',
    brand: 'ErgoMax',
    color: 'Oak',
    inStock: true,
    rating: 4.7,
    tags: ['desk', 'standing', 'adjustable', 'ergonomic']
  },
  {
    id: 5,
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium headphones with active noise cancellation',
    price: 199.99,
    category: 'Audio',
    brand: 'SoundMaster',
    color: 'Silver',
    inStock: true,
    rating: 4.6,
    tags: ['headphones', 'wireless', 'noise-canceling']
  },
  {
    id: 6,
    name: 'Ergonomic Mouse',
    description: 'Vertical mouse designed for reduced wrist strain',
    price: 59.99,
    category: 'Electronics',
    brand: 'ErgoMax',
    color: 'Black',
    inStock: true,
    rating: 4.3,
    tags: ['mouse', 'ergonomic', 'vertical']
  },
  {
    id: 7,
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360° sound',
    price: 89.99,
    category: 'Audio',
    brand: 'SoundMaster',
    color: 'Blue',
    inStock: true,
    rating: 4.4,
    tags: ['speaker', 'bluetooth', 'portable', 'waterproof']
  },
  {
    id: 8,
    name: 'Laptop Stand',
    description: 'Adjustable aluminum stand for improved posture',
    price: 49.99,
    category: 'Accessories',
    brand: 'TechSupport',
    color: 'Silver',
    inStock: true,
    rating: 4.1,
    tags: ['laptop', 'stand', 'ergonomic', 'portable']
  },
  {
    id: 9,
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with noise isolation',
    price: 129.99,
    category: 'Audio',
    brand: 'SoundMaster',
    color: 'Black',
    inStock: false,
    rating: 4.5,
    tags: ['earbuds', 'wireless', 'noise-isolation']
  },
  {
    id: 10,
    name: 'Mesh Office Chair',
    description: 'Breathable mesh chair with adjustable armrests',
    price: 179.99,
    category: 'Furniture',
    brand: 'ComfortPlus',
    color: 'Gray',
    inStock: true,
    rating: 4.0,
    tags: ['chair', 'office', 'mesh', 'ergonomic']
  }
];

// Define an async function to demonstrate filtering and faceting
async function demonstrateFilteringAndFaceting() {
  try {
    console.log('===== OUTHAD SEARCH - FILTERING AND FACETING DEMONSTRATION =====');
    
    // Create a test index
    const indexName = `filter-facet-demo-${Date.now()}`;
    console.log(`\nCreating test index: ${indexName}`);
    await client.indexes.create(indexName, { primaryKey: 'id' });
    
    // Get a reference to the index
    const index = client.index(indexName);
    
    // Configure the index for filtering and faceting
    console.log('\nConfiguring index for filtering and faceting...');
    
    // Update filterable attributes (required for both filtering and faceting)
    const updateFilterableTask = await index.updateFilterableAttributes([
      'category', 'brand', 'price', 'color', 'inStock', 'rating', 'tags'
    ]);
    await client.waitForTask(updateFilterableTask.taskUid);
    
    // Update sortable attributes
    const updateSortableTask = await index.updateSortableAttributes([
      'price', 'rating'
    ]);
    await client.waitForTask(updateSortableTask.taskUid);
    
    // Update faceting settings
    const updateFacetingTask = await index.updateFaceting({
      maxValuesPerFacet: 20
    });
    await client.waitForTask(updateFacetingTask.taskUid);
    
    // Add documents to the index
    console.log('\nAdding sample products to the index...');
    const addDocumentsTask = await index.addDocuments(products);
    await client.waitForTask(addDocumentsTask.taskUid);
    
    console.log(`Added ${products.length} products to the index`);
    
    // PART 1: FILTERING
    console.log('\n=== PART 1: FILTERING ===');
    
    // 1.1 Simple category filter
    console.log('\n1.1 Simple category filter (Furniture):');
    const categoryResults = await index.search('', {
      filter: 'category = Furniture'
    });
    console.log(`Found ${categoryResults.hits.length} furniture items:`);
    console.log(categoryResults.hits.map(hit => hit.name));
    
    // 1.2 Price range filter
    console.log('\n1.2 Price range filter (items between $50 and $150):');
    const priceRangeResults = await index.search('', {
      filter: 'price >= 50 AND price <= 150'
    });
    console.log(`Found ${priceRangeResults.hits.length} items between $50 and $150:`);
    console.log(priceRangeResults.hits.map(hit => `${hit.name}: $${hit.price}`));
    
    // 1.3 Combining filters with AND
    console.log('\n1.3 Combining filters (Electronics that are in stock):');
    const combinedAndResults = await index.search('', {
      filter: 'category = Electronics AND inStock = true'
    });
    console.log(`Found ${combinedAndResults.hits.length} in-stock electronics:`);
    console.log(combinedAndResults.hits.map(hit => hit.name));
    
    // 1.4 Combining filters with OR
    console.log('\n1.4 Combining filters with OR (Audio OR Furniture):');
    const combinedOrResults = await index.search('', {
      filter: 'category = Audio OR category = Furniture'
    });
    console.log(`Found ${combinedOrResults.hits.length} audio or furniture items:`);
    console.log(combinedOrResults.hits.map(hit => `${hit.name} (${hit.category})`));
    
    // 1.5 Complex filtering
    console.log('\n1.5 Complex filtering (ErgoMax brand OR ratings above 4.5, price under $300):');
    const complexResults = await index.search('', {
      filter: '(brand = ErgoMax OR rating > 4.5) AND price < 300'
    });
    console.log(`Found ${complexResults.hits.length} matching items:`);
    console.log(complexResults.hits.map(hit => `${hit.name} - $${hit.price} - Rating: ${hit.rating}`));
    
    // 1.6 Filtering with arrays using contains
    console.log('\n1.6 Filtering with tags array (items tagged as "ergonomic"):');
    const arrayFilterResults = await index.search('', {
      filter: 'tags IN ["ergonomic"]'
    });
    console.log(`Found ${arrayFilterResults.hits.length} ergonomic items:`);
    console.log(arrayFilterResults.hits.map(hit => `${hit.name} - Tags: ${hit.tags.join(', ')}`));
    
    // 1.7 Combine search query with filters
    console.log('\n1.7 Combining search query with filters (search for "wireless" in Electronics):');
    const queryWithFilterResults = await index.search('wireless', {
      filter: 'category = Electronics'
    });
    console.log(`Found ${queryWithFilterResults.hits.length} wireless electronics:`);
    console.log(queryWithFilterResults.hits.map(hit => hit.name));
    
    // PART 2: FACETING
    console.log('\n=== PART 2: FACETING ===');
    
    // 2.1 Basic faceting across multiple attributes
    console.log('\n2.1 Basic faceting across multiple attributes:');
    const basicFacetResults = await index.search('', {
      facets: ['category', 'brand', 'color', 'inStock']
    });
    
    console.log('Category distribution:');
    console.log(basicFacetResults.facetDistribution.category);
    
    console.log('\nBrand distribution:');
    console.log(basicFacetResults.facetDistribution.brand);
    
    console.log('\nColor distribution:');
    console.log(basicFacetResults.facetDistribution.color);
    
    console.log('\nIn-stock distribution:');
    console.log(basicFacetResults.facetDistribution.inStock);
    
    // 2.2 Faceting with a search query
    console.log('\n2.2 Faceting with a search query (ergonomic):');
    const facetWithQueryResults = await index.search('ergonomic', {
      facets: ['category', 'brand']
    });
    console.log('Category distribution for "ergonomic" items:');
    console.log(facetWithQueryResults.facetDistribution.category);
    console.log('\nBrand distribution for "ergonomic" items:');
    console.log(facetWithQueryResults.facetDistribution.brand);
    
    // 2.3 Faceting with a filter
    console.log('\n2.3 Faceting with a filter (price >= 100):');
    const facetWithFilterResults = await index.search('', {
      filter: 'price >= 100',
      facets: ['category', 'brand', 'inStock']
    });
    console.log('Category distribution for items $100 and above:');
    console.log(facetWithFilterResults.facetDistribution.category);
    console.log('\nBrand distribution for items $100 and above:');
    console.log(facetWithFilterResults.facetDistribution.brand);
    
    // 2.4 Search for facet values
    console.log('\n2.4 Searching for facet values:');
    try {
      const facetSearchResults = await index.searchForFacetValues({
        facetName: 'brand',
        facetQuery: 'sound'
      });
      console.log('Brand facets matching "sound":');
      console.log(facetSearchResults.facetHits);
    } catch (error) {
      console.log('Note: searchForFacetValues may require additional configuration');
    }
    
    // Clean up - delete the test index
    console.log('\nCleaning up - deleting test index');
    await index.delete();
    
  } catch (error) {
    console.error('Error during filtering and faceting demonstration:', error);
  }
}

// Run the demonstration
demonstrateFilteringAndFaceting(); 