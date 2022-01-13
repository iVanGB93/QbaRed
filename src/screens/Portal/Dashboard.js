import { StyleSheet, Text, View, StatusBar } from 'react-native';

export default function Dashboard () {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#d02860' barStyle='light-content' />
      <Text>DASHBOARD SCREEN!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});