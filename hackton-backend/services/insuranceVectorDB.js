import { create, insert, search } from '@orama/orama';
import logger from '../utils/logger.js';

class InsuranceVectorDB {
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
        logger.info('Insurance VectorDB initialized', 'InsuranceVectorDB');
    }

    async upsert(doc) {
        if (!this.initialized) await this.initialize();
        await insert(this.collection, { id: doc.id, title: doc.title, content: doc.content });
    }

    async search(query, limit = 5) {
        if (!this.initialized) await this.initialize();
        const results = await search(this.collection, { term: query, limit });
        logger.debug(`Insurance Search: Query="${query}" Hits=${results.hits.length}`, 'InsuranceVectorDB');
        return results.hits.map(hit => hit.document);
    }
}

const insuranceVectorDB = new InsuranceVectorDB();

// Mock initial data
insuranceVectorDB.initialize().then(async () => {
    await insuranceVectorDB.upsert({ id: 'ins_1', title: 'Health Insurance', content: 'A health insurance policy covers your medical expenses, including hospitalization, day-care procedures, and pre & post hospitalisation.' });
    await insuranceVectorDB.upsert({ id: 'ins_2', title: 'Term Insurance', content: 'Term insurance is a pure life cover policy that provides financial protection to your family in case of your untimely demise.' });
    await insuranceVectorDB.upsert({ id: 'ins_3', title: 'Car Insurance', content: 'Third-party car insurance is mandatory in India, but comprehensive cover protects your own vehicle from damages as well.' });
});

export default insuranceVectorDB;
