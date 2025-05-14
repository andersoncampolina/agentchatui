'use client';

import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import { Tooltip } from '../common/Tooltip';
import { FaMicrophone } from 'react-icons/fa';
import { toast } from 'sonner';

interface MicrophoneButtonProps {
  onAudioRecorded: (audio: string) => void;
  disabled?: boolean;
}

export function MicrophoneButton({
  onAudioRecorded,
  disabled = false,
}: MicrophoneButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Detect browser type and provide specific instructions
  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent;

    // iOS detection (Safari on iOS)
    if (
      /iPad|iPhone|iPod/.test(userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream
    ) {
      return "iOS Safari: \n1. Go to Settings \n2. Scroll down and tap on Safari \n3. Scroll down to 'Settings for Websites' \n4. Tap on Microphone \n5. Select 'Allow' for this website";
    }

    // Chrome
    if (
      userAgent.indexOf('Chrome') !== -1 &&
      userAgent.indexOf('Edg') === -1 &&
      userAgent.indexOf('OPR') === -1
    ) {
      return "Chrome: \n1. Click the lock/info icon in the address bar \n2. Select 'Site settings' \n3. Find Microphone in the permissions list \n4. Change to 'Allow'";
    }

    // Firefox
    if (userAgent.indexOf('Firefox') !== -1) {
      return "Firefox: \n1. Click the lock/info icon in the address bar \n2. Click 'Connection secure' \n3. Click 'More Information' \n4. Go to 'Permissions' tab \n5. Find 'Use the Microphone' and select 'Allow'";
    }

    // Edge
    if (userAgent.indexOf('Edg') !== -1) {
      return "Edge: \n1. Click the lock/info icon in the address bar \n2. Click 'Site permissions' \n3. Find Microphone and change to 'Allow'";
    }

    // Safari (desktop)
    if (
      userAgent.indexOf('Safari') !== -1 &&
      userAgent.indexOf('Chrome') === -1
    ) {
      return "Safari: \n1. Click Safari in the menu bar \n2. Select 'Settings for This Website' \n3. Find Microphone and select 'Allow'";
    }

    // Opera
    if (userAgent.indexOf('OPR') !== -1) {
      return "Opera: \n1. Click the lock/info icon in the address bar \n2. Go to 'Site settings' \n3. Find Microphone and change to 'Allow'";
    }

    // Generic instructions for other browsers
    return "Browser: \n1. Check the address bar for permission icons (usually a lock icon) \n2. Access site permissions/settings \n3. Find microphone permissions and set to 'Allow'";
  };

  // Toggle recording state
  const toggleRecording = async () => {
    if (disabled) {
      toast.error(
        "Microphone is currently disabled. Please wait until it's available to use."
      );
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  // Request permission explicitly (helps with iOS)
  const requestMicrophonePermission = async () => {
    try {
      // This will trigger the permission dialog
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately, we just needed the permission
      stream.getTracks().forEach((track) => track.stop());
      setPermissionDenied(false);
      return true;
    } catch (error) {
      console.error('Permission denied or error accessing microphone:', error);
      setPermissionDenied(true);

      // Show toast notification with browser-specific instructions
      toast.error(
        `Microphone access denied. Please enable it in your browser settings: \n\n${getBrowserInstructions()}`,
        { duration: 8000 }
      );

      return false;
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      // Always explicitly request permission first
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) return;

      // Reset audio chunks
      audioChunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false, // Explicitly set video to false
      });
      streamRef.current = stream;

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        // Combine audio chunks into a single blob
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });

        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          // Remove the data:audio/webm;base64, prefix
          const base64Data = base64Audio.split(',')[1];
          onAudioRecorded(base64Data);
        };

        // Stop all tracks in the stream
        if (streamRef.current) {
          const tracks = streamRef.current.getTracks();
          tracks.forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      // Start recording and request data every 1 second
      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setPermissionDenied(true);

      // Show toast notification with browser-specific instructions
      toast.error(
        `Microphone access denied. Please enable it in your browser: \n\n${getBrowserInstructions()}`,
        { duration: 8000 }
      );
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <Tooltip
      text={
        permissionDenied
          ? 'Microphone access denied. Check browser settings.'
          : isRecording
          ? 'Click to stop recording'
          : 'Click to start recording'
      }
    >
      <Button
        className="rounded-full cursor-pointer font-extrabold bg-[var(--primary-color)] backdrop-blur h-10 w-10 sm:h-12 sm:w-12 text-xl sm:text-2xl flex-shrink-0"
        onClick={toggleRecording}
        type="button"
        disabled={disabled}
      >
        {isRecording ? (
          <PulseLoader
            size={6}
            color="white"
            style={{
              alignItems: 'center',
              display: 'flex',
              backgroundColor: 'var(--primary-color)',
            }}
          />
        ) : (
          <FaMicrophone color="white" className="bg-transparent" />
        )}
      </Button>
    </Tooltip>
  );
}
