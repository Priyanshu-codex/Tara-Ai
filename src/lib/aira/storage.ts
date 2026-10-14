import type { AiraMessage, AiraMissionContext } from "./types";

const STORAGE_KEY_CONV = "tara_aira_active_conversation";
const STORAGE_KEY_MESSAGES = "tara_aira_messages";

export function loadStoredAiraState(): {
  conversationId: string;
  messages: AiraMessage[];
  currentMission?: AiraMissionContext;
} {
  if (typeof window === "undefined") {
    return { conversationId: "default", messages: [] };
  }

  try {
    const convId = localStorage.getItem(STORAGE_KEY_CONV) || `conv-${Date.now()}`;
    const rawMsgs = localStorage.getItem(STORAGE_KEY_MESSAGES);
    const messages: AiraMessage[] = rawMsgs ? JSON.parse(rawMsgs) : [];
    return { conversationId: convId, messages };
  } catch {
    return { conversationId: "default", messages: [] };
  }
}

export function saveAiraState(conversationId: string, messages: AiraMessage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CONV, conversationId);
    // Keep last 30 messages in client storage to avoid storage bloat
    const trimmed = messages.slice(-30);
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(trimmed));
  } catch (err) {
    console.warn("Failed to persist Aira state:", err);
  }
}

export function clearStoredAiraState() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_CONV);
    localStorage.removeItem(STORAGE_KEY_MESSAGES);
  } catch (err) {
    console.warn("Failed to clear Aira state:", err);
  }
}
