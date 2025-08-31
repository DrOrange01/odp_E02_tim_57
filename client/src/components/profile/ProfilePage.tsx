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
  const [profile_pic, setProfilePic] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setPhoneNumber(user.phone_number || "");
      setProfilePic(user.profile_pic || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;

    setLoading(true);
    try {
      const updatedUser: User = await usersApi.updateProfile(token, {
        first_name,
        last_name,
        phone_number,
        profile_pic,
      });

      setUser({ ...user, ...updatedUser });

      setSuccessMessage("Profile updated successfully! Redirecting...");

      setTimeout(() => {
        if (updatedUser.uloga == "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
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
        <label>Profile Picture URL</label>
        <input
          type="text"
          value={profile_pic}
          onChange={(e) => setProfilePic(e.target.value)}
          className="w-full border p-2 rounded"
        />
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
