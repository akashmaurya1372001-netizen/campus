import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import { usePostStore } from "../store/postStore";
import toast from "react-hot-toast";

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const { posts, setPosts } = usePostStore();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/posts");
        setPosts(data);
      } catch (error) {
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [setPosts]);

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true;
    return post.type === filter;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Campus Feed
        </h1>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("issue")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === "issue"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Issues
          </button>
          <button
            onClick={() => setFilter("poll")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === "poll"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Polls
          </button>
          <button
            onClick={() => setFilter("discussion")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === "discussion"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Discussions
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={(id) => {
                // Also trigger local store update immediately for better UX
                usePostStore.getState().deletePost(id);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📭</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No posts yet
          </h3>
          <p className="text-gray-500">
            Be the first to share something with the campus!
          </p>
        </div>
      )}
    </div>
  );
};

export default Feed;
