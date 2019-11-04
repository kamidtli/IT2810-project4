import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  SafeAreaView,
  View,
  Alert,
  FlatList,
  Text,
  StyleSheet,
  StatusBar,
  RefreshControl,
  AsyncStorage
} from 'react-native';
import MovieDetail from '../components/MovieDetail';

function LinksScreen(props) {
  const [refreshing, setRefreshing] = useState(false);

  // The function that is called when the list is pulled down for refresh
  const _onRefresh = async () => {
    setRefreshing(true);
    try {
      await AsyncStorage.getItem('Watchlist')
        .then(data => {
          JSON.parse(data)
            ? props.createWatchlist(JSON.parse(data))
            : props.createWatchlist([]);
        })
        .then(() => setRefreshing(false));
    } catch (error) {
      // Alert user about error fetching watchlist from AsyncStorage
      Alert.alert(
        'An error has occured',
        'Could not refetch watchlist from AsyncStorage.'
      );
      setRefreshing(false);
    }
  };

  if (!props.watchlist) {
    return (
      <SafeAreaView style={styles.container}>
        <Text h1>No videos in watchlist</Text>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={props.watchlist}
          renderItem={({ item }) => (
            <View>
              <MovieDetail
                movieID={item._id}
                title={item.title}
                rating={item.imdb.rating}
                poster={item.poster}
              />
            </View>
          )}
          keyExtractor={item => item._id}
          ItemSeparatorComponent={this.renderDivider}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
          }
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  watchlist: state.watchlist
});

const mapDispatchToProps = dispatch => ({
  createWatchlist: movies => dispatch({ type: 'CREATE_WATCHLIST', movies })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinksScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight
  }
});
