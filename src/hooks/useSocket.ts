import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { usePostStore } from "../store/postStore";

const getSocketUrl = () => {
  if (typeof window === "undefined") return "http://localhost:3000";
  const protocol = window.location.protocol === "https:" ? "https:" : "http:";
  return `${protocol}//${window.location.hostname}:${window.location.port || 3000}`;
};

export const useSocket = () => {
  const { addPost, updatePost, deletePost } = usePostStore();
  const socket = useMemo(() => io(getSocketUrl(), { reconnection: true }), []);

  useEffect(() => {
    socket.on("new_post", (post) => {
      addPost(post);
    });

    socket.on("update_post", (post) => {
      updatePost(post);
    });

    socket.on("delete_post", (postId) => {
      deletePost(postId);
    });

    return () => {
      socket.off("new_post");
      socket.off("update_post");
      socket.off("delete_post");
    };
  }, [socket, addPost, updatePost, deletePost]);

  return socket;
};
