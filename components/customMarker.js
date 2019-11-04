import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native-elements';

export default function CustomMarker({currentValue}) {
  return (
    <TouchableOpacity>
      <View style={{justifyContent: 'center'}}>
        <View style={styles.container}>
        </View>
        <Text>
          {currentValue}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'grey',
    marginTop: 20,
  },
});
