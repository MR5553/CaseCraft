export const PRODUCT_PRICES = {
    material: {
        silicone: 0,
        polycarbonate: 100,
    },
    finish: {
        smooth: 0,
        textured: 60,
    },
} as const;

export const BASE_PRICE = 99;

export const MATERIALS = {
    name: "material",
    options: [
        {
            label: "Silicone",
            value: "silicone",
            description: "Flexible, durable, and shock-absorbent",
            price: PRODUCT_PRICES.material.silicone,
        },
        {
            label: "Soft Polycarbonate",
            value: "polycarbonate",
            description: "Scratch-resistant coating",
            price: PRODUCT_PRICES.material.polycarbonate,
        },
    ],
} as const;

export const FINISHES = {
    name: "finish",
    options: [
        {
            label: "Smooth Finish",
            value: "smooth",
            description: "Classic smooth touch finish",
            price: PRODUCT_PRICES.finish.smooth,
        },
        {
            label: "Textured Finish",
            value: "textured",
            description: "Soft grippy texture",
            price: PRODUCT_PRICES.finish.textured,
        },
    ],
} as const;


export type MaterialType = keyof typeof PRODUCT_PRICES.material;
export type FinishType = keyof typeof PRODUCT_PRICES.finish;

export interface CaseConfig {
    material: MaterialType;
    finish: FinishType;
}


export function calculatePrice(config: CaseConfig): number {
    let price = BASE_PRICE;
    price += PRODUCT_PRICES.material[config.material];
    price += PRODUCT_PRICES.finish[config.finish];
    return price;
}
