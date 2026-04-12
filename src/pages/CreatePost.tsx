import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Sparkles, Plus, Trash2 } from "lucide-react";

const CreatePost = () => {
  const [type, setType] = useState("issue");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();

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

      // If it's an issue, analyze sentiment
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">
          Create New Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Type
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label
                className={`flex-1 cursor-pointer border rounded-xl p-4 flex items-center justify-center gap-2 transition-all ${type === "issue" ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="type"
                  value="issue"
                  checked={type === "issue"}
                  onChange={() => setType("issue")}
                  className="hidden"
                />
                <span className="font-medium">Campus Issue</span>
              </label>
              <label
                className={`flex-1 cursor-pointer border rounded-xl p-4 flex items-center justify-center gap-2 transition-all ${type === "discussion" ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="type"
                  value="discussion"
                  checked={type === "discussion"}
                  onChange={() => setType("discussion")}
                  className="hidden"
                />
                <span className="font-medium">Discussion</span>
              </label>
              <label
                className={`flex-1 cursor-pointer border rounded-xl p-4 flex items-center justify-center gap-2 transition-all ${type === "poll" ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="type"
                  value="poll"
                  checked={type === "poll"}
                  onChange={() => setType("poll")}
                  className="hidden"
                />
                <span className="font-medium">Poll</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder={
                type === "issue"
                  ? "E.g., Library Wi-Fi is down again"
                  : type === "poll"
                    ? "E.g., What should be the theme for the spring fest?"
                    : "E.g., Let's talk about the new AI curriculum"
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              placeholder="Provide more details..."
            />
          </div>

          {type === "poll" && (
            <div className="space-y-3 bg-gray-50 p-5 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Poll Options
                </label>
                <button
                  type="button"
                  onClick={handleAIGeneratePoll}
                  disabled={aiLoading || !title}
                  className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Sparkles size={16} />
                  {aiLoading ? "Generating..." : "AI Generate Options"}
                </button>
              </div>

              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder={`Option ${index + 1}`}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}

              {options.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 mt-2"
                >
                  <Plus size={16} /> Add Option
                </button>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all shadow-md hover:shadow-lg"
            >
              {loading ? "Posting..." : "Post to Campus Pulse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
