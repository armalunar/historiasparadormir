import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SiteConfig } from "@shared/schema";

export function useSiteConfig() {
  const { data: config } = useQuery<SiteConfig>({
    queryKey: ["/api/site-config"],
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (config) {
      const root = document.documentElement;
      
      if (config.primaryColor) {
        root.style.setProperty("--primary", config.primaryColor);
      }
      if (config.accentColor) {
        root.style.setProperty("--accent", config.accentColor);
      }
      if (config.secondaryColor) {
        root.style.setProperty("--secondary", config.secondaryColor);
      }
      if (config.backgroundColor) {
        root.style.setProperty("--background", config.backgroundColor);
      }
      if (config.foregroundColor) {
        root.style.setProperty("--foreground", config.foregroundColor);
      }
    }
  }, [config]);

  return config;
}
