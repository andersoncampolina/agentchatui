'use client';

import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import { Tooltip } from '../common/Tooltip';
import { FaMicrophone } from 'react-icons/fa';

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

  // Check if running on iOS
  const isIOS = () => {
    const ua = navigator.userAgent;
    return (
      /iPad|iPhone|iPod/.test(ua) &&
      !(window as Window & { MSStream?: unknown }).MSStream
    );
  };

  // Toggle recording state
  const toggleRecording = async () => {
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

      // For iOS, show an alert to guide the user
      if (isIOS()) {
        alert(
          'Please allow microphone access in your browser settings to use this feature. For iOS devices, go to Settings > Safari > Microphone and enable it for this website.'
        );
      }
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
        disabled={disabled || permissionDenied}
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
