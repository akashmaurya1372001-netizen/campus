import { useState } from "react";
import { Camera } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function ProfilePhoto() {
    const { user } = useAuthStore();
  const [image, setImage] = useState<string | null>(null);
// const user: { name?: string } | null = null
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Profile Image */}
      <div className="w-32 h-32 rounded-full overflow-hidden border-2">
        {image ? (
          <img
            src={image}
            alt="profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div  >
           {getInitials(user?.name || "")}
          </div>
        )}
      </div>

      {/* Upload Button */}
      <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg">
        <Camera className="w-4 h-4 text-white" />

        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </label>
    </div>
  );
}