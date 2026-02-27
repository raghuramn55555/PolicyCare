import BaseAgent from './BaseAgent.js';
import vectorDB from '../services/vectorDB.js';

/**
 * Location Agent
 * Finds nearby human agents based on Pincode.
 */
export default class LocationAgent extends BaseAgent {
    constructor() {
        super('LocationAgent');
    }

    async execute(input, context) {
        const { pincode, userProfile } = input;
        const language = userProfile?.language || 'en';
        const limit = 3;

        if (!pincode) return [];

        this.log(`Searching agents near ${pincode}`);
        const agents = await vectorDB.searchAgents(pincode, language, limit);
        return agents;
    }
}
