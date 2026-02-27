import insuranceVectorDB from './insuranceVectorDB.js';
import logger from '../utils/logger.js';

class InsuranceAgentOrchestrator {
    constructor() {
        this.memory = [];
        this.systemPrompt = "You are a licensed Financial Insurance Advisor. Explain coverage options and terms clearly using the retrieved context.";
    }

    async handleChat(message) {
        logger.info(`[INSURANCE_RAG] Processing: "${message}"`, 'InsuranceOrchestrator');

        // Retrieval
        const docs = await insuranceVectorDB.search(message, 3);
        const contextText = docs.map(d => `${d.title}: ${d.content}`).join('\n\n');

        logger.info(`[INSURANCE_RAG] Found ${docs.length} docs`, 'InsuranceOrchestrator');

        // Mock LLM Response to demonstrate separation of agent/prompt
        const prompt = `${this.systemPrompt}\n\nContext:\n${contextText}\n\nUser Question:\n${message}`;

        let reply;
        if (docs.length === 0) {
            reply = "I don't have enough insurance information to provide a clear answer.";
        } else {
            reply = `(Insurance Agent Mock Response)\nAccording to typical coverage options: ${docs[0].content}\n\nPlease read your policy document carefully.`;
        }

        this.memory.push({ request: message, response: reply });
        logger.debug(`[INSURANCE_RAG] Saved to memory`, 'InsuranceOrchestrator');

        return reply;
    }
}

export default new InsuranceAgentOrchestrator();
