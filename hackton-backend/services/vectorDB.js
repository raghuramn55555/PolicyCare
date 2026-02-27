import { create, insert, search } from '@orama/orama';
import logger from '../utils/logger.js';

/**
 * PolicySetu 2.0 Vector Database
 * Powered by Orama (In-Memory, Hackathon Friendly)
 * Maintains separate collections per language for strict RAG routing.
 */
class VectorDB {
  constructor() {
    this.collections = {
      en: null,
      te: null,
      hi: null,
      agents: null
    };
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    // Create Policy Collections for EN, TE, HI
    for (const lang of ['en', 'te', 'hi']) {
      this.collections[lang] = await create({
        schema: {
          id: 'string',
          name: 'string',
          description: 'string',
          type: 'string',
          category: 'string',
          minAge: 'number',
          maxAge: 'number',
          minPremium: 'number',
          occupation: 'string',
          gender: 'string',
          benefits: 'string',
          eligibility: 'string',
          coverage_summary: 'string',
          ideal_for: 'string',
          content: 'string' // Searchable text blob
        }
      });
    }

    // Create Agents Collection
    this.collections.agents = await create({
      schema: {
        id: 'string',
        name: 'string',
        location: 'string',
        languages: 'string', // Space separated list for search
        pincode: 'string'
      }
    });

    this.initialized = true;
    logger.info('VectorDB (Multilingual) initialized via Orama', 'VectorDB');
  }

  async upsertPolicy(policy, lang = 'en') {
    if (!this.initialized) await this.initialize();

    // Check if it's a placeholder
    if (policy.status === 'placeholder') return;

    // Extract fields based on language with fallback
    const name = policy.name?.[lang] || policy.name?.['en'] || policy.name;
    const description = policy.description?.[lang] || policy.description?.['en'] || '';
    const eligibility = policy.eligibility?.[lang] || '';
    const benefits = policy.benefits?.[lang] || '';
    const coverage = policy.coverage_summary?.[lang] || '';
    const idealFor = policy.ideal_for?.[lang] || '';

    // Create a rich content string for search (Dual RAG context)
    const contentBlob = `
      Title: ${name}
      Type: ${policy.type}
      Category: ${policy.category || policy.policy_type || 'General'}
      Description: ${description}
      Benefits: ${benefits}
      Eligibility: ${eligibility}
      Coverage: ${coverage}
    `.replace(/\s+/g, ' ').trim();

    const doc = {
      id: policy.id,
      name: name,
      description: description,
      type: policy.type,
      category: policy.category || policy.policy_type || 'General',
      minAge: policy.minAge || 0,
      maxAge: policy.maxAge || 100,
      minPremium: policy.minPremium || 0,
      occupation: policy.occupation || '',
      gender: policy.gender || '',
      benefits: benefits,
      eligibility: eligibility,
      coverage_summary: coverage,
      ideal_for: idealFor,
      content: contentBlob
    };

    await insert(this.collections[lang], doc);
  }

  async upsertAgent(agent) {
    if (!this.initialized) await this.initialize();

    await insert(this.collections.agents, {
      id: agent.id,
      name: agent.name,
      location: agent.location,
      languages: agent.languages.join(' '),
      pincode: agent.pincode
    });
  }

  async searchPolicies(query, lang = 'en', limit = 5) {
    if (!this.initialized) await this.initialize();
    if (!this.collections[lang]) return [];

    const results = await search(this.collections[lang], {
      term: query,
      limit: limit
    });
    logger.debug(`Search: Query="${query}" Lang="${lang}" Hits=${results.hits.length}`, 'VectorDB');
    return results.hits.map(hit => hit.document);
  }

  async searchAgents(pincode, language, limit = 5) {
    if (!this.initialized) await this.initialize();

    const results = await search(this.collections.agents, {
      term: `${pincode} ${language}`,
      limit: limit
    });
    return results.hits.map(hit => hit.document);
  }
}

// Singleton Export
const vectorDB = new VectorDB();
export default vectorDB;
