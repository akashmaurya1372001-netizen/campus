import { create } from 'zustand';

interface PostState {
  posts: any[];
  setPosts: (posts: any[]) => void;
  addPost: (post: any) => void;
  updatePost: (updatedPost: any) => void;
  deletePost: (postId: string) => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (updatedPost) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      ),
    })),
  deletePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post._id !== postId),
    })),
}));
