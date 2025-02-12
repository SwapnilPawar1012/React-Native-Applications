import {useState} from 'react';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {StorageFileController} from './StorageFileController';

export const FileController = () => {
  const {
    CopyNotesToPublicFolder,
    RenameFile,
    UpdateFile,
    DeleteFile,
    DeleteAllFiles,
  } = StorageFileController();

  const [fileCount, setFileCount] = useState<number>(1);

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

      setFileCount(1);
      return {newFileName, filePath};
    } catch (error) {
      console.error('Error creating file:', error);
      return;
    }
  };

  const HandleRenameFile = async (oldFileName: string, newFileName: string) => {
    try {
      const documentDir = `${RNFS.DocumentDirectoryPath}/NotesTaker`;
      const oldFilePath = `${documentDir}/${oldFileName}.txt`;
      const newFilePath = `${documentDir}/${newFileName}.txt`;
      console.log('Renaming File:', oldFilePath, ' -> ', newFilePath);

      // Check if old file exists
      const oldFileExists = await RNFS.exists(oldFilePath);
      if (!oldFileExists) {
        console.error('File not found in both directories!');
        return false;
      }

      // Check if new file already exists
      const newFileExists = await RNFS.exists(newFilePath);
      if (newFileExists) {
        console.error('File with new name already exists!');
        return false;
      }

      // Rename only if the old file exists
      if (oldFileExists) {
        await RNFS.moveFile(oldFilePath, newFilePath);
        console.log(
          `Renamed in Document Directory: ${oldFilePath} → ${newFilePath}`,
        );
      }
      RenameFile(oldFileName, newFileName);
      return true;
    } catch (error) {
      console.error('Error renaming file:', error);
      return false;
    }
  };

  const HandleUpdateFile = async (fileName: any, content: any) => {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/NotesTaker/${fileName}.txt`;
      console.log('file name: ', filePath);
      const exits = await RNFS.exists(filePath);
      console.log('file exits: ', exits, ' content: ', content);
      if (!exits) {
        console.error('No File Found!');
        return;
      }
      await RNFS.writeFile(filePath, content, 'utf8');
      console.log('file updated successfully.');
      UpdateFile(fileName, content);
      return true;
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

      // Read the file content
      const content = await RNFS.readFile(filePath, 'utf8');
      console.log('File Content:', content);
      return content;
    } catch (error) {
      console.error('Error reading new file: ', error);
    }
  };

  const HandleDeleteFile = async (fileName: any) => {
    console.log('HandleDeleteFile: ', fileName);
    try {
      const folderPath = `${RNFS.DocumentDirectoryPath}/NotesTaker`;
      const filePath = `${folderPath}/${fileName}.txt`;

      // Check if the file exists before attempting to delete
      const fileExists = await RNFS.exists(filePath);
      if (!fileExists) {
        console.log('File not found in both main and visible folders');
        return;
      }

      if (fileExists) {
        // Delete the file from the main folder
        await RNFS.unlink(filePath);
        console.log('Deleted file from main folder:', filePath);
      }
      DeleteFile(fileName);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const HandleDeleteAllFile = async () => {
    console.log('HandleDeleteAllFile');
    try {
      const folderPath = `${RNFS.DocumentDirectoryPath}/NotesTaker`;

      // Get all files in the directory
      const mainFiles = await RNFS.readDir(folderPath);
      for (const file of mainFiles) {
        if (file.isFile()) {
          await RNFS.unlink(file.path);
          console.log('Deleted:', file.path);
        }
      }
      console.log('Success, All files have been deleted.');
      DeleteAllFiles();
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  };

  const HandleFetchFiles = async () => {
    try {
      let filesPath = `${RNFS.DocumentDirectoryPath}/NotesTaker`;

      // Check if the folder exists
      const exists = await RNFS.exists(filesPath);
      if (!exists) {
        console.log('Copied files folder does not exist');
        return [];
      }

      // Read all files in the directory
      const files = await RNFS.readDir(filesPath);
      if (!files.length) {
        console.log('No files found in: ', filesPath);
        return [];
      }

      // Filter only `.txt` files and extract file names
      const fetchedFiles = files
        .filter(file => file.isFile() && file.name.endsWith('.txt'))
        .map(file => file.name.replace('.txt', '')); // Remove the extension

      console.log('Fetched files: ', fetchedFiles);
      return fetchedFiles;
    } catch (error) {
      console.error('Error fetching all copied files: ', error);
      return [];
    }
  };

  return {
    HandleCreateFile,
    HandleUpdateFile,
    HandleRenameFile,
    HandleReadFile,
    HandleDeleteFile,
    HandleDeleteAllFile,
    HandleFetchFiles,
  };
};
