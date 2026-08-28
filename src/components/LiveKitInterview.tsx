import { useCallback, useEffect, useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  BarVisualizer,
  useLocalParticipant,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { motion } from "framer-motion";
import { Mic, MicOff, Phone, PhoneOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AgentStage = ({ onLeave }: { onLeave: () => void }) => {
  const { state, audioTrack } = useVoiceAssistant();
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();

  // Ensure the mic is actually published once we're in the room
  useEffect(() => {
    if (!localParticipant) return;
    if (isMicrophoneEnabled) return;
    localParticipant
      .setMicrophoneEnabled(true)
      .catch((e) => console.error("Failed to enable microphone:", e));
  }, [localParticipant, isMicrophoneEnabled]);


  const label =
    state === "speaking"
      ? "Interviewer is speaking..."
      : state === "listening"
      ? "Listening..."
      : state === "thinking"
      ? "Thinking..."
      : "Connecting to interviewer...";

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <motion.div
        className="relative w-40 h-40 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10"
        animate={state === "speaking" ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        <div className="w-28 h-28 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center overflow-hidden">
          <BarVisualizer
            state={state}
            barCount={5}
            trackRef={audioTrack}
            className="h-12 w-20 [&>.lk-audio-bar]:bg-primary-foreground"
          />
        </div>
      </motion.div>

      <div className="text-center space-y-1">
        <h3 className="font-display text-lg font-semibold">{label}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Answer naturally — your AI interviewer is listening in real time.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full gap-2"
          onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
        >
          {isMicrophoneEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          {isMicrophoneEnabled ? "Mute" : "Unmute"}
        </Button>
        <Button variant="destructive" size="lg" className="rounded-full gap-2" onClick={onLeave}>
          <PhoneOff className="w-5 h-5" />
          End Interview
        </Button>
      </div>

      <RoomAudioRenderer />
    </div>
  );
};

const LiveKitInterview = () => {
  const [creds, setCreds] = useState<{ token: string; url: string } | null>(null);
  const [connecting, setConnecting] = useState(false);

  const start = useCallback(async () => {
    setConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const { data, error } = await supabase.functions.invoke("livekit-token");
      if (error || !data?.token) {
        throw new Error(error?.message || "Failed to get interview token");
      }
      setCreds({ token: data.token, url: data.url });
    } catch (err) {
      console.error("LiveKit start failed:", err);
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        toast.error("Microphone access is required for the voice interview.");
      } else {
        toast.error("Could not start the voice interview. Please try again.");
      }
    } finally {
      setConnecting(false);
    }
  }, []);

  const stop = useCallback(() => setCreds(null), []);

  if (!creds) {
    return (
      <div className="flex flex-col items-center gap-8 py-10">
        <div className="w-40 h-40 rounded-full bg-muted/30 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-muted/50 border border-border flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-display text-lg font-semibold">Voice Mock Interview</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Talk live with your AI interviewer and get real-time Cloud & DevOps practice.
          </p>
        </div>
        <Button
          onClick={start}
          disabled={connecting}
          size="lg"
          className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 rounded-full px-8 gap-2"
        >
          {connecting ? (
            <>
              <Mic className="w-5 h-5 animate-pulse" />
              Connecting...
            </>
          ) : (
            <>
              <Phone className="w-5 h-5" />
              Start Voice Interview
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={creds.token}
      serverUrl={creds.url}
      connect
      audio
      video={false}
      options={{
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      }}
      onDisconnected={stop}
      onError={(e) => {
        console.error("LiveKit room error:", e);
        toast.error("Interview connection error.");
      }}
      className="w-full"
    >
      <AgentStage onLeave={stop} />
    </LiveKitRoom>
  );
};

export default LiveKitInterview;
