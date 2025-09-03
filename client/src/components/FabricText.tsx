import { Textbox } from "fabric";
import { useState, type CSSProperties } from "react"
import { Input } from "./Input";
import { Button } from "./Button";
import { useCanvas } from "../store/useCanvas";
import { FONT_WEIGHTS, Fonts } from "../lib/Constant";
import type { TextOptions } from "../types/TextOptions.type";
import { cn } from "../lib/utils";
import SelectEmoji from "./Emoji";
import { Slider } from "./Slider";


export default function FabricText() {
    const { canvas } = useCanvas();

    const [properties, setProperties] = useState<TextOptions>({
        text: "",
        fontFamily: "Inter",
        fontWeight: "400",
        fill: "#000000",
        backgroundColor: "",
        charSpacing: 0,
        underline: false,
        linethrough: false,
        fontStyle: "normal",
    });


    const handleChange = (key: string, value: unknown) => {
        setProperties((prev) => {
            const updated = { ...prev, [key]: value };

            if (canvas) {
                const activeObject = canvas.getActiveObject();

                if (activeObject && activeObject.type === "textbox") {
                    activeObject.set({ [key]: value });
                    canvas.requestRenderAll();
                }
            }

            return updated;
        });
    };


    const AddText = () => {
        if (canvas) {
            const txt = new Textbox(properties.text, { ...properties });

            canvas.add(txt);
            canvas.centerObject(txt);
            canvas.bringObjectForward(txt);
            canvas.setActiveObject(txt);
            canvas.requestRenderAll();
        }
        return;
    }


    return (
        <div className="relative flex flex-col gap-6">
            <div className="w-full flex gap-2 justify-between">
                <Input
                    name="text"
                    type="text"
                    placeholder="Add text here..."
                    className="text-sm bg-neutral-100"
                    value={properties.text}
                    onChange={(e) => handleChange("text", e.target.value)}
                />

                <button
                    className="text-sm font-medium px-3 py-1 bg-neutral-100 rounded-lg hover:bg-neutral-200"
                    onClick={AddText}
                >
                    Add
                </button>
            </div>

            <div className="flex gap-2 items-center">
                <select
                    name="font family"
                    id="font-family"
                    title="font family"
                    className="w-full p-2"
                    value={properties.fontFamily}
                    onChange={(e) => handleChange("fontFamily", e.target.value)}
                >
                    {Fonts.map((font) => (
                        <option
                            key={font}
                            value={font}
                            style={{ fontFamily: font }}
                        >
                            {font}
                        </option>
                    ))}
                </select>

                <label
                    title="font color"
                    htmlFor="font-color"
                >
                    <i className="ri-font-color text-xl bg-neutral-100 border border-[#EEE] cursor-pointer rounded-lg p-2" style={{ color: properties.fill }} />

                    <input
                        name="font color"
                        type="color"
                        id="font-color"
                        className="w-0 h-0 outline-none"
                        value={properties.fill || "#000000"}
                        onChange={(e) => handleChange("fill", e.target.value)}
                    />
                </label>

                <label
                    title="background color"
                    htmlFor="bg-color"
                >
                    <i className="ri-paint-fill text-xl bg-neutral-100 border border-[#EEE] cursor-pointer rounded-lg p-2" style={{ color: properties.backgroundColor }} />

                    <input
                        name="font color"
                        type="color"
                        id="bg-color"
                        className="w-0 h-0 outline-none"
                        value={properties.backgroundColor || "#000000"}
                        onChange={(e) => handleChange("backgroundColor", e.target.value)}
                    />
                </label>
            </div>

            <div className="relative flex gap-3 items-center">
                <div className="relative">
                    <Button popoverTarget="emoji" popoverTargetAction="toggle"
                        className="bg-neutral-100 border border-[#EEE] cursor-pointer rounded-lg px-2 py-1"
                        style={{ "--anchor-name": "--emoji-btn-anchor" } as CSSProperties}
                    >
                        <i className="ri-emoji-sticker-line text-xl" />
                    </Button>

                    <div popover="auto" id="emoji" className="bg-transparent"
                        style={{ "--anchor-name": "--emoji-btn-anchor" } as CSSProperties}
                    >
                        <SelectEmoji onEmojiSelect={(emoji) => handleChange("text", emoji.emoji)} />
                    </div>
                </div>

                <button
                    onClick={() => handleChange("underline", !properties.underline)}
                    className={cn("bg-neutral-100 border border-[#EEE] cursor-pointer rounded-lg px-2 py-1", { "bg-blue-100 text-blue-600 border-blue-600": properties.underline })}
                >
                    <i className="ri-underline text-xl" />
                </button>

                <button
                    onClick={() => handleChange("linethrough", !properties.linethrough)}
                    className={cn("bg-neutral-100 border border-[#EEE] cursor-pointer rounded-lg px-2 py-1", { "bg-blue-100 text-blue-600 border-blue-600": properties.linethrough })}
                >
                    <i className="ri-strikethrough text-xl" />
                </button>

                <button
                    onClick={() => handleChange(
                        "fontStyle",
                        properties.fontStyle === "normal" ? "italic" : "normal"
                    )}
                    className={cn("bg-neutral-100 border border-[#EEE] cursor-pointer rounded-lg px-2 py-1", { "bg-blue-100 text-blue-600 border-blue-600": properties.fontStyle === "italic" })}
                >
                    <i className="ri-italic text-xl" />
                </button>

                <select
                    name="font weight"
                    id="font-weight"
                    title="font weight"
                    className="w-full p-2"
                    value={properties.fontWeight}
                    onChange={(e) => handleChange("fontWeight", e.target.value)}
                >
                    {Object.entries(FONT_WEIGHTS).map(([label, value]) => (
                        <option
                            key={value}
                            value={value}
                            style={{ fontWeight: value }}
                        >
                            {label}
                        </option>
                    ))}
                </select>
            </div>


            <div className="relative flex flex-col gap-2">
                <label htmlFor="Character spacing" className="text-sm text-neutral-500 mb-1">
                    Character Spacing
                </label>
                <Slider
                    name="Character spacing"
                    min={0}
                    max={1000}
                    step={10}
                    id="Character spacing"
                    value={properties.charSpacing}
                    onChange={(e) => handleChange("charSpacing", parseInt(e.target.value))}
                    elements={{
                        progress: {
                            className: "bg-blue-600",
                            role: "progressbar"
                        },
                        root: {
                            className: "",
                        }
                    }}
                />
            </div>
        </div>
    )
}