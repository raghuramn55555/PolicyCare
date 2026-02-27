import fs from 'fs';
import vectorDB from './vectorDB.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

const SUPPORTED_LANGS = config.supportedLanguages;

/**
 * Load policies from policies.json into the vector database
 */
export async function initializePolicies() {
  try {
    const policiesPath = config.paths.policies;
    if (!fs.existsSync(policiesPath)) throw new Error('policies.json not found');

    const policiesData = JSON.parse(fs.readFileSync(policiesPath, 'utf-8'));
    const policies = policiesData.policies || [];

    await vectorDB.initialize();

    for (const policy of policies) {
      if (!policy.id || !policy.name) continue;

      for (const lang of SUPPORTED_LANGS) {
        await vectorDB.upsertPolicy(policy, lang);
      }
    }
    logger.info(`Loaded ${policies.length} policies into Multilingual DB`, 'PolicyLoader');
  } catch (error) {
    logger.error(`Error loading policies: ${error.message}`, 'PolicyLoader');
  }
}

/**
 * Load agents from agents.json into the vector database
 */
export async function initializeAgents() {
  try {
    const agentsPath = config.paths.agents;
    if (!fs.existsSync(agentsPath)) return;

    const agentsData = JSON.parse(fs.readFileSync(agentsPath, 'utf-8'));
    const agents = agentsData.agents || [];

    for (const agent of agents) {
      if (!agent.id || !agent.name) continue;
      await vectorDB.upsertAgent(agent);
    }
    logger.info(`Loaded ${agents.length} agents into database`, 'PolicyLoader');
  } catch (error) {
    logger.error(`Error loading agents: ${error.message}`, 'PolicyLoader');
  }
}
