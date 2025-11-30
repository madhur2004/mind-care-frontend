// Service Worker Registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered:', registration);
      
      // Check for background sync support
      if ('sync' in registration) {
        console.log('✅ Background Sync supported');
      } else {
        console.log('❌ Background Sync not supported');
      }
      
      return registration;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      return null;
    }
  }
  console.log('❌ Service Worker not supported');
  return null;
};

// Request Notification Permission
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("❌ This browser does not support notifications");
    return false;
  }

  try {
    // Register service worker first
    const registration = await registerServiceWorker();
    
    if (Notification.permission === "granted") {
      console.log("✅ Notifications already granted");
      return true;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      console.log("✅ Notification permission granted");
      
      // Register background sync if available
      if (registration && 'sync' in registration) {
        try {
          await registration.sync.register('daily-reminder');
          console.log('✅ Background sync registered');
        } catch (syncError) {
          console.error('❌ Background sync failed:', syncError);
        }
      }
      
      return true;
    } else {
      console.log("❌ Notification permission denied");
      return false;
    }
  } catch (error) {
    console.error("❌ Error requesting notification permission:", error);
    return false;
  }
};

// Show Notification
export const showNotification = (title, options = {}) => {
  if (Notification.permission !== "granted") {
    console.log("❌ Cannot show notification - permission not granted");
    return null;
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const notificationOptions = {
    icon: "/images/icon-192x192.png",
    badge: "/images/icon-72x72.png",
    ...options
  };

  // Add mobile-specific options
  if (isMobile) {
    notificationOptions.vibrate = [200, 100, 200];
    notificationOptions.requireInteraction = true;
  }

  const notification = new Notification(title, notificationOptions);

  // Handle notification click
  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  return notification;
};

// Schedule Daily Reminder
export const scheduleDailyReminder = async () => {
  try {
    // Get user settings
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    if (!settings.notifications) {
      console.log('🔕 Notifications disabled in settings');
      return;
    }

    console.log('⏰ Scheduling daily reminder...');

    // For PWA with background sync, we rely on the service worker
    // For non-PWA, we use traditional setTimeout (only works when tab is open)
    
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      console.log('📱 Using background sync for reminders');
      // Background sync will handle the reminders
      return;
    }

    // Fallback: Traditional scheduling (requires tab to be open)
    console.log('💻 Using traditional scheduling (requires tab open)');
    
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(9, 0, 0, 0); // 9 AM

    // If it's already past 9 AM, schedule for next day
    if (now > reminderTime) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    console.log(`⏰ Next reminder in ${Math.round(timeUntilReminder / 1000 / 60)} minutes`);

    setTimeout(() => {
      showNotification("🧠 Mental Wellness Reminder", {
        body: "Don't forget to log your mood and journal today! 📝",
        tag: "daily-reminder"
      });
      
      // Schedule next reminder
      scheduleDailyReminder();
    }, timeUntilReminder);

  } catch (error) {
    console.error('❌ Error scheduling reminder:', error);
  }
};

// Initialize notifications
export const initializeNotifications = async () => {
  try {
    const permissionGranted = await requestNotificationPermission();
    
    if (permissionGranted) {
      await scheduleDailyReminder();
      console.log('🎯 Notifications initialized successfully');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Failed to initialize notifications:', error);
    return false;
  }
};

// Install Prompt Handler
export const initializePWA = () => {
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    console.log('📲 PWA install prompt available');
    
    // Show your custom install button
    showInstallPromotion();
  });

  window.addEventListener('appinstalled', () => {
    console.log('🎉 PWA installed successfully');
    deferredPrompt = null;
    
    // Hide your install button
    hideInstallPromotion();
  });

  return deferredPrompt;
};

// Show install promotion
const showInstallPromotion = () => {
  // Create your custom install button
  const installButton = document.createElement('button');
  installButton.innerHTML = '📱 Install App';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #6366f1;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 20px;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  installButton.onclick = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      window.deferredPrompt = null;
    }
  };

  document.body.appendChild(installButton);
  window.installButton = installButton;
};

const hideInstallPromotion = () => {
  if (window.installButton) {
    window.installButton.remove();
  }
};