import { useState, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Phone, PhoneOff, Sparkles, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const VoiceAssistant = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      toast.success("Connected to Intervixa Voice AI");
    },
    onDisconnect: () => {
      toast.info("Voice conversation ended");
    },
    onError: (error) => {
      console.error("Voice error:", error);
      toast.error("Voice connection error. Please try again.");
    },
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const { data, error } = await supabase.functions.invoke(
        "elevenlabs-conversation-token"
      );

      if (error || !data?.token) {
        throw new Error(error?.message || "Failed to get voice token");
      }

      await conversation.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
      });
    } catch (err) {
      console.error("Failed to start voice:", err);
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        toast.error("Microphone access is required for voice chat.");
      } else {
        toast.error("Could not start voice conversation. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isActive = conversation.status === "connected";

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12">
      {/* Animated Orb */}
      <div className="relative">
        <motion.div
          className={`w-40 h-40 rounded-full flex items-center justify-center ${
            isActive
              ? "bg-gradient-to-br from-primary/30 to-primary/10"
              : "bg-muted/30"
          }`}
          animate={
            isActive && conversation.isSpeaking
              ? { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }
              : isActive
              ? { scale: [1, 1.05, 1] }
              : {}
          }
          transition={{ repeat: Infinity, duration: isActive && conversation.isSpeaking ? 0.8 : 2 }}
        >
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center ${
              isActive
                ? "bg-gradient-primary shadow-glow"
                : "bg-muted/50 border border-border"
            }`}
          >
            {isActive ? (
              conversation.isSpeaking ? (
                <Volume2 className="w-10 h-10 text-primary-foreground animate-pulse" />
              ) : (
                <Mic className="w-10 h-10 text-primary-foreground" />
              )
            ) : (
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
        </motion.div>

        {/* Pulse rings when active */}
        <AnimatePresence>
          {isActive && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/20"
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Status Text */}
      <div className="text-center space-y-2">
        <h3 className="font-display text-lg font-semibold">
          {isActive
            ? conversation.isSpeaking
              ? "Intervixa is speaking..."
              : "Listening..."
            : "Voice Assistant"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {isActive
            ? "Speak naturally — ask about interviews, resumes, or career advice."
            : "Start a voice conversation with Intervixa AI for hands-free career guidance."}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isActive ? (
          <Button
            onClick={startConversation}
            disabled={isConnecting}
            size="lg"
            className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 rounded-full px-8 gap-2"
          >
            {isConnecting ? (
              <>
                <Mic className="w-5 h-5 animate-pulse" />
                Connecting...
              </>
            ) : (
              <>
                <Phone className="w-5 h-5" />
                Start Voice Chat
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={stopConversation}
            size="lg"
            variant="destructive"
            className="rounded-full px-8 gap-2"
          >
            <PhoneOff className="w-5 h-5" />
            End Conversation
          </Button>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
