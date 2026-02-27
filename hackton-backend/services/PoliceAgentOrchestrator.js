import policeVectorDB from './policeVectorDB.js';
import logger from '../utils/logger.js';

class PoliceAgentOrchestrator {
    constructor() {
        this.memory = [];
        this.systemPrompt = "You are a professional Police/Law Enforcement Assistant. Respond informatively based strictly on the retrieved context.";
    }

    async handleChat(message) {
        logger.info(`[POLICE_RAG] Processing: "${message}"`, 'PoliceOrchestrator');

        // Retrieval
        const docs = await policeVectorDB.search(message, 3);
        const contextText = docs.map(d => `${d.title}: ${d.content}`).join('\n\n');

        logger.info(`[POLICE_RAG] Found ${docs.length} docs`, 'PoliceOrchestrator');

        // Note: we format the prompt string; in a real scenario we'd call an LLM here
        // We will mock the LLM response to demonstrate separation of agent/prompt
        const prompt = `${this.systemPrompt}\n\nContext:\n${contextText}\n\nUser Question:\n${message}`;

        let reply;
        if (docs.length === 0) {
            reply = "I don't have enough law enforcement information to answer that question.";
        } else {
            reply = `(Police Agent Mock Response)\nBased on official procedures: ${docs[0].content}\n\nAlways ensure your safety first.`;
        }

        this.memory.push({ request: message, response: reply });
        logger.debug(`[POLICE_RAG] Saved to memory`, 'PoliceOrchestrator');

        return reply;
    }
}

export default new PoliceAgentOrchestrator();
