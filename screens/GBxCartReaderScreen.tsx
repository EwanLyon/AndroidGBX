import { Button, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import { GbxDevice } from '../gbxcart/hw_GBxCartRW';

export default function GBxCartReaderScreen({ navigation }: RootTabScreenProps<'GBxCartReader'>) {

  const Connect = () => {
    const device = new GbxDevice();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Read GBxCart</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button onPress={Connect} title="Connect" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
