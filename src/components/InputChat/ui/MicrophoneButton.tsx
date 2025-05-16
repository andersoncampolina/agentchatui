'use client';

import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { Tooltip } from './Tooltip';
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Recording control
  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  // Initialize recording process
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Process recording when stopped
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });

        // Convert to base64 for transmission
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          const base64Data = base64Audio.split(',')[1];
          onAudioRecorded(base64Data);
        };

        // Release media resources
        if (streamRef.current) {
          const tracks = streamRef.current.getTracks();
          tracks.forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      toast.error(
        'Microphone access is required. Please enable it in your browser settings and try again.',
        {
          duration: 6000,
        }
      );
    }
  };

  // End recording process
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Tooltip
      text={
        isRecording ? 'Click to stop recording' : 'Click to start recording'
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
