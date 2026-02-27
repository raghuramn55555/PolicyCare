import BaseAgent from './BaseAgent.js';

/**
 * Reasoning Agent
 * Generates human-readable explanations and specific ELI5 content.
 */
export default class ReasoningAgent extends BaseAgent {
    constructor() {
        super('ReasoningAgent');
    }

    async execute(input, context) {
        const { policy, eligibilityResult, isEli5 = false } = input;
        const { userProfile } = context;

        const reasons = [];
        const status = eligibilityResult.status;

        // 1. ELI5 Mode
        if (isEli5) {
            return this.generateELI5(policy, status, userProfile);
        }

        // 2. Standard Reasoning
        if (status === 'Eligible') {
            reasons.push('✅ Eligible');

            // Add dynamic positive reasons
            if (eligibilityResult.passedRules.length > 0) {
                const topReasons = eligibilityResult.passedRules.map(r => r.reason).slice(0, 2);
                reasons.push(topReasons.join('. '));
            }

            // Highlight Affordability if calculated (Pre-calc in Relevance, but we can re-infer)
            if (policy.minPremium && userProfile.annualIncome > policy.minPremium * 10) {
                reasons.push(`Affordable premium (₹${policy.minPremium}/yr).`);
            }

        } else {
            // Not Eligible
            reasons.push('❌ Not Eligible');
            reasons.push(eligibilityResult.failedRules.map(r => r.reason).join('. '));
        }

        return {
            explanation: reasons.join(' '),
            confidence: 0.95, // High confidence as we use rule-based validation
            isEligible: status === 'Eligible'
        };
    }

    generateELI5(policy, status, userProfile) {
        let explanation = "";

        if (status === 'Eligible') {
            explanation = `Good news! You can use this. It's like a special helper designed for ${userProfile.occupation || 'people like you'}. It helps you save money or stay safe!`;
        } else {
            explanation = "This one isn't for you right now. It's like trying to wear shoes that are too big or too small. But don't worry, we can find others!";
        }

        return {
            explanation: explanation,
            confidence: 0.9,
            eli5: true
        };
    }
}
