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

// File created: /data/user/0/com.notestaker/files/NotesTaker/untitled1.txt
const EditFile = (filePath: any) => {
  const totalLines = 40;
  const [text, setText] = useState('\n'.repeat(totalLines)); // Pre-filling empty lines
  const [path, setPath] = useState('');

  const {HandleCreateFile, HandleUpdateFile} = FileController();

  const createFile = async () => {
    if (!filePath) {
      console.log('file path: ', filePath);
      return;
    }
    const resp = await HandleCreateFile(null);

    if (resp) {
      console.log('filename: ', resp.newFileName);
      setPath(resp.newFileName);
    }
  };

  const HandleOnSave = () => {
    if (!path || !text) {
      Alert.alert('Something is wrong, Please try againg');
      return;
    }
    console.log('path: ', path, ' text: ', text);
    HandleUpdateFile(path, text);
  };

  useEffect(() => {
    createFile();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>File Name</Text>
          <Pressable>
            <View style={styles.titleEditBtn}>
              <Text style={styles.titleEditBtnText}>edit</Text>
            </View>
          </Pressable>
        </View>
        <View>
          <Pressable onPress={HandleOnSave}>
            <View style={styles.saveButtonBox}>
              <Text style={styles.saveButtonText}>Save</Text>
            </View>
          </Pressable>
        </View>
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
