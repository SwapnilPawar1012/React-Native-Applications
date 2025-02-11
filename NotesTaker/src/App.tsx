import {StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import EditFile from './screens/EditFile';
import Home from './screens/Home';

export type RootParamList = {
  Home: undefined;
  EditFile: undefined;
};

const Stack = createNativeStackNavigator<RootParamList>();
const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#ccc" barStyle="dark-content" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {backgroundColor: '#ccc'},
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="EditFile" component={EditFile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
