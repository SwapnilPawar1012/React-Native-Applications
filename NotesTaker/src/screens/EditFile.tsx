import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FileController} from '../controller/FileController';
import Loading from '../components/Loading';

const EditFile = ({route}: any) => {
  const fileName = route?.params?.fileName || '';
  console.log('edit file filename: ', fileName);

  const totalLines = 40;
  const [text, setText] = useState('\n'.repeat(totalLines)); // Pre-filling empty lines
  const [fileNameText, setFileNameText] = useState('');
  const [renameFile, setRenameFile] = useState('');
  const [renameFileStatus, setRenameFileStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [activity, setActivity] = useState<boolean>(false);

  const {HandleCreateFile, HandleUpdateFile, HandleReadFile, HandleRenameFile} =
    FileController();

  const createFile = async () => {
    const resp = await HandleCreateFile(null);
    if (resp) {
      console.log('filename: ', resp.newFileName);
      setFileNameText(resp.newFileName);
    } else {
      console.log('Error creating file');
    }
    setLoading(false);
  };

  const HandleRename = async () => {
    if (!fileNameText || !renameFile) {
      Alert.alert('Please enter a new name');
      return;
    }
    console.log('file: ', fileNameText, 'rename file: ', renameFile);
    const response = await HandleRenameFile(fileNameText, renameFile);
    if (response) {
      setFileNameText(renameFile);
    } else {
      Alert.alert('Cannot rename file, Please try again');
    }
    setRenameFileStatus(false);
  };

  const HandleEditFileContent = async (file: string) => {
    if (!file) {
      Alert.alert('File not found');
      return;
    }
    const content = await HandleReadFile(file);
    if (content) {
      setText(content);
    }
  };

  const HandleOnSave = async () => {
    if (!fileNameText || !text) {
      Alert.alert('Something is wrong, Please try againg');
      return;
    }
    console.log('path: ', fileNameText, ' text: ', text);
    const response = await HandleUpdateFile(fileNameText, text);
    if (response) {
      setActivity(false);
    } else {
      Alert.alert('Error saving file');
    }
    setActivity(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (fileName.length > 0) {
        setFileNameText(fileName);
        await HandleEditFileContent(fileName);
        setLoading(false);
      } else {
        createFile();
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {renameFileStatus ? (
          <View style={styles.renameBox}>
            <TextInput
              value={renameFile}
              style={styles.inputField}
              placeholder="rename file ..."
              onChangeText={setRenameFile}
            />
            <Pressable onPress={HandleRename}>
              <View style={[styles.saveButtonBox, styles.renameButton]}>
                <Text
                  style={[
                    styles.saveButtonText,
                    {color: '#ffffff', fontWeight: '400'},
                  ]}>
                  Rename
                </Text>
              </View>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.titleBox}>
              <Text style={styles.titleText}>{fileNameText}</Text>
              <Pressable onPress={() => setRenameFileStatus(true)}>
                <View style={styles.titleEditBtn}>
                  <Text style={styles.titleEditBtnText}>rename</Text>
                </View>
              </Pressable>
            </View>
            <View>
              {activity ? (
                <Loading />
              ) : (
                <Pressable
                  onPress={() => {
                    setActivity(true);
                    HandleOnSave();
                  }}>
                  <View style={styles.saveButtonBox}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </View>
                </Pressable>
              )}
            </View>
          </>
        )}
      </View>
      <View style={styles.inputBox}>
        <View>
          <Image
            source={require('../assets/paper-background.jpg')}
            style={styles.bgImage}
          />
        </View>
        <TextInput
          value={text}
          style={styles.textArea}
          onChangeText={setText}
          multiline={true}
          placeholder="start typing..."
          textAlignVertical="top"
          // scrollEnabled={true} // Enables scrolling
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },
  renameBox: {
    flex: 1,
    flexDirection: 'row',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#888',
    fontSize: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 6,
  },
  renameButton: {
    backgroundColor: '#008234',
    position: 'absolute',
    zIndex: 1,
    right: 2,
    top: -1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  titleEditBtn: {
    marginLeft: 8,
  },
  titleEditBtnText: {
    fontSize: 12,
    color: 'blue',
  },
  saveButtonBox: {
    backgroundColor: '#5979f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  saveButtonText: {
    fontSize: 13,
    color: '#ffffff',
  },
  inputBox: {
    marginHorizontal: 8,
    marginTop: 10,
  },
  bgImage: {
    width: 'auto',
    height: '99%',
    borderRadius: 14,
    backgroundColor: 'blue',
  },
  textArea: {
    fontSize: 15,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    lineHeight: 28,
    // textAlignVertical: 'top',
    // borderWidth: 1,
    // borderColor: 'red',
  },
});

export default EditFile;
