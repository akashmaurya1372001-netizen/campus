import React from 'react';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface PollOptionsProps {
  post: any;
}

const PollOptions: React.FC<PollOptionsProps> = ({ post }) => {
  const { user } = useAuthStore();

  const totalVotes = post.options.reduce((acc: number, option: any) => acc + option.votes.length, 0);

  const hasVoted = user ? post.options.some((opt: any) => opt.votes.includes(user._id)) : false;

  const handleVote = async (optionId: string) => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }
    if (hasVoted) {
      toast.error('You have already voted');
      return;
    }

    try {
      await api.post(`/posts/${post._id}/vote`, { optionId });
      toast.success('Vote recorded!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to vote');
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {post.options.map((option: any) => {
        const votes = option.votes.length;
        const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
        const isUserVote = user && option.votes.includes(user._id);

        return (
          <div
            key={option._id}
            onClick={() => !hasVoted && handleVote(option._id)}
            className={`relative overflow-hidden border rounded-xl p-3 cursor-pointer transition-all ${
              hasVoted ? 'cursor-default' : 'hover:bg-gray-50 hover:border-blue-300'
            } ${isUserVote ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
          >
            {hasVoted && (
              <div
                className="absolute top-0 left-0 h-full bg-blue-100/50 transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            )}
            <div className="relative flex justify-between items-center z-10">
              <span className={`font-medium ${isUserVote ? 'text-blue-700' : 'text-gray-800'}`}>
                {option.text}
              </span>
              {hasVoted && (
                <span className="text-sm font-semibold text-gray-600">{percentage}%</span>
              )}
            </div>
          </div>
        );
      })}
      <div className="text-xs text-gray-500 mt-2 text-right">{totalVotes} votes</div>
    </div>
  );
};

export default PollOptions;
