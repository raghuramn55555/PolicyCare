import IntentAgent from '../agents/IntentAgent.js';
import RetrievalAgent from '../agents/RetrievalAgent.js';
import EligibilityAgent from '../agents/EligibilityAgent.js';
import ReasoningAgent from '../agents/ReasoningAgent.js';
import ComparisonAgent from '../agents/ComparisonAgent.js';
import LocationAgent from '../agents/LocationAgent.js';
import logger from '../utils/logger.js';

// FAQ Knowledge Base for common policy questions
const FAQ_KB = [
    { keywords: ['pmjay', 'ayushman', 'ayushman bharat'], answer: '**Ayushman Bharat (PM-JAY)** is the world\'s largest health insurance scheme. It provides ₹5 lakh coverage per family per year for secondary and tertiary hospitalisation. Eligible BPL families get cashless treatment at 14,000+ empanelled hospitals. Visit pmjay.gov.in or your nearest Ayushman Bharat Kendra to check eligibility.' },
    { keywords: ['pm kisan', 'kisan samman', 'pmkisan'], answer: '**PM Kisan Samman Nidhi** provides ₹6,000/year directly to small and marginal farmer families in 3 instalments of ₹2,000 each. Register at pmkisan.gov.in or through a Common Service Centre with your Aadhaar and land records.' },
    { keywords: ['pmay', 'awas', 'housing'], answer: '**Pradhan Mantri Awas Yojana (PMAY)** provides affordable housing for EWS/LIG/MIG families with interest subsidy up to ₹2.67 lakh on home loans. Apply through CSC centres or pmayg.nic.in.' },
    { keywords: ['mgnrega', 'nrega', 'mnrega'], answer: '**MGNREGA** guarantees 100 days of wage employment per year to rural households. Daily wages range ₹267-₹333 depending on your state. Apply at your Gram Panchayat with Aadhaar and a photograph.' },
    { keywords: ['pmjjby', 'jeevan jyoti', 'life insurance government'], answer: '**PM Jeevan Jyoti Bima Yojana** offers ₹2 lakh life insurance coverage at just ₹436/year. Enrol through your bank branch or net banking. Eligibility: age 18-50 with a savings account.' },
    { keywords: ['pmsby', 'suraksha bima', 'accident insurance'], answer: '**PM Suraksha Bima Yojana** provides accidental death & disability cover of ₹2 lakh at just ₹20/year. Available to anyone aged 18-70 with a bank account.' },
    { keywords: ['apy', 'atal pension', 'pension scheme'], answer: '**Atal Pension Yojana** provides guaranteed pension of ₹1,000-₹5,000/month after age 60 for unorganised sector workers. Join at age 18-40 through your bank. Government co-contributes 50% for 5 years.' },
    { keywords: ['mudra', 'mudra loan', 'business loan'], answer: '**PM MUDRA Yojana** provides loans up to ₹10 lakh for small businesses. Three categories: Shishu (up to ₹50K), Kishore (₹50K-₹5L), and Tarun (₹5L-₹10L). No collateral required. Apply at any bank.' },
    { keywords: ['sukanya', 'girl child', 'daughter scheme'], answer: '**Sukanya Samriddhi Yojana** is a savings scheme for the girl child with 8.2% interest rate and tax benefits. Open an account at any post office for girls below 10 years.' },
    { keywords: ['ujjwala', 'lpg', 'gas connection'], answer: '**PM Ujjwala Yojana** provides free LPG connections to women from BPL households with ₹1,600 financial assistance. Apply at your nearest LPG distributor with BPL card and Aadhaar.' },
    { keywords: ['scholarship', 'student scheme', 'education scheme'], answer: '**National Scholarship Portal** offers central and state scholarships for students from economically weaker sections. Covers tuition fees and provides maintenance allowance. Apply at scholarships.gov.in.' },
    { keywords: ['term insurance', 'term plan', 'life cover'], answer: '**Term Insurance** provides pure life cover at low premiums. If the policyholder passes away during the term, the nominee receives the sum assured. Top providers include LIC, HDFC Life, Tata AIA, and ICICI Prudential.' },
    { keywords: ['health insurance', 'medical insurance', 'health cover'], answer: '**Health Insurance** covers hospitalisation, day-care, and medical expenses. Family floater plans cover the entire family under one sum insured. Top providers: Star Health, Niva Bupa, Max Bupa.' },
];

/**
 * Agent Orchestrator
 * Coordinates all agents to fulfill the user request.
 */
export default class AgentOrchestrator {
    constructor() {
        this.intentAgent = new IntentAgent();
        this.retrievalAgent = new RetrievalAgent();
        this.eligibilityAgent = new EligibilityAgent();
        this.reasoningAgent = new ReasoningAgent();
        this.comparisonAgent = new ComparisonAgent();
        this.locationAgent = new LocationAgent();
    }

