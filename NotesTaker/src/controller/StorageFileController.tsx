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

  const GetAllCopiedFiles = async () => {
    try {
      let filesPath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/NotesTaker`
          : `${RNFS.DocumentDirectoryPath}/NotesTaker`;

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

      // Filter to include only files (exclude directories)
      const fetchedFiles = files
        .filter(file => file.isFile())
        .map(file => file.path);

      console.log('Fetched files: ', fetchedFiles);
      return fetchedFiles;
    } catch (error) {
      console.error('Error fetching all copied files: ', error);
      return [];
    }
  };

  return {
    CreatePublicDirectory,
    CopyNotesToPublicFolder,
    GetAllCopiedFiles,
  };
};
