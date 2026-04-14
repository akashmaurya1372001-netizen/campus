import React from "react";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";

interface PollOptionsProps {
  post: any;
}

const PollOptions: React.FC<PollOptionsProps> = ({ post }) => {
  const { user } = useAuthStore();

  const totalVotes = post.options.reduce(
    (acc: number, option: any) => acc + option.votes.length,
    0,
  );

  const hasVoted = user
    ? post.options.some((opt: any) => opt.votes.includes(user._id))
    : false;

  const handleVote = async (optionId: string) => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }
    if (hasVoted) {
      toast.error("You have already voted");
      return;
    }

    try {
      await api.post(`/posts/${post._id}/vote`, { optionId });
      toast.success("Vote recorded!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to vote");
    }
  };

  return (
    <div className="mt-5 space-y-3">
      {post.options.map((option: any, index: number) => {
        const votes = option.votes.length;
        const percentage =
          totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
        const isUserVote = user && option.votes.includes(user._id);

        return (
          <div
            key={option._id}
            onClick={() => !hasVoted && handleVote(option._id)}
            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
              isUserVote
                ? "border-blue-500 bg-blue-50"
                : hasVoted
                  ? "border-gray-200 bg-gray-50 cursor-default"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
            }`}
          >
            {/* Progress bar background */}
            {hasVoted && (
              <div
                className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-100 to-purple-100 transition-all duration-700 ease-out"
                style={{ width: `${percentage}%` }}
              />
            )}

            {/* Content */}
            <div className="relative z-10 flex items-center justify-between p-4">
              <div className="flex items-center gap-3 flex-1">
                {isUserVote && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 animate-pulse" />
                )}
                <span
                  className={`font-medium text-sm sm:text-base ${
                    isUserVote ? "text-blue-900 font-semibold" : "text-gray-800"
                  }`}
                >
                  {option.text}
                </span>
              </div>
              {hasVoted && (
                <span className="text-sm font-bold text-blue-600 ml-3 shrink-0">
                  {percentage}%
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Vote count footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100">
        <span>{totalVotes} total votes</span>
        {hasVoted && (
          <span className="text-blue-600 font-medium flex items-center gap-1">
            ✓ You voted
          </span>
        )}
      </div>
    </div>
  );
};

export default PollOptions;
