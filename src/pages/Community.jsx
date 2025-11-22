import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share, Clock, User } from "lucide-react";

export default function Community({ userName }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem("communityPosts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Default posts agar koi saved data nahi hai
      const defaultPosts = [
        {
          id: 1,
          author: "Sarah",
          content:
            "Meditation really helped me today! I felt so calm and centered after my session. Anyone else tried the 10-minute morning meditation?",
          likes: 15,
          timestamp: "2 hours ago",
          category: "meditation",
          userAvatar: "👩",
          liked: false,
        },
        {
          id: 2,
          author: "Mike",
          content:
            "Journaling before bed has improved my sleep quality significantly. Highly recommend writing down 3 things you're grateful for each night!",
          likes: 23,
          timestamp: "5 hours ago",
          category: "journaling",
          userAvatar: "👨",
          liked: true,
        },
        {
          id: 3,
          author: "Priya",
          content:
            "Just completed my 30-day breathing exercise streak! Feeling more mindful and present throughout the day. Consistency is key! 💨",
          likes: 42,
          timestamp: "1 day ago",
          category: "breathing",
          userAvatar: "👩",
          liked: false,
        },
        {
          id: 4,
          author: "Alex",
          content:
            "Mood tracking helped me identify patterns in my emotional wellbeing. Found out I'm most productive on Tuesday mornings! 📊",
          likes: 18,
          timestamp: "2 days ago",
          category: "mood",
          userAvatar: "👨",
          liked: false,
        },
      ];
      setPosts(defaultPosts);
      localStorage.setItem("communityPosts", JSON.stringify(defaultPosts));
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("communityPosts", JSON.stringify(posts));
    }
  }, [posts]);

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        author: userName || "Anonymous",
        content: newPost,
        likes: 0,
        timestamp: "just now",
        category: "general",
        userAvatar: "👤",
        liked: false,
      };
      const updatedPosts = [post, ...posts];
      setPosts(updatedPosts);
      setNewPost("");
    }
  };

  const handleLike = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked,
          }
        : post
    );
    setPosts(updatedPosts);
  };

  return (
    <div className="community-page p-lg max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Wellness Community
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with others, share your journey, and find inspiration in our
          supportive community
        </p>
      </div>

      {/* Two Column Layout - Original Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Create Post */}
        <div className="space-y-6">
          {/* Create Post Card */}
          <div className="mental-card">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <User className="text-indigo-500" size={24} />
              Share Your Thoughts
            </h2>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0">
                {userName?.charAt(0) || "U"}
              </div>
              <div className="flex-1">
                <textarea
                  className="mental-textarea w-full resize-none"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your wellness journey, tips, or experiences..."
                  rows="4"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {newPost.length}/500 characters
              </div>
              <button
                onClick={handlePostSubmit}
                disabled={!newPost.trim() || newPost.length > 500}
                className={`mental-btn mental-btn-primary ${
                  !newPost.trim() || newPost.length > 500
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Post to Community
              </button>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 p-4  rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">
                💡 Posting Tips
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Share your personal experiences and journey</li>
                <li>• Ask questions to get community support</li>
                <li>• Be supportive and kind to others</li>
                <li>• Respect everyone's privacy</li>
              </ul>
            </div>
          </div>

          {/* Community Stats */}
          <div className="mental-card">
            <h3 className="text-xl font-semibold mb-4">Community Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4  rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {posts.length}
                </div>
                <div className="text-sm text-green-700">Total Posts</div>
              </div>
              <div className="text-center p-4  rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {posts.reduce((total, post) => total + post.likes, 0)}
                </div>
                <div className="text-sm text-blue-700">Total Likes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Posts Feed */}
        <div className="space-y-6">
          {/* Posts Header */}
          <div className="mental-card">
            <h2 className="text-2xl font-bold mb-2">Community Posts</h2>
            <p className="text-gray-600">
              Recent updates from our wellness community
            </p>
          </div>

          {/* Posts List */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="mental-card hover:shadow-md transition-shadow duration-300"
              >
                {/* Post Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10  from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {post.userAvatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {post.author}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1  text-indigo-700 rounded-full text-xs font-medium capitalize">
                    {post.category}
                  </span>
                </div>

                {/* Post Content */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {post.content}
                </p>

                {/* Post Actions */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 transition-all ${
                        post.liked
                          ? "text-red-500 transform scale-110"
                          : "text-gray-500 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        size={18}
                        fill={post.liked ? "currentColor" : "none"}
                        className="transition-all"
                      />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </button>

                    <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-500 transition-colors">
                      <MessageCircle size={18} />
                      <span className="text-sm font-medium">Reply</span>
                    </button>

                    <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                      <Share size={18} />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>

                  {/* Engagement Indicator */}
                  {post.likes > 10 && (
                    <div className="flex items-center gap-1 text-xs text-orange-500  px-2 py-1 rounded-full">
                      🔥 Popular
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {posts.length === 0 && (
            <div className="mental-card text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to share your wellness journey!
              </p>
              <button
                onClick={() => document.querySelector("textarea")?.focus()}
                className="mental-btn mental-btn-primary"
              >
                Create First Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
