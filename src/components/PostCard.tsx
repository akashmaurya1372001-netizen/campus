import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ArrowBigUp, AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react';
import PollOptions from './PollOptions';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: any;
  onDelete?: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isUpvoted = user ? post.upvotes?.includes(user._id) : false;

  const handleUpvote = async () => {
    if (!user) {
      toast.error('Please login to upvote');
      return;
    }
    try {
      await api.post(`/posts/${post._id}/vote`);
    } catch (error: any) {
      toast.error('Failed to upvote');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    if (!commentText.trim()) return;

    try {
      // Moderate comment first
      const modRes = await api.post('/ai/moderate', { text: commentText });
      if (modRes.data.isToxic) {
        toast.error('Comment blocked: violates community guidelines');
        return;
      }

      await api.post(`/posts/${post._id}/comment`, { text: commentText });
      setCommentText('');
      toast.success('Comment added');
    } catch (error: any) {
      toast.error('Failed to add comment');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${post._id}`);
      toast.success('Post deleted');
      if (onDelete) {
        onDelete(post._id);
      }
    } catch (error: any) {
      toast.error('Failed to delete post');
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'urgent':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'negative':
        return <Info size={16} className="text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        {/* Upvote Section for Issues and Discussions */}
        {(post.type === 'issue' || post.type === 'discussion') && (
          <div className="flex flex-col items-center gap-1 pt-1">
            <button
              onClick={handleUpvote}
              className={`p-1 rounded-md transition-colors ${
                isUpvoted ? 'text-orange-500 bg-orange-50' : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              <ArrowBigUp size={24} className={isUpvoted ? 'fill-current' : ''} />
            </button>
            <span className={`font-bold text-sm ${isUpvoted ? 'text-orange-600' : 'text-gray-600'}`}>
              {post.upvotes?.length || 0}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{post.user?.name}</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs capitalize">
                {post.user?.role}
              </span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
            <div className="flex items-center gap-2">
              {post.type === 'issue' && post.sentiment && (
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full text-xs font-medium text-gray-600 border border-gray-200 capitalize">
                  {getSentimentIcon(post.sentiment)}
                  {post.sentiment}
                </div>
              )}
              {user && user._id === post.user?._id && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete post"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
          <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>

          {post.type === 'poll' && <PollOptions post={post} />}

          <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              <MessageSquare size={18} />
              {post.comments?.length || 0} Comments
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 bg-gray-50 rounded-xl p-4">
              <form onSubmit={handleComment} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Post
                </button>
              </form>

              <div className="space-y-3">
                {post.comments?.map((comment: any) => (
                  <div key={comment._id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-xs">
                        {comment.user?.name?.charAt(0)}
                      </span>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-2 flex-1 shadow-sm">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {comment.user?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
                {post.comments?.length === 0 && (
                  <p className="text-center text-sm text-gray-500 py-2">No comments yet. Be the first!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Post</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  handleDelete();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
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
