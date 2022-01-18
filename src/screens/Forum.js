import { StyleSheet, Text, View, ActivityIndicator, StatusBar } from 'react-native';

export default function Forum () {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#09dd' barStyle='light-content' />
      <ActivityIndicator size="large" color='#09dd' />
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