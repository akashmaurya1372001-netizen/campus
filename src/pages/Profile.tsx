import React, { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { Mail, Shield } from "lucide-react";

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-blue-600 font-bold text-3xl">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-gray-600">
              <div className="flex items-center gap-1.5">
                <Mail size={16} />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-1.5 capitalize">
                <Shield size={16} />
                <span>{user?.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Posts</h2>
      {profileData?.posts?.length > 0 ? (
        <div className="space-y-6">
          {profileData.posts.map((post: any) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={(id) =>
                setProfileData({
                  ...profileData,
                  posts: profileData.posts.filter((p: any) => p._id !== id),
                })
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">You haven't created any posts yet.</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
