import { create } from "zustand";
import { persist, devtools} from 'zustand/middleware'
import AuthService from "@/service/auth.service";
import {AuthModelPayload} from "@/models";

interface AuthStoreModel {
    error: any;
    loading: boolean;
    token: string;
    login: (authData: AuthModelPayload) => Promise<void>;
    registration: (authData: AuthModelPayload) => Promise<void>;
    logout: () => Promise<void>;
    setAccessToken: (token: string) => void;
    deleteAccessToken: () => void;
}

const useAuthStore = create<AuthStoreModel>()(devtools(persist(
    (set) => ({
        token: '',
        loading: false,
        error: null,
        login: async (authData) => {
            set({ loading: true});

            try {
                const { accessToken } = await AuthService.login(authData);

                set({ token: accessToken})
            } catch (error) {
                set({ error })
            } finally {
                set({ loading: false})
            }
        },
        registration: async (authData) => {
            set({ loading: true});

            try {
                const { accessToken } = await AuthService.registration(authData);

                set({ token: accessToken})
            } catch (error) {
                set({ error })
            } finally {
                set({ loading: false})
            }
        },
        logout: async () => {
            set({ loading: true});

            try {
                await AuthService.logout();

                set({ token: ''})
            } catch (error) {
                set({ error })
            } finally {
                set({ loading: false})
            }
        },
        setAccessToken: (token) => {
            set({ token })
        },
        deleteAccessToken: () => {
            set({ token: '' })
        },
    }),
    {
        name: 'auth-storage',
    }
)));

export default useAuthStore;