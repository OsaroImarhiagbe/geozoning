// store/mascotStore.ts
import { create } from 'zustand';



type tokenStore = {
  token:string | null
  tokenTrigger:(value:string) => void
  tokenClear:() => void
};

export const useTokenStore = create<tokenStore>((set) => ({
  token:'',
  tokenTrigger:(newState) => {
    set({ token: newState})
  },
  tokenClear: () => {set({token: null})}
}));