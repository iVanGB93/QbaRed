import { createDrawerNavigator } from '@react-navigation/drawer';

import Dashboard from './Dashboard';
import Internet from './Internet';

const Drawer = createDrawerNavigator();

export default function Portal() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Internet" component={Internet} />
    </Drawer.Navigator>
  );
};