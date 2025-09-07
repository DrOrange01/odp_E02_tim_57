 import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/auth/UseAuthHook";
import { usersApi } from "../../api_services/users/UsersAPIService";
import type { User } from "../../types/users/User";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const { token, user, setUser } = useAuth();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [profile_pic_file, setProfilePicFile] = useState<File | null>(null);
  const [profile_pic_url, setProfilePicUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const backendUrl = "http://localhost:4000";

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setPhoneNumber(user.phone_number || "");

      setProfilePicUrl(
        user.profile_pic
          ? `${backendUrl}/uploads/profile_pictures/${user.profile_pic}`
          : ""
      );
    }
  }, [user]);  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("first_name", first_name);
      formData.append("last_name", last_name);
      formData.append("phone_number", phone_number);
      if (profile_pic_file) {
        formData.append("profile_pic", profile_pic_file);
      }

      const updatedUser: User = await usersApi.updateProfile(token, formData);

      setUser({ ...user, ...updatedUser });
      setSuccessMessage("Profile updated successfully! Redirecting...");

      setTimeout(() => {
        navigate(
          updatedUser.uloga === "admin" ? "/admin-dashboard" : "/user-dashboard"
        );
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };  
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <div>
        <label>First Name</label>
        <input
          type="text"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label>Last Name</label>
        <input
          type="text"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label>Phone Number</label>
        <input
          type="text"
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label>Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setProfilePicFile(e.target.files[0]);
              setProfilePicUrl(URL.createObjectURL(e.target.files[0]));
            }
          }}
          className="w-full border p-2 rounded"
        />
        {profile_pic_url && (
          <img
            src={profile_pic_url}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded-full"
          />
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {successMessage && (
        <div className="text-green-600 font-semibold">{successMessage}</div>
      )}
    </form>
  );
}; 