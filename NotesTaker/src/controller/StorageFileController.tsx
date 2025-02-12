import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

export const StorageFileController = () => {
  const CreatePublicDirectory = async () => {
    let directoryPath;
    if (Platform.OS === 'ios') {
      directoryPath = `${RNFS.DocumentDirectoryPath}/NotesTaker`;
    } else {
      directoryPath =
        Number(Platform.Version) >= 29
          ? `${RNFS.DownloadDirectoryPath}/NotesTaker`
          : `${RNFS.DownloadDirectoryPath}/NotesTaker`;
    }

    if (!(await RNFS.exists(directoryPath))) {
      const dPath = await RNFS.mkdir(directoryPath);
      console.log('created directory path: ', dPath);
    }
    console.log('directory path: ', directoryPath);
    return directoryPath;
  };

  const CopyNotesToPublicFolder = async (fileName: string, sourcePath: any) => {
    try {
      let destinationPath;

      if (Platform.OS === 'android') {
        destinationPath = `${RNFS.DownloadDirectoryPath}/NotesTaker/${fileName}`;
      } else {
        destinationPath = `${RNFS.DocumentDirectoryPath}/NotesTaker/${fileName}`;
      }

      // Ensure the destination folder exists NotesTaker
      const destinationFolder = destinationPath.substring(
        0,
        destinationPath.lastIndexOf('/'),
      );
      const folderExists = await RNFS.exists(destinationFolder);
      if (!folderExists) {
        // Create the complete path to the NotesTaker folder
        await RNFS.mkdir(destinationFolder);
        console.log('folder created');
      }

      // Copy file
      await RNFS.copyFile(sourcePath.replace('file://', ''), destinationPath);
      console.log('File copied successfully:', destinationPath);
    } catch (error) {
      console.error('Error copying file: ', error);
    }
  };

  const FetchCopiedFiles = async () => {
    try {
      let filesPath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/NotesTaker`
          : `${RNFS.DocumentDirectoryPath}/NotesTaker`;

      // Check if the folder exists
      const exists = await RNFS.exists(filesPath);
      if (!exists) {
        console.log('FetchCopiedFiles, Copied files folder does not exist');
        return [];
      }

      // Read all files in the directory
      const files = await RNFS.readDir(filesPath);
      if (!files.length) {
        console.log('FetchCopiedFiles, No files found in: ', filesPath);
        return [];
      }

      // Filter to include only files (exclude directories)
      const fetchedFiles = files
        .filter(file => file.isFile())
        .map(file => file.path);
      console.log('FetchCopiedFiles, Fetched files: ', fetchedFiles);
      return fetchedFiles;
    } catch (error) {
      console.error(
        'FetchCopiedFiles, Error fetching all copied files: ',
        error,
      );
      return [];
    }
  };

  const RenameFile = async (oldFileName: string, newFileName: string) => {
    try {
      const dirPath = `${RNFS.DownloadDirectoryPath}/NotesTaker`;

      const oldFilePath = `${dirPath}/${oldFileName}`;
      const newFilePath = `${dirPath}/${newFileName}`;

      // Check if old file exists
      const oldFileExists = await RNFS.exists(oldFilePath);
      if (!oldFileExists) {
        console.error('RenameFile, File not found in directory!', dirPath);
        return false;
      }

      // Check if new file already exists
      const newFileExists = await RNFS.exists(newFilePath);
      if (newFileExists) {
        console.error('RenameFile, File with new name already exists!');
        return false;
      }

      // Ensure NotesTaker directory exists in DownloadDirectoryPath
      const downloadDirExists = await RNFS.exists(dirPath);
      if (!downloadDirExists) {
        await RNFS.mkdir(dirPath);
      }

      // Rename only if the old file exists
      if (oldFileExists) {
        await RNFS.moveFile(oldFilePath, newFilePath);
        console.log(
          `RenameFile, Renamed in Document Directory: ${oldFilePath} → ${newFilePath}`,
        );
      }
      return true;
    } catch (error) {
      console.error('RenameFile, Error renaming file:', error);
      return false;
    }
  };

  const ReadFile = async (fileName: any) => {
    try {
      const filePath = `${RNFS.DownloadDirectoryPath}/NotesTaker/${fileName}.txt`;
      // console.log('file name: ', filePath);
      const exits = await RNFS.exists(filePath);
      if (!exits) {
        console.error('ReadFile, No File Found!');
        return;
      }

      // Read the file content
      const content = await RNFS.readFile(filePath, 'utf8');
      return content;
    } catch (error) {
      console.error('ReadFile, Error reading new file: ', error);
    }
  };

  const UpdateFile = async (fileName: any, content: any) => {
    try {
      const filePath = `${RNFS.DownloadDirectoryPath}/NotesTaker/${fileName}`;
      const exits = await RNFS.exists(filePath);
      if (!exits) {
        console.error('UpdateFile, No File Found!');
        return;
      }
      await RNFS.writeFile(filePath, content, 'utf8');
      console.log('UpdateFile, file updated successfully.');
      return true;
    } catch (error) {
      console.error('UpdateFile, Error updating new file: ', error);
    }
  };

  const DeleteFile = async (fileName: any) => {
    try {
      // for Main(Download) Folder
      const folderPath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/NotesTaker`
          : `${RNFS.DocumentDirectoryPath}/NotesTaker`;

      const mainFilePath = `${folderPath}/${fileName}`;

      // Check if the file exists before attempting to delete
      const mainFileExists = await RNFS.exists(mainFilePath);

      if (!mainFileExists) {
        console.log('DeleteFile, File not found in visible folders');
        return;
      }

      if (mainFileExists) {
        // Delete the file from the main folder
        await RNFS.unlink(mainFilePath);
        console.log('DeleteFile, Deleted file from main folder:', mainFilePath);
      }
    } catch (error) {
      console.error('DeleteFile, Error deleting file:', error);
    }
  };

  const DeleteAllFiles = async () => {
    console.log('HandleDeleteAllFile');
    try {
      const folderPath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/NotesTaker`
          : `${RNFS.DocumentDirectoryPath}/NotesTaker`;

      // Get all files in the directory
      const mainFiles = await RNFS.readDir(folderPath);

      for (const file of mainFiles) {
        if (file.isFile()) {
          await RNFS.unlink(file.path);
          console.log('Deleted:', file.path);
        }
      }
      console.log('DeleteAllFiles, Success, All files have been deleted.');
    } catch (error) {
      console.error('DeleteAllFiles, Error deleting files:', error);
    }
  };

  return {
    CreatePublicDirectory,
    CopyNotesToPublicFolder,
    FetchCopiedFiles,
    RenameFile,
    ReadFile,
    UpdateFile,
    DeleteFile,
    DeleteAllFiles,
  };
};
