import BaseAgent from './BaseAgent.js';
import vectorDB from '../services/vectorDB.js';
import EligibilityAgent from './EligibilityAgent.js';
import ReasoningAgent from './ReasoningAgent.js';

/**
 * Comparison Agent
 * Compares two policies side-by-side.
 */
export default class ComparisonAgent extends BaseAgent {
    constructor() {
        super('ComparisonAgent');
        this.eligibilityAgent = new EligibilityAgent();
        this.reasoningAgent = new ReasoningAgent();
    }

    async execute(input, context) {
        const { primaryPolicy, query } = input;
        const { userProfile } = context;
        const language = userProfile?.language || 'en';

        // 1. Find a competitor
        // Simple heuristic: search for similar items
        const searchResults = await vectorDB.searchPolicies(query, language, 3);
        const competitor = searchResults.find(p => p.id !== primaryPolicy.id);

        if (!competitor) {
            return `I couldn't find a similar policy to compare with ${primaryPolicy.name}.`;
        }

        // 2. Evaluate both
        const evalPrimary = await this.eligibilityAgent.execute({ policy: primaryPolicy }, context);
        const evalCompetitor = await this.eligibilityAgent.execute({ policy: competitor }, context);

        // 3. Generate Comparison Text
        const primaryCost = primaryPolicy.minPremium ? `₹${primaryPolicy.minPremium}/yr` : 'Free/Low Cost';
        const compCost = competitor.minPremium ? `₹${competitor.minPremium}/yr` : 'Free/Low Cost';

        const comparisonText = `
    **Comparison**: ${primaryPolicy.name} vs ${competitor.name}
    
    1. **Cost**: ${primaryCost} vs ${compCost}
    2. **Eligibility**: You are **${evalPrimary.status}** for ${primaryPolicy.name} and **${evalCompetitor.status}** for ${competitor.name}.
    3. **Benefit**: ${primaryPolicy.benefits?.slice(0, 50)}... vs ${competitor.benefits?.slice(0, 50)}...
    
    **Verdict**: ${evalPrimary.isEligible && !evalCompetitor.isEligible ? primaryPolicy.name + " is the better choice for you." : "Both have pros and cons. Check the details!"}
    `;

        return comparisonText;
    }
}
