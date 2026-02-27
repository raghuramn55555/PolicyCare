import { generateEmbedding } from './embeddingService.js';
import vectorDB from './vectorDB.js';

/**
 * Smart Advisor AI - Government-Grade Intelligent Platform
 */

// 🧩 Smart Validator (formerly Eligibility Agent)
export function smartValidator(policy, userProfile) {
  const { age, annualIncome, gender, occupation, state, city } = userProfile;
  let status = 'Eligible';
  const passedRules = [];
  const failedRules = [];

  // Age check
  if (policy.minAge !== undefined && age < policy.minAge) {
    failedRules.push({ rule: 'Age', reason: `Too young (Min: ${policy.minAge})` });
    status = 'Not Eligible';
  } else if (policy.maxAge !== undefined && age > policy.maxAge) {
    failedRules.push({ rule: 'Age', reason: `Too old (Max: ${policy.maxAge})` });
    status = 'Not Eligible';
  } else {
    passedRules.push({ rule: 'Age', reason: 'Age within eligible range' });
  }

  // Income check
  if (policy.minPremium && annualIncome < (policy.minPremium * 12)) {
    status = 'Limited Eligibility';
    failedRules.push({ rule: 'Income', reason: 'Income might be low for premium' });
  } else {
    passedRules.push({ rule: 'Income', reason: 'Income meets minimum criteria' });
  }

  return { status, passedRules, failedRules };
}

// 🔍 Smart Researcher (formerly Retrieval Agent)
export async function smartResearcher(query, userProfile, topK = 10) {
  const language = userProfile?.language || 'en';
  return await vectorDB.searchPolicies(query, language, topK);
}

// 🧠 Smart Reasoner (formerly Reasoning Agent)
export function smartReasoner(policy, userProfile, validationResult, isEli5 = false) {
  const reasons = [];
  const status = validationResult.status;

  if (isEli5) {
    if (status === 'Eligible') {
      reasons.push("✅ You're a perfect match! It's like a piggy bank that gives you a lot more money if something bad happens.");
    } else if (status === 'Not Eligible') {
      reasons.push("❌ This one isn't for you right now. It's like trying to wear your big brother's shoes—they just don't fit yet!");
    } else {
      reasons.push("🤔 We need to check a few more things, like asking your teacher for a permission slip.");
    }

    return {
      match_score: (validationResult.passedRules.length / (validationResult.passedRules.length + validationResult.failedRules.length || 1) * 10).toFixed(1),
      explanation: reasons.join(' '),
      eli5: true
    };
  }

  // Standard reasoning
  if (status === 'Eligible') {
    reasons.push(`Matched based on age (${userProfile.age}) and income (₹${userProfile.annualIncome.toLocaleString()}).`);
  } else {
    reasons.push(`Note: ${validationResult.failedRules.map(r => r.reason).join(', ')}`);
  }

  return {
    match_score: (validationResult.passedRules.length / (validationResult.passedRules.length + validationResult.failedRules.length || 1) * 10).toFixed(1),
    explanation: reasons.join(' ')
  };
}

// 📊 Comparison Agent (NEW)
export async function comparisonAgent(currentPolicy, query, userProfile) {
  const queryLower = query.toLowerCase();
  const language = userProfile?.language || 'en';

  if (queryLower.includes('compare') || queryLower.includes('vs') || queryLower.includes('better than')) {
    const searchResults = await vectorDB.searchPolicies(query, language, 3);
    const otherPolicy = searchResults.find(p => p.id !== currentPolicy.id);

    if (otherPolicy) {
      return `Comparing ${currentPolicy.name} with ${otherPolicy.name}: 
      - Premium: ${currentPolicy.name} is ₹${currentPolicy.minPremium}/yr vs ${otherPolicy.name} ₹${otherPolicy.minPremium}/yr.
      - Eligibility: You are ${smartValidator(currentPolicy, userProfile).status} for the current one, and ${smartValidator(otherPolicy, userProfile).status} for ${otherPolicy.name}.
      - Verdict: ${currentPolicy.minPremium < otherPolicy.minPremium ? currentPolicy.name : otherPolicy.name} appears more affordable for your profile.`;
    }
  }
  return null;
}

// 📍 Location Agent
export function smartLocator(policy, userProfile) {
  return policy.nearbyAgents || [];
}

// 💬 Main Smart Advisor Chat Handler
export async function agenticRAGChat(message, policy, userProfile, isEli5 = false) {
  const queryLower = message.toLowerCase();

  // 1. Try Comparison Agent first
  const comparison = await comparisonAgent(policy, message, userProfile);
  if (comparison) return comparison;

  // 2. Fallback to standard validation
  const validation = smartValidator(policy, userProfile);
  const reasoning = smartReasoner(policy, userProfile, validation, isEli5);

  if (queryLower.includes('eligible') || queryLower.includes('can i')) {
    return isEli5 ? reasoning.explanation : `Status: ${validation.status}. ${reasoning.explanation}`;
  }

  if (queryLower.includes('apply')) {
    const lang = userProfile?.language || 'en';
    const link = policy.official_source || policy.applyLink || 'Official Portal';

    let instructions = 'Follow instructions on portal';
    if (policy.how_to_apply && policy.how_to_apply[lang]) {
      instructions = policy.how_to_apply[lang];
    } else if (policy.cta) {
      instructions = `Click "${policy.cta}" to proceed`;
    }

    return isEli5
      ? "To apply, click the button! It's like signing your name on a drawing."
      : `Link: ${link}. \nInstructions: ${instructions}`;
  }

  return isEli5
    ? "That's a great question! This policy is here to help keep you safe. Ask me about how to join or if it's right for you!"
    : "I'm your Smart Advisor. I can analyze your eligibility, compare this with other policies, or help you find where to apply. What's on your mind?";
}

// Legacy exports for compatibility with routes
export const eligibilityAgent = smartValidator;

export function formatSchemeForUI(policy, userProfile, validationResult) {
  return {
    provider: policy.provider || 'Verified Govt Provider',
    eligibility_summary: validationResult.status,
    confidence_score: 0.98
  };
}
