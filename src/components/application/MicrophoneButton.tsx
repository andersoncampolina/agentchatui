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
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Check for microphone permission on component mount
  useEffect(() => {
    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionError('Your browser does not support audio recording');
      return;
    }

    // Check if running on iOS
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    // On iOS, we need to request permission when a user gesture happens
    // This empty function helps ensure the permission dialog appears
    const checkPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        // Immediately stop the stream after permission check
        stream.getTracks().forEach((track) => track.stop());
        setPermissionError(null);
        setShowPermissionPrompt(false);
      } catch (err) {
        console.error('Permission check failed:', err);
        setPermissionError('Microphone access denied');
        // If on iOS and permission denied, we'll show our custom prompt
        if (isIOS) {
          setShowPermissionPrompt(true);
        }
      }
    };

    // Only run on mobile devices
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      checkPermission();
    }
  }, []);

  // Handle iOS permission request
  const requestIOSPermission = () => {
    setShowPermissionPrompt(false);

    // Show browser alert to guide the user
    alert(
      'To use the microphone, please allow access when prompted. If no prompt appears, please go to Settings > Safari > Microphone and enable access for this site.'
    );

    // Try to request permission again
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // Stop the stream immediately after permission is granted
        stream.getTracks().forEach((track) => track.stop());
        setPermissionError(null);
      })
      .catch((err) => {
        console.error('Permission request failed:', err);
        setPermissionError(
          'Microphone access denied. Please check your browser settings.'
        );
      });
  };

  // Toggle recording state
  const toggleRecording = async () => {
    // If on iOS and we have a permission error, show our custom prompt
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && permissionError) {
      setShowPermissionPrompt(true);
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      setPermissionError(null);
      // Reset audio chunks
      audioChunksRef.current = [];

      // Request microphone access with explicit constraints for mobile
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Create media recorder with specific MIME type for better compatibility
      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
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
          type: mimeType,
        });

        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          // Remove the data prefix
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

      // Start recording with smaller time slices for mobile
      mediaRecorder.start(500);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setPermissionError(
        'Could not access microphone. Please check permissions.'
      );

      // If on iOS, show our custom prompt
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        setShowPermissionPrompt(true);
      }
    }
  };

  // Get supported MIME type for better cross-browser compatibility
  const getSupportedMimeType = () => {
    const types = [
      'audio/webm',
      'audio/mp4',
      'audio/ogg',
      'audio/wav',
      'audio/webm;codecs=opus',
      'audio/webm;codecs=pcm',
      '', // Empty string as fallback
    ];

    for (const type of types) {
      if (type === '' || MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'audio/webm'; // Default fallback
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // iOS Permission Prompt Component
  const IOSPermissionPrompt = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
        <h3 className="text-lg font-bold mb-2">Microphone Access Required</h3>
        <p className="mb-4">
          This app needs access to your microphone to record audio. Please allow
          access when prompted.
        </p>
        <div className="flex justify-end space-x-2">
          <Button
            onClick={() => setShowPermissionPrompt(false)}
            className="bg-gray-200 text-black hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={requestIOSPermission}
            className="bg-[var(--primary-color)] text-white"
          >
            Allow Access
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showPermissionPrompt && <IOSPermissionPrompt />}
      <Tooltip
        text={
          permissionError
            ? permissionError
            : isRecording
            ? 'Click to stop recording'
            : 'Click to start recording'
        }
      >
        <Button
          className="rounded-full cursor-pointer font-extrabold bg-[var(--primary-color)] backdrop-blur h-10 w-10 sm:h-12 sm:w-12 text-xl sm:text-2xl flex-shrink-0"
          onClick={toggleRecording}
          type="button"
          disabled={disabled || (!!permissionError && !showPermissionPrompt)}
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
    </>
  );
}

export default MicrophoneButton;
