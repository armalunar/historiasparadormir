import { UserSettings, userSettingsSchema } from "@shared/schema";

const SETTINGS_KEY = "contos_user_settings";

export function loadSettings(): UserSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return userSettingsSchema.parse(JSON.parse(stored));
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }
  
  return userSettingsSchema.parse({});
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}
