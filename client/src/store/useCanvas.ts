import { create } from "zustand";
import { Canvas } from "fabric";
import { FINISHES, MATERIALS } from "../lib/Constant";
import { api } from "../lib/axios";
import type { AxiosError } from "axios";
import type { apiError } from "../types/res.types";
import { toast } from "sonner";
import type { Model } from "../types/types";


type Option = {
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
}

type state = {
    canvas: Canvas | null;
    modelImage: string;
    uploadedImage: string;
    option: Option;
    data: string;
    models: Model[];
    model: Model | null;
}

interface action {
    setCanvas: (canvas: Canvas) => void;
    setModelImage: (name: string) => void;
    setUploadedImage: (url: string) => void;
    setData: (data: string) => void;
    setOption: <K extends keyof Option>(key: K, value: Option[K]) => void;
    getAllModels: () => void;
    setModel: (id: string) => void;
}


export const useCanvas = create<state & action>((set) => ({
    canvas: null,
    modelImage: "",
    uploadedImage: "",
    data: "",
    option: {
        material: MATERIALS.options[0],
        finish: FINISHES.options[0],
    },
    models: [],
    model: null,

    setCanvas: (canvas: Canvas) => set({ canvas: canvas }),
    setModelImage: (name: string) => set({ modelImage: name }),
    setUploadedImage: (url: string) => set({ uploadedImage: url }),
    setData: (data: string) => set({ data: data }),
    setOption: (key, value) => set((state) => ({
        option: { ...state.option, [key]: value },
    })),

    getAllModels: async () => {
        try {
            const { data } = await api.post(`api/model/getAllModels`);

            if (data.success) {
                set({ models: data.models });
            }

        } catch (error: unknown) {
            const err = error as AxiosError<apiError>;
            toast.error(err.response?.data.message)
        }
    },

    setModel: (id: string) => {
        set((state) => {
            const model = state.models.find((m) => m._id === id) || null;
            return { model: model };
        });
    },
}))
