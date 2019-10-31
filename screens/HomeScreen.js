import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform } from 'react-native';
import {SearchBar, Divider} from 'react-native-elements';
import Results from '../components/Results';

export default function HomeScreen() {
  const [search, setSearch] = useState('');

  updateSearch = search => {
    setSearch(search);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        platform={Platform.OS === 'ios' ? 'ios' : 'android'}
        placeholder="Search..."
        onChangeText={this.updateSearch}
        value={search}
        style={styles.searchBar}
      />
      <Divider />
      <Results query={search} />
  </SafeAreaView>
  )
}

// Removes top navigation
HomeScreen.navigationOptions = {
  headerStyle: {
    display: 'none',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});
