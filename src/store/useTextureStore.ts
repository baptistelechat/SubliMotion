import { create } from "zustand";

interface TextureState {
  textureUrl: string | null;
  setTexture: (url: string) => void;
  clearTexture: () => void;
}

export const useTextureStore = create<TextureState>((set, get) => ({
  textureUrl: null,
  setTexture: (url) => {
    const currentUrl = get().textureUrl;
    if (currentUrl && currentUrl.startsWith("blob:")) {
      URL.revokeObjectURL(currentUrl);
    }
    set({ textureUrl: url });
  },
  clearTexture: () => {
    const currentUrl = get().textureUrl;
    if (currentUrl && currentUrl.startsWith("blob:")) {
      URL.revokeObjectURL(currentUrl);
    }
    set({ textureUrl: null });
  },
}));
