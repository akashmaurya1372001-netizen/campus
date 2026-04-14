import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  ArrowBigUp,
  AlertTriangle,
  CheckCircle,
  Info,
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
    if (!user) {
      toast.error("Please login to upvote");
      return;
    }
    try {
      await api.post(`/posts/${post._id}/vote`);
    } catch (error: any) {
      toast.error("Failed to upvote");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    if (!commentText.trim()) return;

    try {
      // Moderate comment first
      const modRes = await api.post("/ai/moderate", { text: commentText });
      if (modRes.data.isToxic) {
        toast.error("Comment blocked: violates community guidelines");
        return;
      }

      await api.post(`/posts/${post._id}/comment`, { text: commentText });
      setCommentText("");
      toast.success("Comment added");
    } catch (error: any) {
      toast.error("Failed to add comment");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${post._id}`);
      toast.success("Post deleted");
      if (onDelete) {
        onDelete(post._id);
      }
    } catch (error: any) {
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
    const styles: {{`rounded-2xl p-6 shadow-sm border transition-all hover:shadow-lg hover:border-blue-200 ${typeStyles.bg} ${typeStyles.border}`}>
      <div className="flex items-start gap-4">
        {/* Upvote Section for Issues and Discussions */}
        {(post.type === "issue" || post.type === "discussion") && (
          <div className="flex flex-col items-center gap-1 pt-1">
            <button
              onClick={handleUpvote}
              className={`p-2 rounded-lg transition-all ${
                isUpvoted
                  ? "text-orange-500 bg-orange-100"
                  : "text-gray-400 hover:bg-gray-200"
              }`}
            >
              <ArrowBigUp
                size={24}
                className={isUpvoted ? "fill-current" : ""}
              />
            </button>
            <span
              className={`font-bold text-sm ${isUpvoted ? "text-orange-600" : "text-gray-600"}`}
            >
              {post.upvotes?.length || 0}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm ${typeStyles.text}`}>
                {getTypeIcon(post.type)}
                <span className="capitalize">{post.type}</span>
              </div>
              <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-semibold text-gray-700 capitalize">
                {post.user?.role}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {post.type === "issue" && post.sentiment && (
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600 border border-gray-200 capitalize">
                  {getSentimentIcon(post.sentiment)}
                  {post.sentiment}
                </div>
              )}
              {user && user._id === post.user?._id && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete post"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span className="font-semibold text-gray-900">
              {post.user?.name}
            </span>
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Title and Content */}
          <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
          <p className="text-gray-700 whitespace-pre-wrap mb-4 leading-relaxedd-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete post"
                >
                  <Trash2 size={16} />
                </button>
              )}
          {/* Actions */}
          <div className="mt-5 flex items-center gap-4 border-t border-gray-200/50 pt-4">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-white"
            >
              <MessageSquare size={18} />
              <span>{post.comments?.length || 0} Comments</span>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-5 bg-white rounded-xl p-4 border border-gray-200">
              <form onSubmit={handleComment} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:shadow-md disabled:opacity-50 transition-all"
                >
                  Post
                </button>
              </form>

              <div className="space-y-3">
                {post.comments?.map((comment: any) => (
                  <div key={comment._id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-purple-400 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-white font-bold text-xs">
                        {comment.user?.name?.charAt(0)}
                      </span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none px-4 py-2.5 flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {comment.user?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
                {post.comments?.length === 0 && (
                  <p className="text-center text-sm text-gray-500 py-3dAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
                {post.comments?.length === 0 && (
                  <p className="text-center text-sm text-gray-500 py-2">
                    No comments yet. Be the first!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-200 animate-scale-in">
            <div className="mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Post
              </h3>
              <p className="text-gray-600">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  handleDelete();
                }}
                className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PostCard;
