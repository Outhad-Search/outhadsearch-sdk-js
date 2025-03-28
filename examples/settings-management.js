/**
 * Settings Management Example
 * 
 * This example demonstrates how to configure index settings in Outhad Search
 * to optimize search relevance and behavior.
 */

// Import the SDK
const { OuthadSearch } = require('outhadsearch-sdk-js');

// Initialize the client
const client = new OuthadSearch({
  host: 'OUTHADSEARCH_HOST',
  apiKey: 'OUTHADSEARCH_API_KEY'
});

// Define an async function to demonstrate index settings management
async function demonstrateSettingsManagement() {
  try {
    console.log('===== OUTHAD SEARCH - SETTINGS MANAGEMENT DEMONSTRATION =====');
    
    // Create a test index
    const indexName = `settings-demo-${Date.now()}`;
    console.log(`\nCreating test index: ${indexName}`);
    await client.indexes.create(indexName, { primaryKey: 'id' });
    
    // Get a reference to the index
    const index = client.index(indexName);
    
    // 1. GET ALL SETTINGS
    console.log('\n1. Getting current settings:');
    const currentSettings = await index.getSettings();
    console.log(JSON.stringify(currentSettings, null, 2));
    
    // 2. UPDATE MULTIPLE SETTINGS AT ONCE
    console.log('\n2. Updating multiple settings:');
    const settingsUpdateTask = await index.updateSettings({
      displayedAttributes: ['title', 'description', 'price', 'category'],
      searchableAttributes: ['title', 'description'],
      filterableAttributes: ['category', 'price'],
      sortableAttributes: ['price'],
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness'
      ],
      stopWords: ['the', 'of', 'and'],
      synonyms: {
        'smartphone': ['phone', 'mobile'],
        'laptop': ['notebook', 'computer']
      },
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: {
          oneTypo: 4,
          twoTypos: 8
        },
        disableOnWords: ['premium', 'ultimate']
      }
    });
    
    console.log('Settings update task:', settingsUpdateTask);
    
    // Wait for the settings update task to complete
    console.log('\nWaiting for settings update to complete...');
    await client.waitForTask(settingsUpdateTask.taskUid);
    
    // 3. GET INDIVIDUAL SETTINGS
    console.log('\n3. Getting individual settings:');
    
    // Searchable attributes
    console.log('\n3.1 Searchable attributes:');
    const searchableAttributes = await index.getSearchableAttributes();
    console.log(searchableAttributes);
    
    // Filterable attributes
    console.log('\n3.2 Filterable attributes:');
    const filterableAttributes = await index.getFilterableAttributes();
    console.log(filterableAttributes);
    
    // Sortable attributes
    console.log('\n3.3 Sortable attributes:');
    const sortableAttributes = await index.getSortableAttributes();
    console.log(sortableAttributes);
    
    // Displayed attributes
    console.log('\n3.4 Displayed attributes:');
    const displayedAttributes = await index.getDisplayedAttributes();
    console.log(displayedAttributes);
    
    // Ranking rules
    console.log('\n3.5 Ranking rules:');
    const rankingRules = await index.getRankingRules();
    console.log(rankingRules);
    
    // Synonyms
    console.log('\n3.6 Synonyms:');
    const synonyms = await index.getSynonyms();
    console.log(synonyms);
    
    // Stop words
    console.log('\n3.7 Stop words:');
    const stopWords = await index.getStopWords();
    console.log(stopWords);
    
    // Typo tolerance
    console.log('\n3.8 Typo tolerance:');
    const typoTolerance = await index.getTypoTolerance();
    console.log(typoTolerance);
    
    // 4. UPDATE INDIVIDUAL SETTINGS
    console.log('\n4. Updating individual settings:');
    
    // Update searchable attributes
    console.log('\n4.1 Update searchable attributes:');
    const updateSearchableTask = await index.updateSearchableAttributes([
      'title',
      'description',
      'tags'
    ]);
    await client.waitForTask(updateSearchableTask.taskUid);
    console.log('Updated searchable attributes:', await index.getSearchableAttributes());
    
    // Update filterable attributes
    console.log('\n4.2 Update filterable attributes:');
    const updateFilterableTask = await index.updateFilterableAttributes([
      'category',
      'price',
      'inStock',
      'brand'
    ]);
    await client.waitForTask(updateFilterableTask.taskUid);
    console.log('Updated filterable attributes:', await index.getFilterableAttributes());
    
    // Update synonyms
    console.log('\n4.3 Update synonyms:');
    const updateSynonymsTask = await index.updateSynonyms({
      'phone': ['smartphone', 'mobile', 'cellphone'],
      'tv': ['television', 'monitor', 'screen']
    });
    await client.waitForTask(updateSynonymsTask.taskUid);
    console.log('Updated synonyms:', await index.getSynonyms());
    
    // 5. RESET INDIVIDUAL SETTINGS
    console.log('\n5. Resetting individual settings:');
    
    // Reset stop words
    console.log('\n5.1 Reset stop words:');
    const resetStopWordsTask = await index.resetStopWords();
    await client.waitForTask(resetStopWordsTask.taskUid);
    console.log('Stop words after reset:', await index.getStopWords());
    
    // 6. RESET ALL SETTINGS
    console.log('\n6. Reset all settings:');
    const resetAllTask = await index.resetSettings();
    await client.waitForTask(resetAllTask.taskUid);
    
    console.log('\nAll settings after reset:');
    const finalSettings = await index.getSettings();
    console.log(JSON.stringify(finalSettings, null, 2));
    
    // Clean up - delete the test index
    console.log('\nCleaning up - deleting test index');
    await index.delete();
    
  } catch (error) {
    console.error('Error during settings management demonstration:', error);
  }
}

// Run the demonstration
demonstrateSettingsManagement(); 