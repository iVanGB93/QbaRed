import { StyleSheet, Text, View } from 'react-native';

export default function Dashboard () {
  return (
    <View style={styles.container}>
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