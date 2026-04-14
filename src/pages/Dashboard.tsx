import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import api from "../api/axios";
import Loader from "../components/Loader";
import { usePostStore } from "../store/postStore";
import {
  TrendingUp,
  MessageSquare,
  Zap,
  AlertCircle,
  BarChart3,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const { posts, setPosts } = usePostStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/posts");
        setPosts(data);
      } catch (error) {
        console.error("Failed to load posts for analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [setPosts]);

  if (loading) return <Loader />;

  // Calculate stats
  const issues = posts.filter((p) => p.type === "issue");
  const polls = posts.filter((p) => p.type === "poll");
  const discussions = posts.filter((p) => p.type === "discussion");
  const totalComments = posts.reduce(
    (sum, p) => sum + (p.comments?.length || 0),
    0,
  );
  const totalUpvotes = posts.reduce(
    (sum, p) => sum + (p.upvotes?.length || 0),
    0,
  );

  // Sentiment Data
  const sentimentCounts = {
    positive: issues.filter((i) => i.sentiment === "positive").length,
    neutral: issues.filter((i) => i.sentiment === "neutral" || !i.sentiment)
      .length,
    negative: issues.filter((i) => i.sentiment === "negative").length,
    urgent: issues.filter((i) => i.sentiment === "urgent").length,
  };

  const sentimentData = {
    labels: ["Positive", "Neutral", "Negative", "Urgent"],
    datasets: [
      {
        data: [
          sentimentCounts.positive,
          sentimentCounts.neutral,
          sentimentCounts.negative,
          sentimentCounts.urgent,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.9)", // green
          "rgba(156, 163, 175, 0.9)", // gray
          "rgba(249, 115, 22, 0.9)", // orange
          "rgba(239, 68, 68, 0.9)", // red
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(156, 163, 175, 1)",
          "rgba(249, 115, 22, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Top Polls Data
  const topPolls = [...polls]
    .map((poll) => {
      const totalVotes = poll.options.reduce(
        (acc: number, opt: any) => acc + opt.votes.length,
        0,
      );
      return { ...poll, totalVotes };
    })
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 5);

  const pollChartData = {
    labels: topPolls.map((p) =>
      p.title.length > 20 ? p.title.substring(0, 20) + "..." : p.title,
    ),
    datasets: [
      {
        label: "Total Votes",
        data: topPolls.map((p) => p.totalVotes),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderRadius: 8,
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      x: { grid: { display: false } },
    },
  };

  const stats = [
    {
      label: "Total Posts",
      value: posts.length,
      icon: BarChart3,
      color: "from-blue-600 to-blue-400",
      bg: "bg-blue-50",
    },
    {
      label: "Issues",
      value: issues.length,
      icon: AlertCircle,
      color: "from-red-600 to-orange-400",
      bg: "bg-red-50",
    },
    {
      label: "Discussions",
      value: discussions.length,
      icon: MessageSquare,
      color: "from-purple-600 to-pink-400",
      bg: "bg-purple-50",
    },
    {
      label: "Polls",
      value: polls.length,
      icon: Zap,
      color: "from-yellow-600 to-amber-400",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Campus Analytics</h1>
        </div>
        <p className="text-gray-600">
          Real-time insights into campus community engagement
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group">
              <div
                className={`${stat.bg} rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg transition-all h-full backdrop-blur-xl`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p
                      className={`text-3xl font-bold bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 bg-linear-to-br ${stat.color} rounded-xl opacity-20 group-hover:opacity-30 transition-opacity`}
                  >
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              Total Upvotes
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalUpvotes}</p>
          <p className="text-xs text-gray-500 mt-2">
            Community support signals
          </p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              Total Comments
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalComments}</p>
          <p className="text-xs text-gray-500 mt-2">Active discussions</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              Avg. Engagement
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {posts.length > 0
              ? Math.round((totalComments + totalUpvotes) / posts.length)
              : 0}
          </p>
          <p className="text-xs text-gray-500 mt-2">Per post average</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Analysis */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Issue Sentiment Analysis
          </h2>
          {issues.length > 0 ? (
            <div className="h-80 flex justify-center">
              <Doughnut
                data={sentimentData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-center">
              <p className="text-gray-500">No issues reported yet</p>
            </div>
          )}
        </div>

        {/* Most Active Polls */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Most Active Polls
          </h2>
          {topPolls.length > 0 ? (
            <div className="h-80">
              <Bar data={pollChartData} options={barOptions} />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-center">
              <p className="text-gray-500">No polls created yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
