export interface Product {
    id: number;
    sku: string;
    name: string;
    price: number;
  }
  
  export interface Rule {
    id: number;
    productIds: number[];
    offerRequirementUnits: number;
    multiplierRequired: boolean;
    discountOnEach: number;
    totalPriceRequirement?: number; // Future scope
  }
  
  export interface PricingRule extends Rule {
    apply?(cart: Product[]): number;
  }