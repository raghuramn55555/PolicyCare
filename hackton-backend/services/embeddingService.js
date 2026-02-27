import OpenAI from 'openai';
import config from '../config/index.js';
import logger from '../utils/logger.js';

// Initialize OpenAI client (for embeddings)
// Fallback to a simple mock if API key not provided (for demo purposes)
const openai = config.openaiApiKey
  ? new OpenAI({ apiKey: config.openaiApiKey })
  : null;

/**
 * Generates embedding vector for given text
 * Uses OpenAI's text-embedding-3-small model (cheap & fast)
 * 
 * @param {string} text - Text to generate embedding for
 * @returns {Promise<number[]>} - Embedding vector
 */
export async function generateEmbedding(text) {
  // If OpenAI API key is available, use it
  if (openai) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.trim(),
      });
      return response.data[0].embedding;
    } catch (error) {
      logger.error(`OpenAI embedding error: ${error.message}`, 'Embedding');
      throw new Error('Failed to generate embedding with OpenAI');
    }
  }

  // Fallback: Simple mock embedding for demo (not production-ready)
  // In production, use a proper embedding model or API
  logger.warn('Using mock embeddings (no OPENAI_API_KEY set)', 'Embedding');
  return generateMockEmbedding(text);
}

/**
 * Mock embedding generator (for demo/hackathon)
 * Creates a simple hash-based vector representation
 * NOT suitable for production - use real embeddings!
 */
function generateMockEmbedding(text) {
  const vector = new Array(384).fill(0);
  const words = text.toLowerCase().split(/\s+/);

  words.forEach((word, i) => {
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = ((hash << 5) - hash) + word.charCodeAt(j);
      hash = hash & hash; // Convert to 32-bit integer
    }
    const index = Math.abs(hash) % 384;
    vector[index] += 1 / (i + 1); // Weight decreases with position
  });

  // Normalize vector
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 ? vector.map(val => val / magnitude) : vector;
}

/**
 * Generates embedding text for a policy in a specific language
 * 
 * @param {Object} policy - Policy object
 * @param {string} lang - Language code (en, te, hi)
 * @returns {string} - Embedding text
 */
export function generatePolicyEmbeddingText(policy, lang = 'en') {
  const content = policy.languageContent?.[lang] || {};
  const parts = [
    `${policy.name} (${policy.type})`,
    content.simple || '',
    content.eli5 || '',
    policy.ageRange ? `Ages ${policy.ageRange}` : '',
    policy.coverage ? `Cover: ${policy.coverage}` : ''
  ].filter(Boolean);

  return parts.join('. ') + '.';
}

/**
 * Generates embedding text for user profile query with language awareness
 * 
 * @param {Object} profile - User profile
 * @returns {string} - Query embedding text
 */
export function generateUserQueryText(profile) {
  const { age, income, needs, gender, language } = profile;
  const langLabel = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';

  let query = `[Language: ${langLabel}] Looking for insurance for ${age} year old with income ₹${income}.`;
  if (needs) query += ` Specific needs: ${needs}.`;

  return query;
}
/**
 * Generates embedding text for an agent
 * 
 * @param {Object} agent - Agent object
 * @returns {string} - Embedding text
 */
export function generateAgentEmbeddingText(agent) {
  const parts = [
    `${agent.name} is a ${agent.type} agent`,
    agent.specialization ? `specializing in ${agent.specialization.join(', ')}` : '',
    agent.location ? `located in ${agent.location}` : '',
    agent.languages ? `speaks ${agent.languages.join(', ')}` : '',
    agent.experience ? `with ${agent.experience} years of experience` : '',
  ].filter(Boolean);

  return parts.join('. ') + '.';
}

