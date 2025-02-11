import {useState} from 'react';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {StorageFileController} from './StorageFileController';

export const FileController = () => {
  const {CopyNotesToPublicFolder} = StorageFileController();

  // const [fileCount, setFileCount] = useState<null | number>(); // Start from 1
  const [fileData, setFileData] = useState<string>();

  const [fileCount, setFileCount] = useState<number>(1); // Initialize with 1

  const getUniqueFileName = async (fileName: string | null) => {
    const baseName = fileName ? fileName : 'untitled';
    let count = fileCount;
    let directoryPath = `${RNFS.DocumentDirectoryPath}/NotesTaker`;

    // Create directory if it doesn't exist
    const exists = await RNFS.exists(directoryPath);
    if (!exists) {
      await RNFS.mkdir(directoryPath);
    }

    let filePath = `${directoryPath}/${baseName}${count}.txt`;

    // Increment count if file exists
    while (await RNFS.exists(filePath)) {
      count++;
      filePath = `${directoryPath}/${baseName}${count}.txt`;
    }

    return {
      newFileName: `${baseName}${count}`,
      filePath,
      newCount: count + 1,
    };
  };

  const HandleCreateFile = async (fileName: string | null) => {
    console.log('HandleCreateFile: ', fileName);
    try {
      const {newFileName, filePath, newCount} = await getUniqueFileName(
        fileName,
      );

      await RNFS.writeFile(filePath, '', 'utf8');
      console.log(`File created: ${filePath}`);
      CopyNotesToPublicFolder(newFileName, filePath);
      // Update the fileCount state to ensure the next file uses the correct name
      setFileCount(newCount);
      return {newFileName, filePath};
    } catch (error) {
      console.error('Error creating file:', error);
      return;
    }
  };

  const HandleUpdateFile = async (fileName: any, content: any) => {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/NotesTaker/${fileName}.txt`;
      console.log('file name: ', filePath);
      const exits = await RNFS.exists(filePath);
      if (!exits) {
        console.error('No File Found!');
        return;
      }
      await RNFS.writeFile(filePath, content, 'utf8');
      console.log('file updated successfully.');
    } catch (error) {
      console.error('Error updating new file: ', error);
    }
  };

  const HandleReadFile = async (fileName: any) => {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/NotesTaker/${fileName}.txt`;
      console.log('file name: ', filePath);
      const exits = await RNFS.exists(filePath);
      if (!exits) {
        console.error('No File Found!');
        return;
      }
      await RNFS.readFile(filePath, 'utf8')
        .then(content => {
          setFileData(content);
          console.log('File Content:', content);
        })
        .catch(err => console.log(err));
      console.log('file reading successfully.');
    } catch (error) {
      console.error('Error reading new file: ', error);
    }
  };

  const HandleDeleteFile = async (fileName: any) => {
    try {
      // Define the folder path
      const folderPath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/NotesTaker`
          : `${RNFS.DocumentDirectoryPath}/NotesTaker`;

      const mainFilePath = `${folderPath}/${fileName}`;
      const visibilityFilePath = `${folderPath}/${fileName}`;

      // Check if the file exists before attempting to delete
      const mainFileExists = await RNFS.exists(mainFilePath);
      const visibilityFileExists = await RNFS.exists(visibilityFilePath);

      if (!mainFileExists && !visibilityFileExists) {
        console.log('File not found in both main and visible folders');
        return;
      }

      if (mainFileExists) {
        // Delete the file from the main folder
        await RNFS.unlink(mainFilePath);
        console.log('Deleted file from main folder:', mainFilePath);
      }

      if (visibilityFileExists) {
        // Delete the file from the visible folder
        await RNFS.unlink(visibilityFilePath);
        console.log('Deleted file from visible folder:', visibilityFilePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const HandleDeleteAllFile = async () => {
    try {
      // for Main Folder
      const folderPath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/NotesTaker`
          : `${RNFS.DocumentDirectoryPath}/NotesTaker`;

      // for Visible Folder
      const visibleFolderPath =
        Platform.OS === 'android'
          ? `${RNFS.DocumentDirectoryPath}/NotesTaker`
          : `${RNFS.DocumentDirectoryPath}/NotesTaker`;

      // Get all files in the directory
      const mainFiles = await RNFS.readDir(folderPath);
      const visibleFiles = await RNFS.readDir(visibleFolderPath);

      // for Main Folder
      for (const file of mainFiles) {
        //  && file.name.startsWith('recorded_audio_')
        if (file.isFile()) {
          await RNFS.unlink(file.path);
          console.log('Deleted:', file.path);
        }
      }

      // for Visible Folder
      for (const file of visibleFiles) {
        if (file.isFile()) {
          await RNFS.unlink(file.path);
          console.log('Deleted:', file.path);
        }
      }
      console.log('Success', 'All recorded audio files have been deleted.');
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  };

  return {
    fileData,
    HandleCreateFile,
    HandleUpdateFile,
    HandleReadFile,
    HandleDeleteFile,
    HandleDeleteAllFile,
  };
};
