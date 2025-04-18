import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './redux/store/store.js';
// import Login from './screens/Auth/Login.js';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './screens/home/HomeScreen.js';
import Toast from 'react-native-toast-message';
import Classroom from './screens/class/Classroom.js';
import History from './screens/history/History.js';
import SubjectScreen from './screens/subject/SubjectScreen.js';



const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <SafeAreaView className="flex-1" >
            <Stack.Navigator screenOptions={{  //initialRouteName="Login"
              headerShown: false
            }}>
              {/* <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              /> */}
              <Stack.Screen
                name="Home"
                component={HomeScreen}
              />
              <Stack.Screen
                name="Classroom"
                component={Classroom}
              />
              <Stack.Screen
                name="Subjects"
                component={SubjectScreen}
              />
              <Stack.Screen
                name="History"
                component={History}
              />
            </Stack.Navigator>
            <StatusBar style="auto" />
          </SafeAreaView>
          <Toast />
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}