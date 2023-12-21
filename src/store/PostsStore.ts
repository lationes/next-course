import { create } from "zustand";
import { persist, devtools} from 'zustand/middleware'

interface PostsStoreModel {
    error: any;
    loading: boolean;
    posts:
}

const usePostsStore = create<PostsStoreModel>()(devtools(persist(
    (set) => ({
        loading: false,
        error: null,
    }),
    {
        name: 'user-storage',
    }
)));

export default useUserStore;