import type { Rule } from "./types";

export const costingFormula: Rule[] = [
	{
		id: 1,
		productIds: [3],
		offerRequirementUnits: 3,
		multiplierRequired: true,
		discountOnEach: 0.3334,
	},
	{
		id: 2,
		productIds: [1],
		offerRequirementUnits: 3,
		multiplierRequired: false,
		discountOnEach: 0.0911,
	},
];