import { create } from "zustand";
import { persist, devtools} from 'zustand/middleware'
import {UserModel} from "@/models/user.model";
import { UserService } from '@/service';

interface UserStoreModel {
    error: any;
    loading: boolean;
    currentUserData: UserModel | null;
    getCurrentUser: () => Promise<void>;
}

const useUserStore = create<UserStoreModel>()(devtools(persist(
    (set) => ({
        loading: false,
        error: null,
        currentUserData: null,
        getCurrentUser: async () => {
            set({ loading: true});

            try {
                const user = await UserService.getCurrentUser();

                set({ currentUserData: user})
            } catch (error) {
                set({ error })
            } finally {
                set({ loading: false})
            }
        },
    }),
    {
        name: 'user-storage',
    }
)));

export default useUserStore;