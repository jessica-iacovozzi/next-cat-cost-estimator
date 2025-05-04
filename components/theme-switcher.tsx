"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { VisuallyHidden } from "./ui/visually-hidden";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Escape key to close dropdown
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [open]);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;
  
  const getThemeLabel = () => {
    switch(theme) {
      case "light": return "Light theme";
      case "dark": return "Dark theme";
      default: return "System theme";
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          aria-label={`Toggle theme. Current theme: ${getThemeLabel()}`} 
          variant="ghost" 
          size={"sm"}
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls="theme-menu"
        >
          {theme === "light" ? (
            <>
              <Sun
                key="light"
                size={ICON_SIZE}
                className={"text-foreground"}
                aria-hidden="true"
                role="presentation"
              />
              <VisuallyHidden>Light theme enabled</VisuallyHidden>
            </>
          ) : theme === "dark" ? (
            <>
              <Moon
                key="dark"
                size={ICON_SIZE}
                className={"text-foreground"}
                aria-hidden="true"
                role="presentation"
              />
              <VisuallyHidden>Dark theme enabled</VisuallyHidden>
            </>
          ) : (
            <>
              <Laptop
                key="system"
                size={ICON_SIZE}
                className={"text-foreground"}
                aria-hidden="true"
                role="presentation"
              />
              <VisuallyHidden>System theme enabled</VisuallyHidden>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-content" 
        align="start"
        id="theme-menu"
        role="menu"
        aria-label="Available themes"
      >
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => {
            setTheme(e);
            // Announce theme change to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = `Theme changed to ${e === 'light' ? 'Light' : e === 'dark' ? 'Dark' : 'System'}`;
            document.body.appendChild(announcement);
            // Remove after announcement is read
            setTimeout(() => {
              document.body.removeChild(announcement);
            }, 1000);
          }}
        >
          <DropdownMenuRadioItem 
            className="flex gap-2" 
            value="light"
            role="menuitemradio"
            aria-checked={theme === "light"}
          >
            <Sun size={ICON_SIZE} className="text-foreground" aria-hidden="true" role="presentation" />
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem 
            className="flex gap-2" 
            value="dark"
            role="menuitemradio"
            aria-checked={theme === "dark"}
          >
            <Moon size={ICON_SIZE} className="text-foreground" aria-hidden="true" role="presentation" />
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem 
            className="flex gap-2" 
            value="system"
            role="menuitemradio"
            aria-checked={theme === "system"}
          >
            <Laptop size={ICON_SIZE} className="text-foreground" aria-hidden="true" role="presentation" />
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
