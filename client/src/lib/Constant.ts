export const avatars = [
    { src: "/users/user-1.png", alt: "user image" },
    { src: "/users/user-2.png", alt: "user image" },
    { src: "/users/user-3.png", alt: "user image" },
    { src: "/users/user-4.jpg", alt: "user image" },
    { src: "/users/user-5.jpg", alt: "user image" },
];

export const Fonts = [
    "Inter",
    "Arial, sans-serif",
    "Verdana, sans-serif",
    "Tahoma, sans-serif",
    "Trebuchet MS, sans-serif",
    "Gill Sans, sans-serif",
    "Times New Roman, serif",
    "Georgia, serif",
    "Garamond, serif",
    "Palatino, serif",
    "Baskerville, serif",
    "Courier New, monospace",
    "Lucida Console, monospace",
    "Monaco, monospace",
    "Consolas, monospace",
    "Impact, sans-serif",
    "Comic Sans MS, cursive",
    "Brush Script MT, cursive",
    "Copperplate, serif",
    "Didot, serif",
    "Futura, sans-serif",
];

export const FONT_WEIGHTS: Record<string, number> = {
    "Thin": 100,
    "Extra Light": 200,
    "Light": 300,
    "Regular": 400,
    "Medium": 500,
    "Semi Bold": 600,
    "Bold": 700,
    "Extra Bold": 800,
    "Black": 900
};


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


export const Countries = {
    India: {
        "Andhra Pradesh": [],
        "Arunachal Pradesh": [],
        "Assam": [],
        "Bihar": [],
        "Chhattisgarh": [],
        "Goa": [],
        "Gujarat": [],
        "Haryana": [],
        "Himachal Pradesh": [],
        "Jharkhand": [],
        "Karnataka": [],
        "Kerala": [],
        "Madhya Pradesh": [],
        "Maharashtra": [],
        "Manipur": [],
        "Meghalaya": [],
        "Mizoram": [],
        "Nagaland": [],
        "Odisha": [],
        "Punjab": [],
        "Rajasthan": [],
        "Sikkim": [],
        "Tamil Nadu": [],
        "Telangana": [],
        "Tripura": [],
        "Uttar Pradesh": [],
        "Uttarakhand": [],
        "West Bengal": [],
        "Andaman and Nicobar Islands": [],
        "Chandigarh": [],
        "Dadra and Nagar Haveli and Daman & Diu": [],
        "Delhi (National Capital Territory)": [],
        "Jammu & Kashmir": [],
        "Ladakh": [],
        "Lakshadweep": [],
        "Puducherry": [],
    },
};