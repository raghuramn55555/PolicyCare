import BaseAgent from './BaseAgent.js';

/**
 * Relevance Agent (Scoring & Affordability)
 * Ranks policies based on user profile match.
 * Handles "Affordability" checks for Insurance.
 */
export default class RelevanceAgent extends BaseAgent {
    constructor() {
        super('RelevanceAgent');
    }

    async execute(input, context) {
        const { policies } = input;
        const { userProfile } = context;

        const scoredPolicies = policies.map(policy => {
            let score = 50; // Base score
            const feedback = [];

            // A. Affordability Logic (Insurance Only)
            // "Insurance Policies -> Affordability-based"
            if (policy.type === 'Insurance' || policy.minPremium) {
                if (policy.minPremium) {
                    const annualPremium = policy.minPremium * 12; // Assuming minPremium is monthly if low, or yearly. usually yearly in DB? Let's assume input is yearly for now or handle scale.
                    // Heuristic: Premium should not exceed 5-10% of annual income
                    const affordMetric = (policy.minPremium / (userProfile.annualIncome || 1)) * 100;

                    if (userProfile.annualIncome < policy.minPremium) {
                        score -= 50; // Unaffordable
                        feedback.push('High Premium');
                    } else if (affordMetric < 5) {
                        score += 20; // Very affordable
                        feedback.push('Affordable');
                    } else if (affordMetric > 15) {
                        score -= 10; // Expensive
                        feedback.push('Expensive');
                    }
                }
            }

            // B. Contextual Boosts

            // 1. Occupation
            if (policy.occupation && userProfile.occupation) {
                if (policy.occupation.toLowerCase() === userProfile.occupation.toLowerCase()) {
                    score += 30; // Direct match
                    feedback.push('Occupation Match');
                } else if (policy.occupation === 'Unorganized' && ['labor', 'worker', 'maid'].includes(userProfile.occupation.toLowerCase())) {
                    score += 20;
                    feedback.push('Sector Match');
                }
            }

            // 2. Family Status
            if (userProfile.familyStatus) {
                const familyKeywords = ['family', 'term', 'child', 'spouse'];
                const seniorKeywords = ['pension', 'senior', 'retirement'];

                if (['married', 'married_with_kids'].includes(userProfile.familyStatus)) {
                    if (familyKeywords.some(k => (policy.category + policy.name).toLowerCase().includes(k))) {
                        score += 15;
                        feedback.push('Family Plan');
                    }
                }

                if (userProfile.familyStatus === 'senior' || userProfile.age > 55) {
                    if (seniorKeywords.some(k => (policy.category + policy.name).toLowerCase().includes(k))) {
                        score += 25;
                        feedback.push('Senior Priority');
                    }
                }
            }

            // 3. Location / State (if applicable)
            // (Simplified for hackathon)

            return {
                ...policy,
                matchScore: score,
                relevanceFeedback: feedback
            };
        });

        // Sort by Score DESC
        return scoredPolicies.sort((a, b) => b.matchScore - a.matchScore);
    }
}
