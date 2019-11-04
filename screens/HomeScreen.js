import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  AsyncStorage
} from 'react-native';
import { SearchBar, Divider } from 'react-native-elements';
import Results from '../components/Results';

function HomeScreen(props) {
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

  const updateSearch = search => {
    setSearch(search);
    props.updateSkip(0);
  };

  const handleClearSearch = () => {
    updateSearch("");
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        platform={Platform.OS === 'ios' ? 'ios' : 'android'}
        placeholder='Search...'
        onChangeText={updateSearch}
        onClear={handleClearSearch}
        value={search}
        style={styles.searchBar}
      />
      <Divider />
      <Results query={search} />
    </SafeAreaView>
  );
}

// Removes top navigation
HomeScreen.navigationOptions = {
  headerStyle: {
    display: 'none'
  }
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  createWatchlist: movies => dispatch({ type: 'CREATE_WATCHLIST', movies }),
  updateSkip: skipValue => dispatch({ type: 'UPDATE_SKIP', skipValue })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight
  }
});
