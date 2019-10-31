import React from 'react';
import { ScrollView, StyleSheet, StatusBar } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default function LinksScreen() {
  return (
    <ScrollView style={styles.container}>
      {/**
       * Go ahead and delete ExpoLinksView and replace it with your content;
       * we just wanted to provide you with some helpful links.
       */}
      <ExpoLinksView />
    </ScrollView>
  );
}

LinksScreen.navigationOptions = {
  title: 'Links',
  headerStyle: {
    display: 'none',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight
  },
});
