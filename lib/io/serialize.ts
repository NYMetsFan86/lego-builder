import { SceneState } from "@/store/useBuilderStore";

const LS_KEY = "lego-builder-scene";

export function saveToLocalStorage(scene: SceneState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(scene));
}
export function loadFromLocalStorage(): SceneState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LS_KEY);
  return raw ? JSON.parse(raw) as SceneState : null;
}