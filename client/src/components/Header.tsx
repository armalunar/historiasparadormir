import { Link } from "wouter";
import { Moon, Sun, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b backdrop-blur-lg bg-background/80"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center space-x-3 hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-all cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="text-3xl"
            >
              ✨
            </motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-lora bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Contos para Dormir
              </h1>
              <p className="text-xs text-muted-foreground font-poppins hidden sm:block">
                Histórias mágicas para sonhos encantados
              </p>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            data-testid="button-theme-toggle"
            className="rounded-full"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === "dark" ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </motion.div>
            <span className="sr-only">Alternar tema</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            data-testid="button-settings"
            className="rounded-full"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Configurações</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
