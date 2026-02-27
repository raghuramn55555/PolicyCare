import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function validatePolicies() {
  console.log('🚀 Validating policies.json for Server Ingestion...\n');
  const policiesPath = path.join(__dirname, '..', 'policies.json');

  if (!fs.existsSync(policiesPath)) {
    console.error('❌ policies.json not found!');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(policiesPath, 'utf8'));
  const policies = data.policies || [];
  console.log(`✅ policies.json is valid JSON. Found ${policies.length} items.`);

  console.log('\nℹ️  NOTE: Vector Database is In-Memory (Orama).');
  console.log('   Data ingestion happens automatically when running "npm start".');
  console.log('   You do not need to run this script to initialize the DB.');
}

validatePolicies();
