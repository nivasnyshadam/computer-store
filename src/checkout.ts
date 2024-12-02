import type { Product, PricingRule } from "./types.ts";

export class Checkout {
  private cart: Product[] = [];
  private pricingRules: PricingRule[];

  constructor(pricingRules: PricingRule[]) {
    this.pricingRules = pricingRules; 
  }

  // Replace all existing rules
  setPricingRules(newRules: PricingRule[]): void {
    this.pricingRules = [...newRules];
    console.log("Pricing rules updated:", this.pricingRules);
  }

 // Add new rules dynamically
  addPricingRules(newRules: PricingRule[]): void {
    this.pricingRules.push(...newRules);
    console.log("New pricing rules added:", newRules);
  }

  // Add a product to the cart
  scan(product: Product): void {
    this.cart.push(product);
  }

  // Calculate the total price with discounts
  total(): number {
    const baseTotal = this.cart.reduce((sum, item) => sum + item.price, 0);
    console.log(this.pricingRules)
    const totalDiscount = this.pricingRules.reduce((discount, rule) => {
      if (rule.apply) {
        return discount + rule.apply(this.cart);
      }
      return discount;
    }, 0);

    return Number.parseFloat((baseTotal - totalDiscount).toFixed(2));
  }

  // Show the current cart (for debugging or display)
  showCart(): void {
    console.table(this.cart);
  }

  // Show current pricing rules (for debugging or display)
  showPricingRules(): void {
    console.table(this.pricingRules);
  }
}