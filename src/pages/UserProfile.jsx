import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Trash2,
} from "lucide-react";
import { profileAPI } from "../utils/api";
import { toast } from "react-toastify";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // UserProfile.js mein fetchUserProfile function ko update karo
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching user profile...");

      const response = await profileAPI.getProfile();
      console.log("✅ Profile API Response:", response.data);

      if (response.data) {
        setUser(response.data);
        setEditData(response.data);
        setImageError(false);

        // Local storage mein bhi name update karo
        if (response.data.name) {
          localStorage.setItem("userName", response.data.name);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);

      // Specific error handling
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        // Auto redirect ho jayega interceptor se
      } else {
        toast.error("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editData.name || editData.name.trim() === "") {
      toast.error("Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const response = await profileAPI.updateProfile({
        name: editData.name.trim(),
      });
      setUser(response.data.user);
      setIsEditing(false);
      // Update local storage name if needed
      localStorage.setItem("userName", response.data.user.name);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(user);
    setIsEditing(false);
    setImageError(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    setImageError(false);

    try {
      // Preview ke liye readAsDataURL use karo
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser((prev) => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await profileAPI.uploadAvatar(formData);
      setUser({ ...response.data.user });
      setEditData({ ...response.data.user });
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.response?.data?.error || "Failed to upload image");
      // Refresh profile data on error
      fetchUserProfile();
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const response = await profileAPI.removeAvatar();
      setUser((prev) => ({ ...prev, avatar: null }));
      setEditData((prev) => ({ ...prev, avatar: null }));
      setImageError(false);
      toast.success("Profile picture removed");
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast.error(
        error.response?.data?.error || "Failed to remove profile picture"
      );
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageError = (e) => {
    console.error("❌ Image failed to load:", user?.avatar);
    setImageError(true);
    e.target.style.display = "none";
  };

  const handleImageLoad = (e) => {
    console.log("✅ Image loaded successfully");
    setImageError(false);
    e.target.style.display = "block";
  };

  useEffect(() => {
    if (user?.avatar) {
      setImageError(false);
    }
  }, [user?.avatar]);

  // Loading state ko improve karo
  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Agar user data nahi mila to error show karo
  if (!user) {
    return (
      <div className="page-container">
        <div className="error-state">
          <h2>Unable to load profile</h2>
          <p>Please try refreshing the page or log in again.</p>
          <button
            className="mental-btn mental-btn-primary"
            onClick={fetchUserProfile}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>User Profile</h1>
        <p>Manage your personal information</p>
      </div>

      <div className={`mental-card ${isEditing ? "is-editing" : ""}`}>
        <div className="profile-header">
          <div className="avatar-section">
            <div className="avatar-container">
              {/* Avatar section */}
              <div className={`avatar-large ${isEditing ? "enlarged" : ""}`}>
                {user?.avatar && !imageError ? (
                  <img
                    key={user.avatar}
                    src={user.avatar}
                    alt="Profile"
                    className="avatar-image"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                  />
                ) : null}

                <div
                  className={`avatar-placeholder ${
                    user?.avatar && !imageError ? "hidden" : ""
                  }`}
                >
                  <User size={isEditing ? 50 : 40} />
                </div>
              </div>

              {isEditing && (
                <div className="avatar-actions-below">
                  <button
                    className="avatar-action-btn"
                    onClick={triggerFileInput}
                    disabled={uploading}
                    type="button"
                  >
                    <Camera size={16} />
                    {uploading ? "Uploading..." : "Change Photo"}
                  </button>
                  {user?.avatar && (
                    <button
                      className="avatar-action-btn remove"
                      onClick={handleRemoveAvatar}
                      type="button"
                      disabled={uploading}
                    >
                      <Trash2 size={16} />
                      Remove Photo
                    </button>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>

            <div className="avatar-info">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="mental-input name-input"
                  placeholder="Enter your name"
                />
              ) : (
                <h2>{user?.name}</h2>
              )}
              <p>
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button
                className="mental-btn mental-btn-secondary"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  className="mental-btn mental-btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  className="mental-btn mental-btn-secondary"
                  onClick={handleCancel}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <div className="detail-icon">
              <Mail size={20} />
            </div>
            <div className="detail-content">
              <label>Email Address</label>
              <p>{user?.email}</p>
              <small className="text-muted">Email cannot be changed</small>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Calendar size={20} />
            </div>
            <div className="detail-content">
              <label>Member Since</label>
              <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {user?.lastLogin && (
            <div className="detail-item">
              <div className="detail-icon">
                <Calendar size={20} />
              </div>
              <div className="detail-content">
                <label>Last Login</label>
                <p>{new Date(user.lastLogin).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="edit-notice">
            <p>
              💡 You can change your name and profile picture.
              {imageError &&
                " Note: There was an issue loading your profile picture."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
