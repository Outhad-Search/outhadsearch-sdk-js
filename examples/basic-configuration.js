/**
 * Basic Configuration Example
 * 
 * This example shows how to initialize and configure the Outhad Search client.
 * It demonstrates different methods of configuring the client, request options,
 * and using environment variables.
 */

// Import the SDK
const { OuthadSearch } = require('outhadsearch-sdk-js');
const { spawn } = require('child_process');

// Connection details
const OUTHAD_HOST = 'OUTHADSEARCH_HOST';
const OUTHAD_API_KEY = 'OUTHADSEARCH_API_KEY';

// Basic initialization with host only
console.log('\n--- Basic Client (Host Only) ---');
const basicClient = new OuthadSearch({
  host: OUTHAD_HOST
});
console.log('Basic client created with host only');

// Initialize with both host and API key
console.log('\n--- Standard Client (Host + API Key) ---');
const client = new OuthadSearch({
  host: OUTHAD_HOST,
  apiKey: OUTHAD_API_KEY
});
console.log('Standard client created with host and API key');

// Custom request configuration
console.log('\n--- Client with Custom Headers ---');
const clientWithCustomHeaders = new OuthadSearch({
  host: OUTHAD_HOST,
  apiKey: OUTHAD_API_KEY,
  requestConfig: {
    headers: {
      'Custom-Header': 'Custom-Value'
    }
  }
});
console.log('Client with custom request headers created');

// CLI Configuration Example
console.log('\n--- CLI Configuration Command ---');
console.log('To configure the Outhad Search CLI, use:');
console.log(`outhadsearch config set --host "${OUTHAD_HOST}" --api-key "${OUTHAD_API_KEY}"`);

// Test the connection
console.log('\n--- Testing Connection ---');
async function testConnection() {
  try {
    // Health check
    console.log('Performing health check...');
    const isHealthy = await client.isHealthy();
    console.log(`Outhad Search server is ${isHealthy ? 'healthy' : 'unhealthy'}`);
    
    // Get version information
    const version = await client.getVersion();
    console.log('Outhad Search version:', version);
    
    // List indexes 
    console.log('\nListing available indexes:');
    const indexResults = await client.getIndexes();
    if (indexResults && indexResults.results) {
      console.log(`Found ${indexResults.results.length} indexes:`);
      indexResults.results.forEach(index => {
        console.log(`- ${index.uid} (Primary Key: ${index.primaryKey || 'Not set'})`);
      });
    } else {
      console.log('No indexes found or unexpected response format');
    }
  } catch (error) {
    console.log('Error during connection test:', error.message);
  }
}

// Run the connection test
testConnection();

// Display configuration
console.log('\n--- Configuration Used ---');
console.log({
  host: OUTHAD_HOST,
  apiKey: 'REDACTED'
});

// Environment Variables Usage
console.log('\n--- Environment Variables Usage ---');
console.log('You can configure using environment variables:');
console.log('OUTHAD_HOST - for the host URL');
console.log('OUTHAD_API_KEY - for your API key');

// CLI Configuration Example
console.log('\n--- CLI Configuration Example ---');
console.log('To configure the Outhad Search CLI, you can use the following command:');
console.log(`outhadsearch config set --host "${OUTHAD_HOST}" --api-key "${OUTHAD_API_KEY}"`);

// Execute the CLI command programmatically (demonstration only)
console.log('\n--- Programmatic CLI Execution (example) ---');
function executeCliCommand(args) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: outhadsearch ${args.join(' ')}`);
    
    // In a real implementation, you would uncomment this:
    /*
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
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });
    */
    
    // For demonstration, just simulate success
    resolve({ 
      stdout: 'Configuration updated successfully!\n\nCurrent Configuration:\nHost:       ' + 
              OUTHAD_HOST + '\nAPI Key:     ********\nSDK Version: 0.1.1'
    });
  });
}

// Different module import methods
console.log('\n--- Import Methods (for reference) ---');
console.log('ES Modules:  import { OuthadSearch } from "outhadsearch";');
console.log('CommonJS:    const { OuthadSearch } = require("outhadsearch");');
console.log('UMD/Script:  <script src="https://www.unpkg.com/outhadsearch/dist/umd/index.min.js"></script>');
console.log('Deno:        import { OuthadSearch } from "npm:outhadsearch";');