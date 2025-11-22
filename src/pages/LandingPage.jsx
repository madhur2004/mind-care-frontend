import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* 🌟 Full Screen Video Background (Parallax Effect) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          src="/vedios/logdingvedio.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-110 animate-slow-zoom"
        />
      </div>

      {/* 🌟 Dark Overlay - Always dark */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-lg z-10" />

      {/* 🌟 Floating Particles */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {Array.from({ length: 25 }).map((_, idx) => (
          <div
            key={idx}
            className="floating-particle bg-white/20 rounded-full absolute"
            style={{
              width: `${8 + Math.random() * 8}px`,
              height: `${8 + Math.random() * 8}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* 🌟 HERO CONTENT - Explicit white colors */}
      <div className="relative z-30 flex flex-col items-center text-center px-6 pt-20 md:pt-28">
        {/* 🔥 Animated Logo / Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-xl"
        >
          Heal • Grow • Transform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.4 }}
          className="mt-6 text-lg md:text-2xl text-gray-200 max-w-2xl"
        >
          Your personalized mental wellness platform with mood tracking,
          meditation, AI chat, and journaling.
        </motion.p>

        {/* 🔥 PRIMARY CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Link
            to="/login"
            className="mt-10 px-10 py-4 text-xl font-semibold rounded-xl 
              bg-linear-to-r from-indigo-500 to-purple-600 hover:opacity-90 
              transition-all shadow-xl text-white"
          >
            Continue with Google →
          </Link>
        </motion.div>

        {/* 🔥 Sub CTA */}
        <p className="mt-4 text-gray-300 text-sm">
          No signup yet?{" "}
          <Link
            to="/login"
            className="underline text-white hover:text-gray-200"
          >
            Create account
          </Link>
        </p>
      </div>

      {/* 🌟 FEATURES SECTION - Explicit white colors */}
      <div className="relative z-30 mt-32 p-10 text-center">
        <h2 className="text-3xl font-bold mb-10 text-white">What You Get</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {[
            {
              title: "Mood Tracking",
              desc: "Track feelings daily & see patterns",
            },
            {
              title: "Guided Meditation",
              desc: "Relax your mind with music + voice",
            },
            {
              title: "AI Voice Chat",
              desc: "Talk to your AI wellness companion",
            },
            { title: "Breathing Exercises", desc: "Reduce stress instantly" },
            {
              title: "Daily Journal",
              desc: "Write thoughts privately & securely",
            },
            {
              title: "Progress Reports",
              desc: "See emotional growth visually",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 
              shadow-lg hover:scale-[1.04] transition-all"
            >
              <h3 className="text-xl font-semibold text-white">{f.title}</h3>
              <p className="text-gray-200 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
