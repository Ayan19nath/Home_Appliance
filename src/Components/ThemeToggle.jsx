import { useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { getTheme, setTheme } from "../data/theme";

// Mode after a click: light -> dark -> default (device) -> light
const NEXT = { light: "dark", dark: "system", system: "light" };

// [icon, name] of each mode
const INFO = {
  light: [Sun, "Light mode"],
  dark: [Moon, "Dark mode"],
  system: [Monitor, "Default mode (follows your device)"],
};

export default function ThemeToggle() {
  const [mode, setMode] = useState(getTheme);
  const [Icon, name] = INFO[mode];

  const change = () => {
    setTheme(NEXT[mode]);
    setMode(NEXT[mode]);
  };

  return (
    <button type="button" className="theme-toggle" onClick={change} title={`${name} - click to change`} aria-label={`${name}. Click to change`}>
      <Icon size={24} />
    </button>
  );
}