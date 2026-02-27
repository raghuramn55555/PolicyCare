import BaseAgent from './BaseAgent.js';

/**
 * Intent Agent
 * Determines the User's Intent from the message.
 * Supports: 'check_eligibility', 'get_info', 'compare', 'find_agent', 'greeting'
 */
export default class IntentAgent extends BaseAgent {
    constructor() {
        super('IntentAgent');
    }

    async execute(input, context) {
        const { message } = input;
        const lowerMsg = message.toLowerCase();

        // 1. Greeting
        if (['hi', 'hello', 'hey', 'namaste'].includes(lowerMsg.replace(/[^a-z]/g, ''))) {
            return 'greeting';
        }

        // 2. Comparison
        if (lowerMsg.includes('compare') || lowerMsg.includes('better than') || lowerMsg.includes(' vs ') || lowerMsg.includes('difference between')) {
            return 'compare_policies';
        }

        // 3. Apply / How to
        if (lowerMsg.includes('how to apply') || lowerMsg.includes('how do i apply') || lowerMsg.includes('how can i apply') || lowerMsg.includes('apply for') || lowerMsg.includes('registration process')) {
            return 'apply_help';
        }

        // 4. Eligibility
        if (lowerMsg.includes('eligible') || lowerMsg.includes('can i apply') || lowerMsg.includes('am i allow') || lowerMsg.includes('qualify') || lowerMsg.includes('can i get')) {
            return 'check_eligibility';
        }

        // 5. Find Agent / Location
        if (lowerMsg.includes('agent') || lowerMsg.includes('where') || lowerMsg.includes('location') || lowerMsg.includes('pin code') || lowerMsg.includes('near me') || lowerMsg.includes('nearby')) {
            return 'find_agent';
        }

        // 6. FAQ / General Knowledge
        if (lowerMsg.includes('what is') || lowerMsg.includes('what are') || lowerMsg.includes('tell me about') || lowerMsg.includes('explain') || lowerMsg.includes('how does') || lowerMsg.includes('meaning of') || lowerMsg.includes('benefits of')) {
            return 'faq';
        }

        // Default: Information Retrieval
        return 'get_info';
    }
}
