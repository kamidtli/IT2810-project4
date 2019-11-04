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
  AsyncStorage,
  Dimensions
} from 'react-native';
import { Icon } from 'react-native-elements';
import MovieDetail from '../components/MovieDetail';

function WatchlistScreen(props) {
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

  const renderHeaderComponent = () => {
    return (
      <View>
        <Icon name='robot' type='material-community' size={45} />
        <Text h3>
          Watchlist is empty. Add movies to your watchlist or pull to refresh
        </Text>
      </View>
    );
  };

  if (props.watchlist.length === 0) {
    return (
      <View style={styles.flexContainter}>
        <FlatList
          ListHeaderComponent={renderHeaderComponent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
          }
        />
      </View>
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

// Removes top navigation
WatchlistScreen.navigationOptions = {
  title: 'Your Watchlist'
};

const mapStateToProps = state => ({
  watchlist: state.watchlist
});

const mapDispatchToProps = dispatch => ({
  createWatchlist: movies => dispatch({ type: 'CREATE_WATCHLIST', movies })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WatchlistScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight
  },
  flexContainter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50
  }
});
