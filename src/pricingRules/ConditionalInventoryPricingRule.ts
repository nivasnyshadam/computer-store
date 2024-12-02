import type { Product, Rule } from "../types.ts";
import { pricing } from "../inventory.ts";

export class ConditionalInventoryPricingRule {
  private rules: Rule[] = [];

  constructor(initialRules: Rule[]) {
    this.rules = [...initialRules];
  }
  // Get existing rules
  getRules(): Rule[] {
    return this.rules;
  }

  // Add new rules dynamically
  addRules(newRules: Rule[]): void {
    this.rules.push(...newRules);
  }

  // Replace all existing rules
  setRules(newRules: Rule[]): void {
    this.rules = [...newRules];
  }

  // Apply all rules to the cart
  apply(cart: Product[]): number {
      console.log(cart);
    const productFrequency: { [key: number]: number } = cart.reduce(
      (frequencyMap, item) => {
        frequencyMap[item.id] = (frequencyMap[item.id] || 0) + 1;
        return frequencyMap;
      },
      {} as { [key: number]: number }
    );
	const discount = this.rules.reduce((discount, item) => {
    console.log(this.rules)
    console.log(productFrequency)
    console.log(item)
		if (productFrequency[item.productIds[0]] >= item.offerRequirementUnits) {
			const unit = pricing.find((key) => key.id === item.productIds[0]);
      if(unit){
        console.log(item.productIds[0], unit.price, item.discountOnEach);
        console.log(
          Math.floor(productFrequency[item.productIds[0]] / item.offerRequirementUnits),
        );
        const multiplier = item.multiplierRequired
          ? item.offerRequirementUnits *
            Math.floor(productFrequency[item.productIds[0]] / item.offerRequirementUnits)
          : productFrequency[item.productIds[0]];
        console.log(multiplier);
        return discount + unit.price * item.discountOnEach * multiplier;
      }
			
		}
		return discount;
	}, 0);

	return discount;
  }
}