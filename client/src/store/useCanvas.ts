import { create } from "zustand";
import { Canvas } from "fabric";
import { FINISHES, MATERIALS, MODELS } from "../lib/Constant";


type Option = {
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
}

type Model = {
    name: string;
    url: string;
    path: string;
    offsetX: number;
    offsetY: number;
}

type state = {
    canvas: Canvas | null;
    templateImage: string;
    uploadedImage: string;
    option: Option;
    data: string;
    models: Model[];
    model: Model | null;
}

interface action {
    setCanvas: (canvas: Canvas) => void;
    setTemplateImage: (name: string) => void;
    setUploadedImage: (url: string) => void;
    setData: (data: string) => void;
    setOption: <K extends keyof Option>(key: K, value: Option[K]) => void;
    getModels: () => Promise<void>;
    setModels: (name: string) => void;
}


export const useCanvas = create<state & action>((set, get) => ({
    canvas: null,
    templateImage: "",
    uploadedImage: "",
    data: "",
    option: {
        material: MATERIALS.options[0],
        finish: FINISHES.options[0],
    },
    models: [],
    model: MODELS[0],

    setCanvas: (canvas: Canvas) => set({ canvas: canvas }),
    setTemplateImage: (name: string) => set({ templateImage: name }),
    setUploadedImage: (url: string) => set({ uploadedImage: url }),
    setData: (data: string) => set({ data: data }),
    setOption: (key, value) => set((state) => ({
        option: { ...state.option, [key]: value },
    })),

    getModels: async () => {
        const data = MODELS;

        set({ models: data });
    },

    setModels: (name: string) => {
        const { models } = get();
        const model = models.find((m) => m.name === name) || null;

        set({ model: model });
    }
}))
