import { Canvas, FabricObject } from "fabric";

const originalToObject = FabricObject.prototype.toObject;
FabricObject.prototype.toObject = function (propertiesToInclude?: string[]) {
    const extraProps = ["selectable", "evented", "hasControls", "hasBorders"];
    return originalToObject.call(this, [
        ...(propertiesToInclude || []),
        ...extraProps,
    ]);
};

Canvas.prototype.initialize = (function (originalFn) {
    return function (this: Canvas, ...args) {
        if (originalFn) {
            originalFn.apply(this, args);
        }
        this._history();
        return this;
    };
})(Canvas.prototype.initialize);


Canvas.prototype.dispose = (function (originalFn) {
    return function (this: Canvas, ...args): Promise<boolean> {
        originalFn.apply(this, args);
        this._dispose();
        return Promise.resolve(true);
    };
})(Canvas.prototype.dispose);


Canvas.prototype._state = function () {
    return this.toDatalessJSON();
};


Canvas.prototype._events = function () {
    return {
        "object:added": (e) => this._action(e),
        "object:removed": (e) => this._action(e),
        "object:modified": (e) => this._action(e),
    };
};

Canvas.prototype._dispose = function () {
    if (this._boundEvents) {
        this.off(this._boundEvents);
    }
};


Canvas.prototype._history = function () {
    this.undoStack = [];
    this.redoStack = [];
    this.nextState = this._state();

    this._boundEvents = this._events();
    this.on(this._boundEvents);

    this.undoStack.push(this._state());
};


Canvas.prototype._action = function (e) {
    if (this.isProcessing) return;

    if (!e || (e.target && !e.target.excludeFromExport)) {
        const json = this.nextState;
        this.undoStack.push(json);
        this.nextState = this._state();
        this.fire("history:append", { json });
    }
};


Canvas.prototype._undo = function (callback) {
    if (this.undoStack.length <= 1) {
        this.isProcessing = false;
        return;
    }

    const currentState = this.undoStack.pop();
    if (currentState) {
        this.redoStack.push(this._state());
        this.nextState = currentState;
        this._loadHistory(currentState, "history:undo", callback);
    }
};


Canvas.prototype._redo = function (callback) {
    const currentState = this.redoStack.pop();
    if (currentState) {
        this.undoStack.push(this._state());
        this.nextState = currentState;
        this._loadHistory(currentState, "history:redo", callback);
    }
};

Canvas.prototype._deleteObject = function (targets: FabricObject[]) {
    if (!targets || targets.length === 0) return;

    this.undoStack.push(this._state());

    targets.forEach((obj) => this.remove(obj));
    this.discardActiveObject();
    this.requestRenderAll();

    this.nextState = this._state();
    this.fire("history:append", { json: this.nextState });
};


Canvas.prototype._loadHistory = function (json, event, callback) {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.loadFromJSON(json, () => {
        this.requestRenderAll();
        this.fire(event);
        this.isProcessing = false;

        if (callback && typeof callback === "function") callback();
    });
};


Canvas.prototype._clearHistory = function () {
    this.undoStack = [];
    this.redoStack = [];
    this.fire("history:clear");
};


Canvas.prototype._canUndo = function () {
    return this.undoStack.length > 1;
};
Canvas.prototype._canRedo = function () {
    return this.redoStack.length > 0;
};