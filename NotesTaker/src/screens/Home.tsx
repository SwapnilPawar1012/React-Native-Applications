import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FileController} from '../controller/FileController';

const Home = ({navigation, route}: any) => {
  const {HandleDeleteFile, HandleFetchFiles} = FileController();

  const [files, setFiles] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const HandleFetchAllFiles = async () => {
    const resp = await HandleFetchFiles();
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

  // Listen for refresh prop changes
  useEffect(() => {
    if (route.params?.refresh) {
      HandleFetchAllFiles();
      navigation.setParams({refresh: false}); // Reset param after refresh
    }
  }, [route.params?.refresh]);

  return (
    <View style={styles.container}>
      <View style={styles.plusButtonContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate('EditFile');
            setTimeout(() => HandleFetchAllFiles(), 1000);
          }}>
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={HandleFetchAllFiles}
            />
          }
          renderItem={({item}) => (
            <Pressable
              onPress={() => {
                navigation.navigate('EditFile', {
                  fileName: item.substring(item.lastIndexOf('/') + 1),
                }); // Pass the item
              }}>
              <View style={styles.card}>
                <Text style={styles.cardText}>
                  {item.substring(item.lastIndexOf('/') + 1)}
                </Text>
                <Pressable
                  onPress={() => {
                    HandleOnDelete(item.substring(item.lastIndexOf('/') + 1));
                    setTimeout(() => HandleFetchAllFiles(), 1000);
                  }}>
                  <View style={styles.cardButton}>
                    <Text style={styles.cardButtonText}>Delete</Text>
                  </View>
                </Pressable>
              </View>
            </Pressable>
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
    marginHorizontal: 10,
    marginVertical: 10,
  },
  plusButtonContainer: {
    position: 'absolute',
    zIndex: 1,
    bottom: 30,
    right: 25,
  },
  plusButtonBox: {
    flex: 1,
    height: 55,
    width: 55,
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#5c6bc0',
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
    backgroundColor: '#c5cae9',
    borderRadius: 28,
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
