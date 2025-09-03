import { EmojiPicker, type Emoji, } from "frimousse";
import Loader from "./Loader";


export default function SelectEmoji({ onEmojiSelect }: { onEmojiSelect: (emoji: Emoji) => void }) {
    return (
        <EmojiPicker.Root columns={8} onEmojiSelect={(emoji) => onEmojiSelect(emoji)}
            className="w-fit bg-white flex h-96 flex-col px-3 py-4 rounded-xl border border-neutral-200"
        >

            <EmojiPicker.Search
                name="search emoji"
                className="w-full bg-neutral-100 text-sm py-2 px-3 text-neutral-800 rounded-xl outline-none border border-neutral-200"
            />

            <EmojiPicker.Viewport style={{ scrollbarWidth: "thin", scrollbarColor: "#A4A4A4 transparent" }}>

                <EmojiPicker.Loading children={<Loader />} />

                <EmojiPicker.Empty className="h-full inset-0 flex items-center justify-center text-neutral-800 text-sm">
                    No emoji found.
                </EmojiPicker.Empty>

                <EmojiPicker.List
                    components={{
                        CategoryHeader: ({ category, ...props }) => (
                            <div
                                className="bg-white/10 px-2 py-2 font-medium text-neutral-600 text-xs"
                                {...props}
                            >
                                {category.label}
                            </div>
                        ),

                        Row: ({ children, ...props }) => (
                            <div {...props}>
                                {children}
                            </div>
                        ),
                        Emoji: ({ emoji, ...props }) => (
                            <button className="flex items-center justify-center p-1 text-xl data-[active]:bg-white/30 rounded cursor-pointer"
                                title={emoji.label}
                                {...props}
                            >
                                {emoji.emoji}
                            </button>
                        ),
                    }}
                />

            </EmojiPicker.Viewport>
        </EmojiPicker.Root>
    )
}