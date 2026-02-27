import { initializePolicies, initializeAgents } from './services/policyLoader.js';

async function main() {
    try {
        console.log('🚀 Starting Data Ingestion...');
        // We need to initialize the vectorDB first
        await initializePolicies();
        await initializeAgents();
        console.log('✅ Ingestion Complete.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Ingestion Failed:', err);
        process.exit(1);
    }
}

main();
