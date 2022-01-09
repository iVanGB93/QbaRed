import { StyleSheet, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Contactos from './Contactos';
import Usuarios from './Usuarios';

const Tab = createMaterialTopTabNavigator();

export default function Chat() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Usuarios" component={Usuarios} />
      <Tab.Screen name="Contactos" component={Contactos} />
    </Tab.Navigator>
  );
};