import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import db, {deleteNote, getNotes, saveNote} from './database';
import EditText from './EditText';

const Notes = () => {
  const [showPopBox, setShowPopBox] = useState<'none' | 'flex'>('none');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState<
    {id: number; title: string; content: string}[]
  >([]);
  const [editNotePanel, setEditNotePanel] = useState<boolean>(false);
  const [editNoteData, setEditNoteData] = useState<{
    id: number;
    title: string;
    content: string;
  }>({id: 0, title: '', content: ''});
  console.log('notes: ', notes);

  useEffect(() => {
    getNotes(setNotes);
  }, []);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      console.log('Title and Content cannot be empty!');
      return;
    }
    saveNote(title, content);
    setTimeout(() => getNotes(setNotes), 500); // Delay fetching to ensure data is saved
    setTitle('');
    setContent('');
    setShowPopBox('none');
  };

  const handleDelete = (id: any) => {
    deleteNote(id, () => getNotes(setNotes));
  };

  const handleEdit = (item: any) => {
    setEditNotePanel(true);
    setEditNoteData({
      id: item.id,
      title: item.title,
      content: item.content,
    });
  };

  return (
    <>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>MyNotes</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.popBtnBox}>
          <Pressable
            onPress={() =>
              setShowPopBox(showPopBox === 'none' ? 'flex' : 'none')
            }>
            <View>
              <Text style={styles.popBtnText}>+</Text>
            </View>
          </Pressable>
        </View>
        <View style={[styles.popContainer, {display: showPopBox}]}>
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
              onPress={() => {
                setTitle('');
                setContent('');
                setShowPopBox('none');
              }}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
          </View>
        </View>
        {editNotePanel ? (
          <EditText
            editNoteData={editNoteData}
            setNotes={setNotes}
            editNotePanel={editNotePanel}
            setEditNotePanel={setEditNotePanel}
          />
        ) : null}
        <FlatList
          data={notes}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.note}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteContent}>{item.content}</Text>
              <View style={{flexDirection: 'row'}}>
                <Pressable onPress={() => handleEdit(item)}>
                  <View
                    style={[styles.noteButton, {backgroundColor: '#5394fc'}]}>
                    <Text style={styles.noteBtnText}>Edit</Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => handleDelete(item.id)}>
                  <View style={styles.noteButton}>
                    <Text style={styles.noteBtnText}>Delete</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    </>
  );
};

export default Notes;

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  navbarText: {
    fontSize: 24,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    margin: 10,
  },
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
  note: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 18,
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: '500',
  },
  noteContent: {
    marginTop: 4,
    fontSize: 13,
  },
  noteButton: {
    borderWidth: 1,
    borderColor: '#999',
    marginVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 14,
    backgroundColor: '#fc5353',
    marginRight: 18,
  },
  noteBtnText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: '#ffffff',
  },
});
