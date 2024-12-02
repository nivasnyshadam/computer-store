
Functionality

Inventory Management
 View Inventory:
The system provides a list of products available for purchase.

Pricing Rule Management
 Add Pricing Rule:
  Add a new discount rule dynamically during runtime.
 Replace Pricing Rules:
  Replace all existing pricing rules with a new set.

Checkout Process
  Scan Products:
   Add products to the cart by entering their SKU.
  Calculate Total:
   View the total price with applicable discounts.

In Scope
Each product can have specific discounts applied based on defined rules.
New pricing rules can be added, and existing ones can be updated or replaced during runtime.
Rules can apply to multiples of a product or based on a minimum quantity.

Out of Scope
Inventory and pricing rule IDs must be manually managed.
Discounts based on the total cart value are not implemented.
No resolution for overlapping discounts.
Discounts for grouped products are not supported.

Usage Steps
npm run start
Select “Checkout” from the menu.
Enter SKUs of products:
Enter SKUs separated by commas (e.g., 'ipd,mbp,atv'): ipd,ipd,atv
Total: $1009.98

Adding a Pricing Rule
Select “Manage Pricing Rules” from the menu

Follow the prompts to enter the new rule detail:
Rule ID: 2
Product ID: 3
Units Required: 2
Multiples Required: false
Discount: 0.15