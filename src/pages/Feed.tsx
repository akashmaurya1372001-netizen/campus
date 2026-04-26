import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import { usePostStore } from "../store/postStore";
import toast from "react-hot-toast";
import { Sparkles, AlertCircle, HelpCircle, MessageSquare, Zap } from "lucide-react";

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const { posts, setPosts } = usePostStore();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/posts");
        setPosts((data));
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

  const filterOptions = [
    { value: "all", label: "All", icon: Sparkles },
    { value: "issue", label: "Issues", icon: AlertCircle },
    { value: "poll", label: "Polls", icon: Zap },
    { value: "discussion", label: "Discussions", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {/* <Sparkles className="w-8 h-8 text-blue-600" /> */}
              <h1 className="text-4xl font bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font">
                Campus Feed
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Connect, discuss, and share with your campus community</p>
          </div>

          {/* Enhanced Filter Buttons */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            {filterOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  filter === value
                    ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200 scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md hover:bg-blue-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

      {/* Posts Section */}
      {loading ? (
        <div className="flex justify-center items-center min-h-96">
          <Loader />
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 font-medium">
              <span className="text-blue-600 font-bold text-lg">{filteredPosts.length}</span> {filter === "all" ? "posts" : `${filter}s`}
            </p>
          </div>
          <div className="grid gap-4">
            {filteredPosts.map((post, index) => (
              <div
                key={post._id}
                className="animate-fade-in"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <PostCard
                  post={post}
                  onDelete={(id) => {
                    usePostStore.getState().deletePost(id);
                    toast.success("Post deleted");
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">📭</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No {filter !== "all" ? filter : ""} posts yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {filter === "all"
              ? "Be the first to share something with the campus! Start a discussion, ask a question, or create a poll."
              : `No ${filter}s found. Try a different filter or create one!`}
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
            <Sparkles className="w-4 h-4" />
            Create First Post
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default Feed;
