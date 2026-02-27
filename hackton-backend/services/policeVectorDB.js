import { create, insert, search } from '@orama/orama';
import logger from '../utils/logger.js';

class PoliceVectorDB {
    constructor() {
        this.collection = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        this.collection = await create({
            schema: {
                id: 'string',
                title: 'string',
                content: 'string'
            }
        });

        this.initialized = true;
        logger.info('Police VectorDB initialized', 'PoliceVectorDB');
    }

    async upsert(doc) {
        if (!this.initialized) await this.initialize();
        await insert(this.collection, { id: doc.id, title: doc.title, content: doc.content });
    }

    async search(query, limit = 5) {
        if (!this.initialized) await this.initialize();
        const results = await search(this.collection, { term: query, limit });
        logger.debug(`Police Search: Query="${query}" Hits=${results.hits.length}`, 'PoliceVectorDB');
        return results.hits.map(hit => hit.document);
    }
}

const policeVectorDB = new PoliceVectorDB();

// Mock initial data
policeVectorDB.initialize().then(async () => {
    await policeVectorDB.upsert({ id: 'pol_1', title: 'Filing FIR', content: 'You can file a First Information Report (FIR) directly at your local police station for any cognizable offense.' });
    await policeVectorDB.upsert({ id: 'pol_2', title: 'Traffic Rules', content: 'Under the Motor Vehicles Act, driving without a helmet or seatbelt is punishable by law.' });
    await policeVectorDB.upsert({ id: 'pol_3', title: 'Cyber Crime', content: 'Report cyber crimes through the National Cyber Crime Reporting Portal or call 1930.' });
});

export default policeVectorDB;
