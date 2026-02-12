import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Header } from "@/components/Header";
import { SettingsModal } from "@/components/SettingsModal";
import { MusicPlayer } from "@/components/MusicPlayer";
import { loadSettings, saveSettings } from "@/lib/settings";
import { checkAdminStatus } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import Home from "@/pages/Home";
import StoryReader from "@/pages/StoryReader";
import AdminPanel from "@/pages/AdminPanel";
import NotFound from "@/pages/not-found";
import type { UserSettings, Music } from "@shared/schema";

function AppContent() {
  const [settings, setSettings] = useState<UserSettings>(loadSettings());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    checkAdminStatus().then(setIsAdminUser);
  }, []);

  const { data: musicList } = useQuery<Music[]>({
    queryKey: ["/api/music"],
  });

  const currentMusic = musicList && musicList.length > 0 ? musicList[0] : null;

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleAdminLogin = () => {
    setIsAdminUser(true);
    setSettingsOpen(false);
    setLocation("/admin");
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        <ParticlesBackground enabled={settings.particlesEnabled} />
        
        <div className="relative z-10">
          <Header onSettingsClick={() => setSettingsOpen(true)} />
          
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/story/:id">
              {(params) => (
                <StoryReader
                  settings={{
                    font: settings.font,
                    textSize: settings.textSize,
                    theme: settings.theme,
                  }}
                  onSettingsClick={() => setSettingsOpen(true)}
                />
              )}
            </Route>
            {isAdminUser && <Route path="/admin" component={AdminPanel} />}
            <Route component={NotFound} />
          </Switch>
        </div>

        <SettingsModal
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          settings={settings}
          onSettingsChange={setSettings}
          onAdminLogin={handleAdminLogin}
        />

        <MusicPlayer music={currentMusic} enabled={settings.musicEnabled} />

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
