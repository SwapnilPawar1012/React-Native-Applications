import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {editNote, getNotes} from './database';

const EditText = ({
  editNoteData,
  setNotes,
  editNotePanel,
  setEditNotePanel,
}: any) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleUpdate = () => {
    if (!editNoteData.id || !title.trim() || !content.trim()) {
      console.log('Title and Content cannot be empty!');
      return;
    }
    editNote(editNoteData.id, title, content);
    setTimeout(() => getNotes(setNotes), 500); // Delay fetching to ensure data is saved
    setTitle('');
    setContent('');
    setEditNotePanel('none');
  };

  useEffect(() => {
    if (editNoteData) {
      setTitle(editNoteData.title);
      setContent(editNoteData.content);
    }
  }, [editNote]);

  return (
    <View style={[styles.popContainer, {display: editNotePanel}]}>
      <TextInput
        style={styles.input}
        value={title}
        placeholder="Title..."
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        value={content}
        placeholder="Content..."
        onChangeText={setContent}
      />
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, {backgroundColor: '#db535c'}]}
          onPress={() => setEditNotePanel('none')}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  popContainer: {
    display: 'none',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    padding: 25,
    borderRadius: 18,
    backgroundColor: '#baffcd',
    marginTop: 200,
    opacity: 0.8,
  },
  popBtnBox: {
    position: 'absolute',
    bottom: 35,
    right: 25,
    zIndex: 1,
    borderWidth: 1,
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 2,
    borderRadius: 50,
    backgroundColor: '#5394fc',
  },
  popBtnText: {
    fontSize: 38,
    color: '#ffffff',
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#555',
    marginVertical: 10,
    borderRadius: 8,
    paddingLeft: 14,
    backgroundColor: '#ddd',
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: '40%',
    borderWidth: 1,
    borderColor: '#999',
    marginVertical: 10,
    borderRadius: 8,
    paddingVertical: 10,
    backgroundColor: '#5394fc',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: '#ffffff',
  },
});

export default EditText;
