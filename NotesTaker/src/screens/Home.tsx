import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StorageFileController} from '../controller/StorageFileController';
import {FileController} from '../controller/FileController';

const Home = ({navigation}: any) => {
  const {GetAllCopiedFiles} = StorageFileController();
  const {HandleDeleteFile, HandleDeleteAllFile} = FileController();

  const [files, setFiles] = useState<any[]>([]);

  const HandleFetchAllFiles = async () => {
    const resp = await GetAllCopiedFiles();
    if (resp) {
      setFiles(resp);
      console.log('files: ', resp);
    }
  };

  const HandleOnDelete = (filename: any) => {
    console.log('filename: ', filename);
    HandleDeleteFile(filename);
    HandleFetchAllFiles();
  };

  useEffect(() => {
    HandleFetchAllFiles();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.plusButtonContainer}>
        <Pressable onPress={() => navigation.navigate('EditFile')}>
          <View style={styles.plusButtonBox}>
            <Text style={styles.plusButtonText}>+</Text>
          </View>
        </Pressable>
      </View>
      {files.length > 0 ? (
        <FlatList
          data={files}
          showsVerticalScrollIndicator={false}
          keyExtractor={index => index.toString()}
          renderItem={item => (
            <View style={styles.card}>
              <Text style={styles.cardText}>
                {item.item.substring(item.item.lastIndexOf('/') + 1)}
              </Text>
              <Pressable
                onPress={() =>
                  HandleOnDelete(
                    item.item.substring(item.item.lastIndexOf('/') + 1),
                  )
                }>
                <View style={styles.cardButton}>
                  <Text style={styles.cardButtonText}>Delete</Text>
                </View>
              </Pressable>
            </View>
          )}
        />
      ) : (
        <Text>No Notes Found!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  plusButtonContainer: {
    position: 'absolute',
    zIndex: 1,
    bottom: 30,
    right: 15,
  },
  plusButtonBox: {
    flex: 1,
    height: 55,
    width: 55,
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#4d91ff',
  },
  plusButtonText: {
    fontSize: 38,
    color: '#ffffff',
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginVertical: 8,
    backgroundColor: '#b1fcf0',
    borderRadius: 24,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
  },
  cardButton: {},
  cardButtonText: {
    fontSize: 14,
    color: 'red',
  },
});

export default Home;
