import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../Home';
import Forum from '../Forum';
import Portal from '../Portal/Portal';
import Chat from '../Chat/Chat';

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
            size = focused ? 25 : 20;
          } else if (route.name === 'Forum') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
            size = focused ? 25 : 20;
          } else if (route.name === 'Portal') {
            iconName = focused ? 'construct' : 'construct-outline';
            size = focused ? 25 : 20;
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
            size = focused ? 25 : 20;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Forum" component={Forum} />
      <Tab.Screen name="Portal" component={Portal} />
      <Tab.Screen name="Chat" component={Chat} />
    </Tab.Navigator>   
  );
};
