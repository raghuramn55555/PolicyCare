import RetrievalAgent from '../agents/RetrievalAgent.js';
import EligibilityAgent from '../agents/EligibilityAgent.js';
import RelevanceAgent from '../agents/RelevanceAgent.js';
import ReasoningAgent from '../agents/ReasoningAgent.js';
import logger from '../utils/logger.js';

/**
 * Recommendation Workflow
 * 1. Retrieve Candidates
 * 2. Filter Ineligible
 * 3. Score & Sort (Relevance + Affordability)
 * 4. Separate Schemes vs Policies
 * 5. Explain Top Picks
 */
export default class RecommendationWorkflow {
    constructor() {
        this.retrievalAgent = new RetrievalAgent();
        this.eligibilityAgent = new EligibilityAgent();
        this.relevanceAgent = new RelevanceAgent();
        this.reasoningAgent = new ReasoningAgent();
    }

    async execute(userProfile) {
        logger.info(`Starting for user: ${userProfile.name || 'User'}`, 'RecWorkflow');

        // 1. Normalization (Basic)
        const safeProfile = this.normalizeProfile(userProfile);

        // 2. Retrieval (Broad Search)
        // We search for everything relevant to their profile text
        // 2. Retrieval (Broad Search)
        // STRATEGY: 
        // A. Specific Search: Occupation + State + Needs ( High Precision )
        // B. Broad Search: "Government Scheme Insurance" ( High Recall )
        // We need both to ensure we don't return Empty List just because "Student" keyword missing in generic Health Policy.

        const specifics = `${safeProfile.occupation} ${safeProfile.state} ${safeProfile.needs || ''}`.trim();
        let candidates = [];

        // A. Specific Search
        if (specifics.length > 0) {
            candidates = await this.retrievalAgent.execute({ query: specifics, limit: 30 }, { userProfile: safeProfile });
        }

        // B. Broad Search (Fallback / Supplement)
        // Always fetch some generic ones to ensure we have "General" category items (like Health, Life)
        if (candidates.length < 20) {
            const broadCandidates = await this.retrievalAgent.execute({ query: 'government scheme insurance policy welfare', limit: 40 }, { userProfile: safeProfile });

            // Deduplicate
            const existingIds = new Set(candidates.map(d => d.id));
            for (const doc of broadCandidates) {
                if (!existingIds.has(doc.id)) {
                    candidates.push(doc);
                    existingIds.add(doc.id);
                }
            }
        }

        // 3. Eligibility Filter (Hard Rules)
        const eligibleDocs = [];
        for (const doc of candidates) {
            const result = await this.eligibilityAgent.execute({ policy: doc }, { userProfile: safeProfile });
            if (result.isEligible) {
                eligibleDocs.push(doc);
            }
        }

        // 4. Scoring & Ranking (Affordability + Relevance)
        const rankedDocs = await this.relevanceAgent.execute({ policies: eligibleDocs }, { userProfile: safeProfile });

        // 5. Separation (Schemes vs Policies)
        const schemes = [];
        const policies = [];

        // Top K Output Limit
        let sCount = 0, pCount = 0;
        const LIMIT = 6;

        for (const doc of rankedDocs) {
            // Robust Type Classification
            const typeStr = (doc.type || '').toLowerCase();
            const catStr = (doc.category || '').toLowerCase();
            const hasPremium = doc.minPremium && doc.minPremium > 0;

            // It is insurance if: Type says insurance, OR has premium, OR category keywords match
            const isInsurance = typeStr.includes('insurance') ||
                hasPremium ||
                catStr.includes('life') ||
                catStr.includes('health') ||
                catStr.includes('term');

            if (isInsurance) {
                if (pCount < LIMIT) {
                    policies.push(doc);
                    pCount++;
                }
            } else {
                if (sCount < LIMIT) {
                    schemes.push(doc);
                    sCount++;
                }
            }
        }

        logger.info(`Done. Schemes: ${schemes.length}, Policies: ${policies.length}`, 'RecWorkflow');

        // 6. Explanation Generation (Constraints: "All outputs must be explainable")
        // We generate a short reason for ALL returned items to ensure transparency.

        // Helper to add reason
        const addReason = async (item) => {
            const reasonResult = await this.reasoningAgent.execute({
                policy: item,
                eligibilityResult: { status: 'Eligible', passedRules: item.relevanceFeedback?.map(r => ({ reason: r })) || [] }
            }, { userProfile: safeProfile });
            item.reason = reasonResult.explanation;
            return item;
        };

        // Run in parallel for speed
        await Promise.all([
            ...schemes.map(s => addReason(s)),
            ...policies.map(p => addReason(p))
        ]);

        return {
            schemes,
            policies
        };
    }

    normalizeProfile(profile) {
        return {
            name: profile.name || 'User',
            age: Number(profile.age) || 25,
            annualIncome: Number(profile.annualIncome) || 0,
            monthlyIncome: Number(profile.monthlyIncome) || 0,
            occupation: profile.occupation || 'Unemployed',
            gender: profile.gender || 'male',
            familyStatus: profile.familyStatus || 'single',
            pincode: profile.pincode || '',
            language: profile.language || 'en',
            state: profile.state || ''
        };
    }
}
