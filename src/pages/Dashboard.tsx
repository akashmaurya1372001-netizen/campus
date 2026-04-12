import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../api/axios';
import Loader from '../components/Loader';
import { usePostStore } from '../store/postStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const { posts, setPosts } = usePostStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts');
        setPosts(data);
      } catch (error) {
        console.error('Failed to load posts for analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [setPosts]);

  if (loading) return <Loader />;

  // Calculate stats
  const issues = posts.filter(p => p.type === 'issue');
  const polls = posts.filter(p => p.type === 'poll');
  const discussions = posts.filter(p => p.type === 'discussion');

  // Sentiment Data
  const sentimentCounts = {
    positive: issues.filter(i => i.sentiment === 'positive').length,
    neutral: issues.filter(i => i.sentiment === 'neutral' || !i.sentiment).length,
    negative: issues.filter(i => i.sentiment === 'negative').length,
    urgent: issues.filter(i => i.sentiment === 'urgent').length,
  };

  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative', 'Urgent'],
    datasets: [
      {
        data: [sentimentCounts.positive, sentimentCounts.neutral, sentimentCounts.negative, sentimentCounts.urgent],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // green
          'rgba(156, 163, 175, 0.8)', // gray
          'rgba(249, 115, 22, 0.8)', // orange
          'rgba(239, 68, 68, 0.8)',  // red
        ],
        borderWidth: 0,
      },
    ],
  };

  // Top Polls Data
  const topPolls = [...polls]
    .map(poll => {
      const totalVotes = poll.options.reduce((acc: number, opt: any) => acc + opt.votes.length, 0);
      return { ...poll, totalVotes };
    })
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 5);

  const pollChartData = {
    labels: topPolls.map(p => p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title),
    datasets: [
      {
        label: 'Total Votes',
        data: topPolls.map(p => p.totalVotes),
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500
        borderRadius: 6,
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
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Campus Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Posts</h3>
          <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Issues</h3>
          <p className="text-3xl font-bold text-orange-600">{issues.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Polls</h3>
          <p className="text-3xl font-bold text-blue-600">{polls.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Discussions</h3>
          <p className="text-3xl font-bold text-purple-600">{discussions.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Issue Sentiment Analysis</h2>
          <div className="h-64 flex justify-center">
            <Doughnut data={sentimentData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Most Active Polls</h2>
          <div className="h-64">
            <Bar data={pollChartData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
