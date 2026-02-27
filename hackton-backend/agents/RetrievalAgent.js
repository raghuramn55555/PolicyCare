import BaseAgent from './BaseAgent.js';
import vectorDB from '../services/vectorDB.js';

/**
 * Retrieval Agent
 * Responsible for fetching relevant policies from VectorDB
 */
export default class RetrievalAgent extends BaseAgent {
    constructor() {
        super('RetrievalAgent');
    }

    async execute(input, context) {
        const { query, limit = 5, typeFilter = null } = input;
        const { userProfile } = context;
        const language = userProfile?.language || 'en';

        this.log(`Searching for: "${query}" in ${language} (Limit: ${limit})`);

        try {
            // 1. Basic Search
            let results = await vectorDB.searchPolicies(query, language, limit * 2);

            if (!results || !Array.isArray(results)) {
                this.log(`Warning: VectorDB returned invalid results. Using empty array.`);
                results = [];
            }

            // 2. Filter by type if requested (e.g. only 'Scheme' or 'Insurance')
            if (typeFilter) {
                results = results.filter(doc =>
                    doc.type && doc.type.toLowerCase() === typeFilter.toLowerCase()
                );
            }

            // Return top K after filtering
            return results.slice(0, limit);
        } catch (error) {
            this.log(`Error during retrieval: ${error.message}`);
            return []; // Safe fallback
        }
    }
}
