import { Checkout } from "./src/checkout.ts";
import type { Product, PricingRule } from "./src/types.ts";

describe("Checkout Class", () => {
  let checkout: Checkout;
  let sampleProducts: Product[];
  let initialRules: PricingRule[];

  beforeEach(() => {
    sampleProducts = [
      { id: 1, name: "Super iPad", price: 549.99, sku: "ipd" },
      { id: 2, name: "MacBook Pro", price: 1399.99, sku: "mbp" },
      { id: 3, name: "Apple TV", price: 109.50, sku: "atv" },
    ];

    initialRules = [
      {
        id: 1,
        productIds: [1],
        offerRequirementUnits: 3,
        multiplierRequired: true,
        discountOnEach: 0.1, // 10% discount per unit
        apply(cart: Product[]): number {
          const eligibleItems = cart.filter((item) => item.id === 1);
          const quantity = eligibleItems.length;

          if (quantity >= 3) {
            const multiplier = Math.floor(quantity / 3);
            return multiplier * eligibleItems[0].price * 0.1;
          }
          return 0;
        },
      },
    ];

    checkout = new Checkout(initialRules);
  });

  test("should initialize with initial pricing rules", () => {
    expect(checkout.total()).toBe(0); // No items in cart yet
  });

  test("should add a product to the cart", () => {
    checkout.scan(sampleProducts[0]);
    expect(checkout.total()).toBeCloseTo(549.99); // Total for one iPad
  });

  test("should calculate discount based on pricing rules", () => {
    checkout.scan(sampleProducts[0]);
    checkout.scan(sampleProducts[0]);
    checkout.scan(sampleProducts[0]); // 3 iPads to trigger discount

    const total = checkout.total();
    const expectedTotal = 3 * 549.99 - (3 * 549.99 * 0.1);
    expect(total).toBeCloseTo(expectedTotal);
  });

  test("should update pricing rules dynamically", () => {
    const newRule: PricingRule = {
      id: 2,
      productIds: [3],
      offerRequirementUnits: 2,
      multiplierRequired: false,
      discountOnEach: 0.2, // 20% discount per unit
      apply(cart: Product[]): number {
        const eligibleItems = cart.filter((item) => item.id === 3);
        const quantity = eligibleItems.length;

        if (quantity >= 2) {
          return quantity * eligibleItems[0].price * 0.2;
        }
        return 0;
      },
    };

    checkout.addPricingRules([newRule]);
    checkout.scan(sampleProducts[2]);
    checkout.scan(sampleProducts[2]); // 2 Apple TVs to trigger discount

    const total = checkout.total();
    const expectedTotal = 2 * 109.50 - (2 * 109.50 * 0.2);
    expect(total).toBeCloseTo(expectedTotal);
  });

  test("should replace all pricing rules dynamically", () => {
    const newRules: PricingRule[] = [
      {
        id: 3,
        productIds: [2],
        offerRequirementUnits: 1,
        multiplierRequired: false,
        discountOnEach: 0.15, // 15% discount per unit
        apply(cart: Product[]): number {
          const eligibleItems = cart.filter((item) => item.id === 2);
          const quantity = eligibleItems.length;

          if (quantity >= 1) {
            return quantity * eligibleItems[0].price * 0.15;
          }
          return 0;
        },
      },
    ];

    checkout.setPricingRules(newRules);
    checkout.scan(sampleProducts[1]); // 1 MacBook Pro

    const total = checkout.total();
    const expectedTotal = 1399.99 - (1399.99 * 0.15);
    expect(total).toBeCloseTo(expectedTotal);
  });

  test("should handle empty cart correctly", () => {
    expect(checkout.total()).toBe(0);
  });

  test("should handle cart with no applicable discounts", () => {
    checkout.scan(sampleProducts[2]); // 1 Apple TV
    expect(checkout.total()).toBeCloseTo(109.50);
  });
});