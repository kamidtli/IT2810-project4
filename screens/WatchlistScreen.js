import React, {useState} from 'react';
import {connect} from 'react-redux';
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
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import MovieDetail from '../components/MovieDetail';

function WatchlistScreen(props) {
  const [refreshing, setRefreshing] = useState(false);

  // The function that is called when the list is pulled down for refresh
  const _onRefresh = async () => {
    setRefreshing(true);
    fetchAsync();
    setRefreshing(false);
  };

  // Fetches the watchlist from the AsyncStorage
  const fetchAsync = async () => {
    try {
      await AsyncStorage.getItem('Watchlist').then((data) => {
        JSON.parse(data) ?
          props.createWatchlist(JSON.parse(data)) :
          props.createWatchlist([]);
      });
    } catch (error) {
      // Alert user about error fetching watchlist from AsyncStorage
      Alert.alert(
          'An error has occured',
          'Could not refetch watchlist from AsyncStorage.',
      );
    }
  };

  // Makes sure the watchlist is properly refreshed when when a new movie was added
  if (props.updateWatchlist) {
    props.updateWatchlistValue(false);
    fetchAsync();
  }

  const renderHeaderComponent = () => {
    return (
      <View>
        <Icon name='robot' type='material-community' size={45} />
        <Text h3 style={styles.info}>
          Watchlist is empty. Add movies to your watchlist or pull to refresh
        </Text>
      </View>
    );
  };

  if (props.watchlist.length === 0) {
    return (
      <View style={styles.flexContainter}>
        <FlatList
          style={styles.list}
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
          renderItem={({item}) => (
            <View>
              <MovieDetail
                movie={item}
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={this.renderDivider}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
          }
        />
      </SafeAreaView>
    );
  }
}

WatchlistScreen.navigationOptions = {
  title: 'Your Watchlist',
  headerTitleStyle: {
    flex: 1,
  },
};

const mapStateToProps = (state) => ({
  watchlist: state.watchlist,
  updateWatchlist: state.updateWatchlist,
});

const mapDispatchToProps = (dispatch) => ({
  createWatchlist: (movies) => dispatch({type: 'CREATE_WATCHLIST', movies}),
  updateWatchlistValue: (value) => dispatch({type: 'UPDATE_WATCHLIST', value}),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(WatchlistScreen);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight,
  },
  info: {
    paddingHorizontal: 50,
  },
  flexContainter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
