import { invoke } from '@tauri-apps/api/core';

export interface FileInfo {
  path: string;
  name: string;
  content?: Uint8Array;
}

export class FileService {
  static async openFileDialog(): Promise<string | null> {
    try {
      const result = await invoke<string | null>('open_file_dialog');
      return result;
    } catch (error) {
      console.error('Failed to open file dialog:', error);
      throw new Error('Failed to open file dialog');
    }
  }

  static async readFileContent(filePath: string): Promise<Uint8Array> {
    try {
      const result = await invoke<number[]>('read_file_content', { filePath });
      return new Uint8Array(result);
    } catch (error) {
      console.error('Failed to read file:', error);
      throw new Error('Failed to read file content');
    }
  }

  static async loadPresentationFile(): Promise<FileInfo | null> {
    try {
      const filePath = await this.openFileDialog();
      if (!filePath) {
        return null;
      }

      const content = await this.readFileContent(filePath);
      const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'Unknown';

      return {
        path: filePath,
        name: fileName,
        content
      };
    } catch (error) {
      console.error('Failed to load presentation file:', error);
      throw error;
    }
  }

  static getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  static isPowerPointFile(fileName: string): boolean {
    const extension = this.getFileExtension(fileName);
    return ['ppt', 'pptx'].includes(extension);
  }
}
