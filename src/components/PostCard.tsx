import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  ArrowBigUp,
  AlertTriangle,
  Trash2,
  Zap,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import PollOptions from "./PollOptions";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

interface PostCardProps {
  post: any;
  onDelete?: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isUpvoted = user ? post.upvotes?.includes(user._id) : false;

  const handleUpvote = async () => {
    if (!user) return toast.error("Please login to upvote");

    try {
      await api.post(`/posts/${post._id}/vote`);
    } catch {
      toast.error("Failed to upvote");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to comment");
    if (!commentText.trim()) return;

    try {
      const modRes = await api.post("/ai/moderate", { text: commentText });

      if (modRes.data.isToxic) {
        toast.error("Comment blocked: violates community guidelines");
        return;
      }

      await api.post(`/posts/${post._id}/comment`, { text: commentText });
      setCommentText("");
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${post._id}`);
      toast.success("Post deleted");
      onDelete?.(post._id);
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "issue":
        return <AlertTriangle size={16} />;
      case "poll":
        return <Zap size={16} />;
      case "discussion":
        return <HelpCircle size={16} />;
      default:
        return <MessageCircle size={16} />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "issue":
        return "bg-red-100 text-red-700";
      case "poll":
        return "bg-purple-100 text-purple-700";
      case "discussion":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="rounded-2xl p-6 shadow-sm border hover:shadow-lg transition-all">
      <div className="flex gap-4">
        {(post.type === "issue" || post.type === "discussion") && (
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleUpvote}
              className={`p-2 rounded-lg ${
                isUpvoted
                  ? "text-orange-500 bg-orange-100"
                  : "text-gray-400 hover:bg-gray-200"
              }`}
            >
              <ArrowBigUp size={22} />
            </button>

            <span className="text-sm font-bold">
              {post.upvotes?.length || 0}
            </span>
          </div>
        )}

        <div className="flex-1">
          {/* header */}
          <div className="flex justify-between mb-2">
            <div
              className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 ${getTypeStyles(
                post.type
              )}`}
            >
              {getTypeIcon(post.type)}
              {post.type}
            </div>

            {user?._id === post.user?._id && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* meta */}
          <div className="text-sm text-gray-500 mb-2">
            {post.user?.name} •{" "}
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
          </div>

          {/* title */}
          <h3 className="font-bold text-lg mb-2">{post.title}</h3>

          {/* content */}
          <p className="text-gray-700 whitespace-pre-wrap mb-4">
            {post.content}
          </p>

          {/* poll */}
          {post.type === "poll" && <PollOptions post={post} />}

          {/* actions */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <MessageSquare size={16} />
            {post.comments?.length || 0} comments
          </button>

          {/* comments */}
          {showComments && (
            <div className="mt-4">
              <form onSubmit={handleComment} className="flex gap-2 mb-3">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add comment..."
                  className="flex-1 border rounded-lg px-3 py-2"
                />
                <button className="bg-blue-600 text-white px-4 rounded-lg">
                  Post
                </button>
              </form>

              {post.comments?.map((c: any) => (
                <div key={c._id} className="mb-2">
                  <div className="text-sm font-semibold">
                    {c.user?.name}
                  </div>
                  <div className="text-sm text-gray-600">{c.text}</div>
                </div>
              ))}

              {post.comments?.length === 0 && (
                <p className="text-sm text-gray-500">
                  No comments yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl">
            <h3 className="font-bold mb-2">Delete Post?</h3>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  handleDelete();
                }}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;