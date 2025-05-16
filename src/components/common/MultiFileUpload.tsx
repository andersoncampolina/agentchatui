'use client';

import React, { useState, useEffect, useId } from 'react';
import { PulseLoader } from 'react-spinners';
import Image from 'next/image';
import Link from 'next/link';
import { Tooltip } from '../InputChat/Tooltip';
import { Button } from '../ui/button';

type MultiFileUploadProps = {
  maxFiles?: number;
  uploadFiles?: (
    files: { name: string; data: string; type: string }[]
  ) => Promise<void>;
  initialFiles?: { url: string; name: string }[];
  onFilesSelected?: (files: File[]) => void;
  dragboxText?: string;
  disabled?: boolean;
  onDeleteFile?: (url: string, index: number) => Promise<void>;
  accept?: string;
};

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  maxFiles = 10,
  uploadFiles,
  initialFiles = [],
  onFilesSelected,
  dragboxText = 'Drag and drop files here or click to select',
  disabled = false,
  onDeleteFile,
  accept = '*/*',
}) => {
  // Generate unique ID for each instance
  const inputId = useId();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] =
    useState<{ url: string; name: string }[]>(initialFiles);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !event.target.files) return;

    const newFiles = Array.from(event.target.files).slice(
      0,
      maxFiles - selectedFiles.length
    );

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    if (onFilesSelected) {
      onFilesSelected([...selectedFiles, ...newFiles]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();

    const droppedFiles = event.dataTransfer.files;
    const newFiles = Array.from(droppedFiles).slice(
      0,
      maxFiles - selectedFiles.length
    );

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    if (onFilesSelected) {
      onFilesSelected([...selectedFiles, ...newFiles]);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled || !selectedFiles.length) return;

    setIsLoading(true);

    try {
      const filesData = await Promise.all(
        selectedFiles.map(async (file) => {
          const base64 = await convertToBase64(file);
          return {
            name: file.name,
            data: base64,
            type: file.type,
          };
        })
      );

      if (uploadFiles) {
        await uploadFiles(filesData);
      }

      // Add uploaded files to the list
      const newUploadedFiles = selectedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      }));

      setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error during upload process:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    if (disabled) return;
    setSelectedFiles((files) => files.filter((_, i) => i !== index));
  };

  const handleDeleteUploadedFile = async (index: number) => {
    if (disabled || !onDeleteFile) return;

    setIsLoading(true);
    const fileToDelete = uploadedFiles[index];

    try {
      const confirmation = confirm(
        'Are you sure you want to delete this file? It cannot be recovered.'
      );

      if (!confirmation) {
        setIsLoading(false);
        return;
      }

      await onDeleteFile(fileToDelete.url, index);
      setUploadedFiles((files) => files.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialFiles.length > 0) {
      setUploadedFiles(initialFiles);
    }
  }, [initialFiles]);

  const isImageFile = (file: File): boolean => file.type.startsWith('image/');

  const isImageUrl = (url: string): boolean =>
    /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);

  const getFileNameFromUrl = (url: string): string => {
    const lastSlashIndex = url.lastIndexOf('/');
    return lastSlashIndex !== -1 ? url.substring(lastSlashIndex + 1) : url;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-32">
        <PulseLoader
          size={8}
          color="var(--primary-color)"
          style={{
            alignItems: 'center',
            display: 'flex',
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {uploadFiles && !disabled && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById(inputId)?.click()}
          className="border-2 border-dashed border-gray-300 p-5 text-center cursor-pointer rounded-lg w-full max-w-lg transition-colors hover:border-[var(--primary-color)]"
        >
          {selectedFiles.length < maxFiles ? (
            <p className="text-gray-600">{dragboxText}</p>
          ) : (
            <p className="text-gray-600">Maximum of {maxFiles} files reached</p>
          )}
          <input
            id={inputId}
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept={accept}
          />
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-3xl mt-4">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="relative w-36 h-36 border border-gray-200 rounded-lg flex justify-center items-center overflow-hidden"
            >
              {isImageFile(file) ? (
                <div className="w-full h-full relative">
                  <a
                    href={URL.createObjectURL(file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="object-cover"
                      fill
                    />
                  </a>
                  {!disabled && (
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-0 left-0 bg-red-500/70 text-white w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold hover:bg-red-600"
                      aria-label="Remove file"
                    >
                      X
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center p-2">
                  <a
                    href={URL.createObjectURL(file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary-color)] font-medium text-sm text-center line-clamp-3 hover:underline"
                  >
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </a>
                  {!disabled && (
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-0 left-0 bg-red-500/70 text-white w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold hover:bg-red-600"
                      aria-label="Remove file"
                    >
                      X
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && !disabled && (
        <Tooltip text="Upload selected files">
          <Button
            onClick={handleUpload}
            className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-md mt-4 hover:bg-[var(--primary-color)]/90 transition-colors"
          >
            Upload {selectedFiles.length} file
            {selectedFiles.length > 1 ? 's' : ''}
          </Button>
        </Tooltip>
      )}

      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-3xl mt-4">
          {uploadedFiles.map((file, index) => (
            <div
              key={`uploaded-${index}`}
              className="relative w-36 h-36 border border-gray-200 rounded-lg flex justify-center items-center overflow-hidden"
            >
              {isImageUrl(file.url) ? (
                <div className="w-full h-full relative">
                  <Link
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <div className="w-full h-full relative">
                      <Image
                        src={file.url}
                        alt={`File ${index}`}
                        className="object-cover"
                        fill
                      />
                    </div>
                  </Link>
                  {!disabled && onDeleteFile && (
                    <button
                      onClick={() => handleDeleteUploadedFile(index)}
                      className="absolute top-0 left-0 bg-red-500/70 text-white w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold hover:bg-red-600"
                      aria-label="Delete file"
                    >
                      X
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center p-2">
                  <Link
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary-color)] font-medium text-sm text-center line-clamp-3 hover:underline"
                  >
                    {file.name || getFileNameFromUrl(file.url)}
                  </Link>
                  {!disabled && onDeleteFile && (
                    <button
                      onClick={() => handleDeleteUploadedFile(index)}
                      className="absolute top-0 left-0 bg-red-500/70 text-white w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold hover:bg-red-600"
                      aria-label="Delete file"
                    >
                      X
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiFileUpload;
