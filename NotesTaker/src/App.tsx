import {Pressable, StatusBar, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import EditFile from './screens/EditFile';
import Home from './screens/Home';
import {FileController} from './controller/FileController';

export type RootParamList = {
  Home: {refresh: boolean};
  EditFile: undefined;
};

const Stack = createNativeStackNavigator<RootParamList>();
const App = () => {
  const {HandleDeleteAllFile} = FileController();

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#5c6bc0" barStyle="light-content" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {backgroundColor: '#5c6bc0'}, // #536dfe
          headerTitleStyle: {color: 'white'},
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={({navigation}) => ({
            headerRight: () => (
              <Pressable
                onPress={async () => {
                  await HandleDeleteAllFile(); // Delete all files
                  navigation.setParams({refresh: true}); // Trigger refresh in Home
                }}>
                <View
                  style={{
                    backgroundColor: '#8c9eff',
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 14, color: 'red'}}>Delete All</Text>
                </View>
              </Pressable>
            ),
          })}
        />
        <Stack.Screen name="EditFile" component={EditFile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
