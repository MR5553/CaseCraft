import type { FabricObject } from "fabric";


export declare module "fabric" {
    interface CanvasEvents {
        "history:append": { json: object };
        "history:undo": undefined;
        "history:redo": undefined;
        "history:clear": undefined;
    }

    interface Canvas {
        _initialize: () => void;
        _state: () => object;
        _events: () => Record<string, (e: { target: FabricObject }) => void>;
        _history: () => void;
        _action: (e?: { target: FabricObject }) => void;
        _loadHistory: (json: object, event: keyof CanvasEvents, callback?: () => void) => void;
        _dispose: () => void;
        _undo: (callback?: () => void) => void;
        _redo: (callback?: () => void) => void;
        _deleteObject: (targets: FabricObject[]) => void;
        _canUndo: () => boolean;
        _canRedo: () => boolean;
        _clearHistory: () => void;
        undoStack: object[];
        redoStack: object[]
        isProcessing: boolean;
        nextState: object;
        extra: ["selectable", "evented", "hasControls", "hasBorders", "objectCaching"]
    }
}

declare module "fabric" {
    interface Object {
        name?: string;
    }
}