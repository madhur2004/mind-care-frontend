import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Mic, MicOff, Volume2 } from "lucide-react";

export default function VoiceChatBot({
  onTranscript,
  userName,
  isSpeaking,
  onSpeakMessage,
  lastBotMessage,
  theme,
}) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!listening && transcript.trim() && !isProcessing) {
      setIsProcessing(true);
      setTimeout(() => {
        onTranscript(transcript.trim());
        resetTranscript();
        setIsProcessing(false);
      }, 500);
    }
  }, [listening, transcript, onTranscript, resetTranscript, isProcessing]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          🎤 Voice input is not supported in your browser. Try Chrome or Edge
          for the best experience.
        </p>
      </div>
    );
  }

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: false,
      language: "en-US",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div className="space-y-3 voice-chat-container">
      {/* Voice Controls */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={() => (listening ? stopListening() : startListening())}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-xl transition-all duration-200 voice-control-btn mt-1 ${
            listening
              ? "bg-red-500 text-white shadow-lg transform scale-105"
              : "bg-gray-100 dark:bg-gray-400 border border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md"
          }`}
        >
          {listening ? (
            <>
              <div className="relative">
                <MicOff size={20} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
              </div>
              <span className="font-medium text-base">
                Listening... Speak now
              </span>
            </>
          ) : (
            <>
              <Mic size={20} />
              <span className="font-medium text-base">Tap to Speak</span>
            </>
          )}
        </button>

        {lastBotMessage && (
          <button
            onClick={() =>
              isSpeaking ? stopSpeaking() : onSpeakMessage(lastBotMessage)
            }
            className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl transition-all duration-200 shrink-0 speak-btn ${
              isSpeaking
                ? "bg-green-600 text-white shadow-lg"
                : "bg-linear-to-r from-purple-500 to-pink-500 text-white hover:shadow-md"
            }`}
          >
            <Volume2 size={20} />
            <span className="font-medium text-base">
              {isSpeaking ? "Stop" : "Listen"}
            </span>
          </button>
        )}
      </div>

      {/* Voice Status */}
      {listening && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm voice-status">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="voice-status">
              I'm listening... speak naturally
            </span>
          </div>
        </div>
      )}

      {/* Voice Suggestions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {[
          "I'm feeling stressed today",
          "Help me relax",
          "I need motivation",
          "I'm having anxiety",
          "Tell me a breathing technique",
          "How to improve my mood",
        ].map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onTranscript(suggestion)}
            className={`
              text-xs px-3 py-3 
              bg-white dark:bg-gray-600
              border border-gray-300 dark:border-gray-500
              rounded-lg
              hover:bg-blue-50 dark:hover:bg-blue-900/30
              hover:border-blue-300 dark:hover:border-blue-500
              transition-colors duration-200
              text-center wrap-break-word min-h-12
              flex items-center justify-center
              voice-suggestion-btn
            `}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Live Transcript */}
      {transcript && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-xs text-green-800 dark:text-green-200 mb-1 font-medium">
            Live transcript:
          </p>
          <p className="text-sm text-green-700 dark:text-green-300 transcript-text">
            {transcript}
          </p>
        </div>
      )}
    </div>
  );
}
