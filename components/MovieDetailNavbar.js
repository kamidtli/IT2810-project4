import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import {Text, Image, Divider} from 'react-native-elements';
import Modal from 'react-native-modal';
import {Icon} from 'react-native-elements';
import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';
import theme from '../theme';


MovieDetailNavbar = (props) => {
  const {
    isModalVisible,
    setModalVisible,
    watchlist,
    movie: {
      _id,
      title,
      poster,
      imdb: {
        rating,
      },
    },
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistValue,
  } = props;
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    //  Check if movie is in watchlist
    if (watchlist && watchlist.some((movie) => movie._id === _id)) {
      setIsInWatchlist(true);
    } else {
      // This else is needed incase a movie was removed from the watchlist from the watchlist-page
      setIsInWatchlist(false);
    }
  }, [isModalVisible]);

  // Handle 'add' and 'remove' watchlist-buttons
  const handleWatchlistClick = (event) => {
    updateWatchlistValue(true); // Makes sure the watchlist is properly updated when opening the watchlist-page next time
    if (event === 'add') {
      setIsInWatchlist(true); // Internal state
      storeData(); //  AsyncStorage
      addToWatchlist({
        _id: _id,
        title: title,
        poster: poster,
        imdb: {
          rating: rating,
        },
      }); //  Redux store
    } else {
      removeData(); //  AsyncStorage
      setIsInWatchlist(false); // Internal state
      removeFromWatchlist(_id); //  Redux store
    }
  };

  // Add movie to watchlist in AsyncStorage
  const storeData = async () => {
    try {
      await AsyncStorage.setItem(
          'Watchlist',
          JSON.stringify([
            ...watchlist,
            {
              _id: _id,
              title: title,
              poster: poster,
              imdb: {
                rating: rating,
              },
            },
          ]),
      );
    } catch (error) {
      // Alert user about error adding movie
      Alert.alert(
          'An error has occured',
          'Could not add movie to AsyncStorage.',
      );
    }
  };

  // Remove movie from watchlist in AsyncStorage
  const removeData = async () => {
    try {
      await AsyncStorage.setItem(
          'Watchlist',
          JSON.stringify([...watchlist].filter((movie) => movie._id !== _id)),
      );
    } catch (error) {
      // Alert user about error removing movie
      Alert.alert(
          'An error has occured',
          'Could not remove movie from AsyncStorage.',
      );
    }
  };

  return (
    <SafeAreaView>
      <View style={[styles.navbar, backgroundColor=theme.colors.primary]}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <Icon
            size={30}
            name='arrow-back'
            type='material'
          />
        </TouchableOpacity>
        {!isInWatchlist ? (
        <TouchableOpacity
          onPress={() => {
            handleWatchlistClick('add');
          }}
        >
          <Icon
            size={30}
            name='add-circle'
            type='material'
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            handleWatchlistClick('remove');
          }}
        >
          <Icon
            size={30}
            name='remove-circle'
            type='material'/>
        </TouchableOpacity>
      )}
      </View>
    </SafeAreaView>
  );
};

const mapDispatchToProps = (dispatch) => ({
  addToWatchlist: (movie) => dispatch({type: 'ADD_TO_WATCHLIST', movie}),
  removeFromWatchlist: (_id) =>
    dispatch({type: 'REMOVE_FROM_WATCHLIST', _id}),
  updateWatchlistValue: (value) => dispatch({type: 'UPDATE_WATCHLIST', value}),

});

const mapStateToProps = (state) => ({
  watchlist: state.watchlist,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MovieDetailNavbar);

const styles = StyleSheet.create({
  navbar: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'stretch',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 30,
  },
});
