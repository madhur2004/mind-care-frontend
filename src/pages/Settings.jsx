import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Moon,
  Sun,
  Trash2,
  Download,
  Type,
} from "lucide-react";
import { toast } from "react-toastify";
import { settingsAPI } from "../utils/api";

export default function Settings({ theme, onThemeToggle }) {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    privacyMode: false,
    dataSaving: false,
    theme: "light",
    fontSize: "medium",
    fontStyle: "inter",
  });
  const [loading, setLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // ✅ Font options with proper CSS classes
  const fontOptions = [
    { value: "inter", label: "Inter", className: "font-inter" },
    { value: "roboto", label: "Roboto", className: "font-roboto" },
    { value: "open-sans", label: "Open Sans", className: "font-open-sans" },
    { value: "poppins", label: "Poppins", className: "font-poppins" },
    { value: "montserrat", label: "Montserrat", className: "font-montserrat" },
    { value: "lora", label: "Lora", className: "font-lora" },
  ];

  // ✅ Font size mappings
  const fontSizeMap = {
    small: "14px",
    medium: "16px",
    large: "18px",
    "x-large": "20px",
  };

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();

    // ✅ Apply default font settings immediately on mount
    const defaultFontSettings = {
      fontSize: "medium",
      fontStyle: "inter",
    };
    applyFontSettings(defaultFontSettings);
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      if (response.data) {
        setSettings(response.data);
        // ✅ Apply saved settings immediately
        applyFontSettings(response.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    }
  };

  // ✅ Function to apply font settings
  // ✅ IMPROVED: Function to apply font settings
  const applyFontSettings = (settings) => {
    console.log("🎨 Applying font settings:", settings);

    // Apply font size
    if (settings.fontSize && fontSizeMap[settings.fontSize]) {
      const fontSize = fontSizeMap[settings.fontSize];
      document.documentElement.style.setProperty("--base-font-size", fontSize);
      document.documentElement.style.fontSize = fontSize;
      console.log("✅ Font size applied:", settings.fontSize, fontSize);
    }

    if (
      settings.fontStyle &&
      fontOptions.some((f) => f.value === settings.fontStyle)
    ) {
      const selectedFont = fontOptions.find(
        (font) => font.value === settings.fontStyle
      );
      // Remove all font classes first
      fontOptions.forEach((font) => {
        document.documentElement.classList.remove(font.className);
      });
      // Add selected font class
      document.documentElement.classList.add(selectedFont.className);
      console.log(
        "✅ Font style applied:",
        settings.fontStyle,
        selectedFont.className
      );

      // Force re-render of all text elements
      document.body.style.display = "none";
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = "";
    }

    // Apply font family - IMPORTANT FIX
    if (settings.fontStyle) {
      const selectedFont = fontOptions.find(
        (font) => font.value === settings.fontStyle
      );
      if (selectedFont) {
        // Remove all font classes first
        fontOptions.forEach((font) => {
          document.documentElement.classList.remove(font.className);
        });

        // Add selected font class with a small delay to ensure DOM update
        setTimeout(() => {
          document.documentElement.classList.add(selectedFont.className);
          console.log(
            "✅ Font style applied:",
            settings.fontStyle,
            selectedFont.className
          );

          // Force re-render of all text elements
          document.body.style.display = "none";
          document.body.offsetHeight; // Trigger reflow
          document.body.style.display = "";
        }, 100);
      }
    }
  };

  const handleSettingChange = async (key, value) => {
    const previousSettings = { ...settings };

    // Optimistic update
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    // ✅ Immediately apply font-related changes
    if (key === "fontSize" || key === "fontStyle") {
      applyFontSettings({ ...settings, [key]: value });
    }

    try {
      const response = await settingsAPI.updateSettings({ [key]: value });
      const updatedSettings = response.data;
      setSettings(updatedSettings);

      // ✅ Re-apply settings from server response
      applyFontSettings(updatedSettings);

      toast.success("Setting updated successfully");
    } catch (error) {
      console.error("Error updating setting:", error);
      // Revert to previous settings on error
      setSettings(previousSettings);
      // ✅ Revert font changes on error
      applyFontSettings(previousSettings);
      toast.error("Failed to update setting");
    }
  };

  const exportData = async () => {
    setLoading(true);
    try {
      const response = await settingsAPI.exportData();

      // Create blob and download
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `mental-wellness-data-${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (deleteConfirmation !== "DELETE_MY_ACCOUNT") {
      toast.error('Please type "DELETE_MY_ACCOUNT" to confirm');
      return;
    }

    if (
      !window.confirm(
        "Are you absolutely sure? This will permanently delete your account, all journal entries, mood data, and therapy sessions. This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await settingsAPI.deleteAccount(deleteConfirmation);
      toast.success("Account deleted successfully");

      // Clear local storage and redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.response?.data?.error || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    onThemeToggle(newTheme);
    await handleSettingChange("theme", newTheme);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Customize your Mental Wellness experience</p>
      </div>

      <div className="settings-sections">
        {/* Appearance Settings */}
        <div className="mental-card">
          <h3 className="settings-section-title">
            <SettingsIcon size={20} />
            Appearance
          </h3>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Theme</h4>
              <p>Choose between light and dark mode</p>
            </div>
            <button
              className="mental-btn mental-btn-secondary"
              onClick={handleThemeToggle}
              disabled={loading}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
          </div>

          {/* ✅ UPDATED: Functional Font Size */}
          <div className="setting-item">
            <div className="setting-info">
              <h4>Font Size</h4>
              <p>Adjust text size for better readability</p>
              <small className="text-muted">
                Current: {settings.fontSize} ({fontSizeMap[settings.fontSize]})
              </small>
            </div>
            <select
              className="mental-select"
              value={settings.fontSize}
              onChange={(e) => handleSettingChange("fontSize", e.target.value)}
              disabled={loading}
            >
              <option value="small">Small (14px)</option>
              <option value="medium">Medium (16px)</option>
              <option value="large">Large (18px)</option>
              <option value="x-large">Extra Large (20px)</option>
            </select>
          </div>

          {/* ✅ NEW: Font Style */}
          <div className="setting-item">
            <div className="setting-info">
              <h4>Font Style</h4>
              <p>Choose your preferred font family</p>
              <small className="text-muted">
                Current:{" "}
                {fontOptions.find((f) => f.value === settings.fontStyle)?.label}
              </small>
            </div>
            <select
              className="mental-select"
              value={settings.fontStyle}
              onChange={(e) => handleSettingChange("fontStyle", e.target.value)}
              disabled={loading}
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mental-card">
          <h3 className="settings-section-title">
            <Bell size={20} />
            Notifications
          </h3>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Push Notifications</h4>
              <p>Receive reminders and updates</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) =>
                  handleSettingChange("notifications", e.target.checked)
                }
                disabled={loading}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Email Updates</h4>
              <p>Get weekly progress reports</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.emailUpdates}
                onChange={(e) =>
                  handleSettingChange("emailUpdates", e.target.checked)
                }
                disabled={loading}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="mental-card">
          <h3 className="settings-section-title">
            <Shield size={20} />
            Privacy & Security
          </h3>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Privacy Mode</h4>
              <p>Hide sensitive content in screenshots</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.privacyMode}
                onChange={(e) =>
                  handleSettingChange("privacyMode", e.target.checked)
                }
                disabled={loading}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Data Saving</h4>
              <p>Reduce data usage</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.dataSaving}
                onChange={(e) =>
                  handleSettingChange("dataSaving", e.target.checked)
                }
                disabled={loading}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Data Management */}
        <div className="mental-card">
          <h3 className="settings-section-title">
            <Download size={20} />
            Data Management
          </h3>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Export Data</h4>
              <p>Download your journal entries and progress data</p>
            </div>
            <button
              className="mental-btn mental-btn-secondary"
              onClick={exportData}
              disabled={loading}
            >
              <Download size={16} />
              {loading ? "Exporting..." : "Export Data"}
            </button>
          </div>

          <div className="setting-item danger-zone">
            <div className="setting-info">
              <h4>Delete Account</h4>
              <p>Permanently delete your account and all data</p>
              <div className="delete-confirmation">
                <input
                  type="text"
                  placeholder='Type "DELETE_MY_ACCOUNT" to confirm'
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="mental-input"
                />
              </div>
            </div>
            <button
              className="mental-btn mental-btn-danger"
              onClick={deleteAccount}
              disabled={loading || deleteConfirmation !== "DELETE_MY_ACCOUNT"}
            >
              <Trash2 size={16} />
              {loading ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
