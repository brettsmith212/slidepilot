import React, { useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { FileService, FileInfo } from '../../services/fileService';

interface FileOpenButtonProps {
  onFileLoaded: (fileInfo: FileInfo) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

const FileOpenButton: React.FC<FileOpenButtonProps> = ({
  onFileLoaded,
  onError,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenFile = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      const fileInfo = await FileService.loadPresentationFile();
      if (fileInfo) {
        if (FileService.isPowerPointFile(fileInfo.name)) {
          onFileLoaded(fileInfo);
        } else {
          onError('Please select a valid PowerPoint file (.ppt or .pptx)');
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to load file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleOpenFile}
      disabled={disabled || isLoading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          Loading...
        </>
      ) : (
        <>
          <Upload size={16} />
          Open Presentation
        </>
      )}
    </button>
  );
};

export default FileOpenButton;
