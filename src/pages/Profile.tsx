import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { Mail, Shield, Calendar, Zap, Award } from "lucide-react";

const Profile = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/users/profile");
        setProfileData(data);
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (loading) return <Loader />;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };

  const getGradient = (role: string) => {
    return role === "student"
      ? "from-blue-600 to-cyan-600"
      : "from-purple-600 to-pink-600";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
          {/* Avatar */}
          <div
            className={`w-24 h-24 bg-linear-to-br ${getGradient(user?.role || 'student')} rounded-2xl flex items-center justify-center shrink-0 shadow-lg`}
          >
            <span className="text-white font-bold text-3xl">
              {getInitials(user?.name || "")}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {user?.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200/50">
                  <Award className="w-4 h-4" />
                  {user?.role === "student"
                    ? "Student"
                    : "Professional / Faculty"}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Member since {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {profileData?.posts?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {profileData?.posts?.reduce(
                (total: number, post: any) =>
                  total + (post.upvotes?.length || 0),
                0,
              ) || 0}
            </div>
            <div className="text-sm text-gray-600">Upvotes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">
              {profileData?.posts?.reduce(
                (total: number, post: any) =>
                  total + (post.comments?.length || 0),
                0,
              ) || 0}
            </div>
            <div className="text-sm text-gray-600">Comments</div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Your Posts</h2>
        </div>

        {profileData?.posts?.length > 0 ? (
          <div className="space-y-4">
            {profileData.posts.map((post: any, index: number) => (
              <div
                key={post._id}
                className="animate-fade-in"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <PostCard
                  post={post}
                  onDelete={(id) =>
                    setProfileData({
                      ...profileData,
                      posts: profileData.posts.filter((p: any) => p._id !== id),
                    })
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/50 backdrop-blur rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <p className="text-gray-600 font-medium">
              You haven't created any posts yet.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Share your first post to get started!
            </p>
          </div>
        )}
      </div>

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
  );
};

export default Profile;
