import { useLayoutEffect, useState } from "react";

export function useTheme() {

    const getPreferredTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const initialTheme = () => {
        const getTheme = localStorage.getItem("theme");
        if (getTheme) return getTheme;

        const preferredTheme = getPreferredTheme();
        localStorage.setItem("theme", preferredTheme);
        return preferredTheme;
    };

    const [theme, setTheme] = useState(initialTheme());

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    useLayoutEffect(() => {
        document.documentElement.className = theme;
        document.documentElement.style.colorScheme = theme;
    }, [theme]);

    return { theme, setTheme, toggleTheme, };
}