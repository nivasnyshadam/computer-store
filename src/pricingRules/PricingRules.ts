import { ConditionalInventoryPricingRule } from "./ConditionalInventoryPricingRule.ts";
import { costingFormula } from "../costing.ts";
import type { Rule } from "../types.ts";

const conditionalInventoryPricingRule = new ConditionalInventoryPricingRule(costingFormula);

export const getConditionalInventoryPricingRule = (): ConditionalInventoryPricingRule => {
  return conditionalInventoryPricingRule;
};


// Get existing rules
export const addPricingRules = (newRules: Rule[]): void => {
  conditionalInventoryPricingRule.addRules(newRules);
};

// Replace all existing rules
export const setPricingRules = (newRules: Rule[]): void => {
  conditionalInventoryPricingRule.setRules(newRules);
};