    async handleChat(message, userProfile) {
        logger.info(`Processing: "${message}"`, 'Orchestrator');
        const context = { userProfile };

        // Temporary Isolation Mode Test
        if (message === "__TEST_BACKEND_ISOLATION__") {
            return "Backend is working";
        }

        console.log("Message:", message);
        console.log("UserProfile:", userProfile);

        let intent = 'get_info';
        try {
            // 1. Detect Intent
            intent = await this.intentAgent.execute({ message }, context);
            console.log("Intent:", intent);
            logger.info(`Intent detected: ${intent}`, 'Orchestrator');
        } catch (error) {
            logger.error(`Intent detection failed: ${error.message}`, 'Orchestrator');
            console.log("Intent detection failed.");
            return "Intent detection failed. Please try rephrasing your request.";
        }

        // 2. Route based on Intent
        switch (intent) {
            case 'find_agent':
                return await this.handleLocation(message, context);

            case 'compare_policies':
                return await this.handleComparison(message, context);

            case 'greeting':
                return this.getGreeting(userProfile);

            case 'faq':
                return this.handleFAQ(message, context);

            case 'apply_help':
                return await this.handleApplyHelp(message, context);

            case 'check_eligibility':
            case 'get_info':
            default:
                return await this.handleStandardFlow(message, context, intent);
        }
    }

    getGreeting(profile) {
        const name = profile?.name || profile?.identifier?.split('@')[0] || '';
        const greeting = name ? `Hello ${name}!` : 'Namaste!';
        return `${greeting} I'm your **PolicySetu AI Advisor**. I can help you:\n\n` +
            `• **Find schemes** — "What is PM Kisan?"\n` +
            `• **Check eligibility** — "Am I eligible for PMJAY?"\n` +
            `• **Compare policies** — "Compare term insurance plans"\n` +
            `• **Find agents** — "Find agent near 500001"\n` +
            `• **Learn about policies** — "Tell me about health insurance"\n\n` +
            `How can I help you today?`;
    }

    handleFAQ(message, context) {
        const lowerMsg = message.toLowerCase();
        // Search FAQ knowledge base
        for (const faq of FAQ_KB) {
            if (faq.keywords.some(kw => lowerMsg.includes(kw))) {
                return faq.answer;
            }
        }
        // Fallback: try the standard retrieval flow
        return this.handleStandardFlow(message, context, 'get_info');
    }

    async handleApplyHelp(message, context) {
        const docs = await this.retrievalAgent.execute({ query: message, limit: 1 }, context);
        if (!docs || docs.length === 0) {
            return "I'd love to help you apply! Could you mention the specific scheme or policy name? For example: 'How to apply for PM Kisan?'";
        }
        const policy = docs[0];
        const howTo = policy.how_to_apply || 'Visit the official website or your nearest government office.';
        return `**How to Apply for ${policy.name}:**\n\n${howTo}\n\n🔗 Official source: ${policy.official_source || 'Check the government portal'}`;
    }

    async handleStandardFlow(message, context, intent) {
        const isEli5 = message.toLowerCase().includes('explain like i am 5') || message.toLowerCase().includes('simple');

        let docs = [];
        try {
            docs = await this.retrievalAgent.execute({ query: message, limit: 1 }, context);
            console.log("Retrieved docs:", docs);
        } catch (error) {
            logger.error(`Policy retrieval failed: ${error.message}`, 'Orchestrator');
            console.log("Policy retrieval failed.", error);
            return "Policy retrieval failed. We are unable to fetch policies at the moment.";
        }

        if (!docs || !Array.isArray(docs) || docs.length === 0) {
            return "I'm sorry, I couldn't find a specific policy matching your query. Try asking about a specific scheme like 'PM Kisan', 'Ayushman Bharat', or a topic like 'health insurance' or 'pension plans'.";
        }
        const policy = docs[0];

        try {
            const eligibilityResult = await this.eligibilityAgent.execute({ policy }, context);
            const reasoning = await this.reasoningAgent.execute({ policy, eligibilityResult, isEli5 }, context);

            let response = `**${policy.name}**\n${policy.description}\n\n${reasoning.explanation}`;

            if (intent === 'check_eligibility') {
                response = `**Status: ${eligibilityResult.status}**\n\n${reasoning.explanation}`;
            }

            return response;
        } catch (error) {
            logger.error(`Internal AI processing error (Eligibility/Reasoning): ${error.message}`, 'Orchestrator');
            console.log("Internal AI processing error.", error);
            return "Internal AI processing error. We're having trouble analyzing the policy details completely.";
        }
    }

    async handleComparison(message, context) {
        const docs = await this.retrievalAgent.execute({ query: message, limit: 1 }, context);
        if (!docs || docs.length === 0) return "I need to know which policy to compare. Try 'Compare PMJAY vs PMJJBY'.";
        return await this.comparisonAgent.execute({ primaryPolicy: docs[0], query: message }, context);
    }

    async handleLocation(message, context) {
        const pinMatch = message.match(/\b\d{6}\b/) || [context.userProfile?.pincode];
        const pincode = pinMatch?.[0];

        if (!pincode) return "I need a pincode to find agents nearby. Please share your 6-digit pincode, e.g., 'Find agent near 500001'.";

        const agents = await this.locationAgent.execute({ pincode }, context);

        if (agents.length === 0) return `No agents found near ${pincode}. Try a major city pincode like 500001 (Hyderabad) or 110001 (Delhi).`;

        return `Found **${agents.length} agents** near ${pincode}:\n\n` +
            agents.map(a => `• **${a.name}** — ${a.type}\n  📍 ${a.location} | 🗣️ ${Array.isArray(a.languages) ? a.languages.join(', ') : a.languages}`).join('\n\n');
    }
}

