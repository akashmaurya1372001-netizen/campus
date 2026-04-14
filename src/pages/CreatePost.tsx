import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  MessageCircle,
  Zap,
  Send,
} from "lucide-react";

const CreatePost = () => {
  const [type, setType] = useState("issue");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();

  const postTypes = [
    {
      value: "issue",
      label: "Campus Issue",
      icon: AlertCircle,
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
    },
    {
      value: "discussion",
      label: "Discussion",
      icon: MessageCircle,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      value: "poll",
      label: "Poll",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
  ];

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAIGeneratePoll = async () => {
    if (!title) {
      toast.error("Please enter a topic in the title first");
      return;
    }
    setAiLoading(true);
    try {
      const { data } = await api.post("/ai/generate-poll", { topic: title });
      if (data.options && data.options.length > 0) {
        setOptions(data.options);
        toast.success("AI generated poll options!");
      }
    } catch (error) {
      toast.error("Failed to generate options with AI");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let sentiment = "neutral";

      if (type === "issue") {
        try {
          const sentimentRes = await api.post("/ai/analyze", {
            text: `${title}. ${content}`,
          });
          sentiment = sentimentRes.data.sentiment;
        } catch (err) {
          console.error("Sentiment analysis failed, continuing without it");
        }
      }

      const postData = {
        type,
        title,
        content,
        options: type === "poll" ? options.filter((o) => o.trim() !== "") : [],
        sentiment,
      };

      await api.post("/posts", postData);
      toast.success("Post created successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const currentType = postTypes.find((t) => t.value === type)!;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 sm:p-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Post
            </h1>
          </div>
          <p className="text-gray-600">
            Share your thoughts with the campus community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Post Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              What would you like to share?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {postTypes.map((pt) => {
                const Icon = pt.icon;
                return (
                  <label
                    key={pt.value}
                    className={`relative cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                      type === pt.value
                        ? `border-blue-500 ${pt.bgColor} ring-2 ring-blue-500/20`
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={pt.value}
                      checked={type === pt.value}
                      onChange={() => setType(pt.value)}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{pt.label}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {type === "issue"
                ? "Issue Title"
                : type === "poll"
                  ? "Poll Question"
                  : "Discussion Topic"}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
              placeholder={
                type === "issue"
                  ? "E.g., Library Wi-Fi is down again"
                  : type === "poll"
                    ? "E.g., What should be the theme for the spring fest?"
                    : "E.g., Let's talk about the new AI curriculum"
              }
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/200</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none bg-gray-50/50"
              placeholder="Provide more details and context..."
            />
            <p className="text-xs text-gray-500 mt-1">{content.length}/1000</p>
          </div>

          {/* Poll Options */}
          {type === "poll" && (
            <div className="space-y-4 bg-linear-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200/50">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                  Poll Options
                </label>
                <button
                  type="button"
                  onClick={handleAIGeneratePoll}
                  disabled={aiLoading || !title}
                  className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 bg-white hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 border border-purple-200"
                >
                  <Sparkles size={16} />
                  {aiLoading ? "Generating..." : "AI Generate"}
                </button>
              </div>

              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="w-8 h-8 rounded-full bg-linear-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      required
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      maxLength={100}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white"
                      placeholder={`Option ${index + 1}`}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {options.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 mt-2 px-3 py-2 hover:bg-white rounded-lg transition-all"
                >
                  <Plus size={16} /> Add Option
                </button>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-linear-to-r from-blue-600 to-purple-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all"
            >
              {loading ? (
                <span>Posting...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Post to Campus Pulse</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
