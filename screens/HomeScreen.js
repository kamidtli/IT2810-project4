import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform } from 'react-native';
import {SearchBar, Divider} from 'react-native-elements';
import Results from '../components/Results';

export default function HomeScreen() {
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      const fetchAsync = async () => {
        await AsyncStorage.getItem('Watchlist').then(data => {
          JSON.parse(data)
            ? props.createWatchlist(JSON.parse(data))
            : props.createWatchlist([]); // If data is null, the redux store watchlist is initialized as empty list
        });
      };
      fetchAsync();
    } catch (error) {
      // Alert user about error fetching watchlist from AsyncStorage
      Alert.alert(
        'An error has occured',
        'Could not fetch watchlist from AsyncStorage.'
      );
    }
  }, []);

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
