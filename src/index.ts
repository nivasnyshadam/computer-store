import * as readline from "node:readline";
import { pricing } from "./inventory.ts";
import { getConditionalInventoryPricingRule, addPricingRules } from "./pricingRules/PricingRules.ts";
import { Checkout } from "./checkout.ts";
import type { PricingRule, Product, Rule } from "./types.ts";

// Setup CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Initialize checkout
const checkout = new Checkout(getConditionalInventoryPricingRule().getRules());

// Helper function to prompt user input
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

// Show inventory
function showInventory(): void {
  console.log("\n--- Inventory ---");
  console.table(pricing);
}

// Show pricing rules
function showPricingRules(): void {
  console.log("\n--- Current Pricing Rules ---");
  console.table(getConditionalInventoryPricingRule().getRules());
}

// Main menu
async function mainMenu(): Promise<void> {
    showPricingRules()
    showInventory()
  console.log("\n--- Main Menu ---");
  console.log("1. Checkout");
  console.log("2. Manage Pricing Rules");
  console.log("3. Show Inventory");
  console.log("4. Show Pricing Rules");
  console.log("5. Exit");

  const option = await prompt("Select an option: ");
  switch (option) {
    case "1":
      await checkoutMenu();
      break;
    case "2":
      await pricingRulesMenu();
      break;
    case "3":
      showInventory();
      await mainMenu();
      break;
    case "4":
      showPricingRules();
      await mainMenu();
      break;
    case "5":
      console.log("Exiting. Goodbye!");
      rl.close();
      break;
    default:
      console.log("Invalid option. Please try again.");
      await mainMenu();
  }
}

// Checkout menu
async function checkoutMenu(): Promise<void> {
  console.log("\n--- Checkout ---");
  const input = await prompt("Enter SKUs separated by commas (e.g., 'atv,ipd,vga'): ");
  const skus = input.split(",").map((sku) => sku.trim());

  for (const sku of skus) {
    const product = pricing.find((item) => item.sku === sku);
    if (product) {
      checkout.scan(product);
      console.log(`Scanned: ${product.name} (SKU: ${sku}) | Price: $${product.price}`);
    } else {
      console.error(`Error: Invalid SKU '${sku}'. Please check the inventory.`);
    }
  }

  console.log(`\nTotal: $${checkout.total()}`);
  await mainMenu();
}

// Pricing rules menu
async function pricingRulesMenu(): Promise<void> {
  console.log("\n--- Manage Pricing Rules ---");
  console.log("1. Add a New Pricing Rule");
  console.log("2. Return to Main Menu");

  const option = await prompt("Select an option: ");
  switch (option) {
    case "1":
      await addPricingRule();
      break;
    case "2":
      await mainMenu();
      break;
    default:
      console.log("Invalid option.");
      await pricingRulesMenu();
  }
}

// Add a new pricing rule
async function addPricingRule(): Promise<void> {
    try {
      const id = await prompt("Enter rule ID: ");
      const productId = await prompt("Enter productId for which this rule applies: ");
      const offerRequirementUnits = await prompt("Enter the number of units required to avail discount: ");
      const multiplierRequired = await prompt("Enter true or false if multiples are required: ");
      const discountOnEach = await prompt(
        "Enter discount percentage per unit (e.g., for 35% discount, enter 0.35): "
      );
  
      const newRule: PricingRule = {
        id: Number.parseInt(id),
        productIds: [Number.parseInt(productId)],
        offerRequirementUnits: Number.parseInt(offerRequirementUnits),
        multiplierRequired: multiplierRequired.toLowerCase() === "true",
        discountOnEach: Number.parseFloat(discountOnEach),
        apply(cart: Product[]): number {
          const eligibleItems = cart.filter((item) => item.id === Number.parseInt(productId));
          const quantity = eligibleItems.length;
  
          if (quantity >= Number.parseInt(offerRequirementUnits)) {
            const applicableUnits = this.multiplierRequired
              ? Math.floor(quantity / this.offerRequirementUnits) * this.offerRequirementUnits
              : quantity;
            return applicableUnits * eligibleItems[0].price * this.discountOnEach;
          }
  
          return 0;
        },
      };
  
      // Add the rule to the system
      addPricingRules([newRule]);
      checkout.addPricingRules([newRule]);
  
      console.log("New pricing rule added successfully.");
      showPricingRules();
      await mainMenu();
    } catch (error: unknown) {
      console.error("Error adding pricing rule:", error);
      await pricingRulesMenu();
    }
  }

// Start the program
console.log("\n--- Welcome to the Computer Store Checkout System ---");
await mainMenu();
showInventory();
showPricingRules()