import React, {useState} from 'react';
import {connect} from 'react-redux';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  AsyncStorage,
} from 'react-native';
import {Text, Image} from 'react-native-elements';
import Modal from 'react-native-modal';
import {Icon} from 'react-native-elements';
import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';

function Item({title, poster, rating}) {
  return (
    <View style={styles.item}>
      <View style={styles.itemImageContainer}>
        <Image style={styles.itemImage} source={{uri: poster}} />
      </View>
      <View style={styles.itemText}>
        <Text style={styles.itemTextTitle}>{title}</Text>
        <View style={styles.itemRating}>
          <Icon name='star' type='ion-icon' />
          <Text>{rating}/10</Text>
        </View>
      </View>
    </View>
  );
}

function MovieDetail(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const {
    movieID,
    title,
    poster,
    rating,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
  } = props;

  // Need to define default data, because the actual data is not fetched before the modal is opened
  const defaultData = {
    movie: {
      _id: '00000000',
      title: 'Title',
      year: 2000,
      poster:
        'https://i.pinimg.com/originals/72/24/f6/7224f6d53614cedbf8cef516b705a555.jpg',
      fullplot: 'Plot is not available',
      imdb: {
        rating: '5.0',
      },
      directors: ['Director'],
      genres: ['Genre'],
    },
  };
  const [query_data, setData] = useState(defaultData);

  const MOVIE_QUERY = gql`
  {
    movie (_id: "${movieID}") {
      _id
      title
      fullplot
      poster
      year
      genres
      directors
      imdb {
        rating
      }
    }
  }
  `;

  // By using lazyQuery the rest of the data is not fetched before the modal is opened
  const [fetchMovie, {data, error, called}] = useLazyQuery(MOVIE_QUERY);

  // If data has been fetched, and the default values haven't been changed then change data state.
  if (data && query_data.movie.title === 'Title') {
    setData(data);
  }

  const onMovieSelect = () => {
    fetchMovie();
    //  Check if movie is in watchlist
    if (watchlist && watchlist.some((movie) => movie._id === movieID)) {
      setIsInWatchlist(true);
    } else {
      // This else is needed incase a movie was removed from the watchlist from the watchlist-page
      setIsInWatchlist(false);
    }
  };

  //  If query results in an error, then alert user.
  if (error) {
    Alert.alert('An error has occured', 'Could not fetch data.');
  }

  // Add movie to watchlist in AsyncStorage
  const storeData = async () => {
    try {
      await AsyncStorage.setItem(
          'Watchlist',
          JSON.stringify([
            ...watchlist,
            {
              _id: movieID,
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
  removeData = async () => {
    try {
      await AsyncStorage.setItem(
          'Watchlist',
          JSON.stringify([...watchlist].filter((movie) => movie._id !== movieID)),
      );
    } catch (error) {
      // Alert user about error removing movie
      Alert.alert(
          'An error has occured',
          'Could not remove movie from AsyncStorage.',
      );
    }
  };

  // Handle 'add' and 'remove' watchlist-buttons
  const handleWatchlistClick = (event) => {
    if (event === 'add') {
      props.updateWatchlistValue(true); // Makes sure the watchlist is properly updated when opening the watchlist-page next time
      setIsInWatchlist(true); // Internal state
      storeData(); //  AsyncStorage
      addToWatchlist({
        _id: movieID,
        title: title,
        poster: poster,
        imdb: {
          rating: rating,
        },
      }); //  Redux store
    } else {
      removeData(); //  AsyncStorage
      setIsInWatchlist(false); // Internal state
      removeFromWatchlist(movieID); //  Redux store
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType='slide'
        transparent={false}
        style={styles.modal}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        propagateSwipe
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.navbar}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Icon
                reverse
                name='chevron-left'
                type='evilicon'
                color='#F6AE2D'
              />
            </TouchableOpacity>
            {!isInWatchlist ? (
              <TouchableOpacity
                onPress={() => {
                  handleWatchlistClick('add');
                }}
              >
                <Icon reverse name='plus' type='evilicon' color='#F6AE2D' />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  handleWatchlistClick('remove');
                }}
              >
                <Icon reverse name='minus' type='evilicon' color='#F6AE2D' />
              </TouchableOpacity>
            )}
          </View>
          <Text h1 style={styles.title}>
            {query_data.movie.title}
          </Text>
          <Image
            style={styles.image}
            source={{
              uri: query_data.movie.poster,
            }}
            PlaceholderContent={<ActivityIndicator />}
          />

          <View>
            <Text h4>Released: {query_data.movie.year}</Text>
            <Text h4>IMDb rating: {query_data.movie.imdb.rating}</Text>
            <Text h4>Director: {query_data.movie.directors[0]}</Text>
            <Text h4>
              Genre: <Text h5>{query_data.movie.genres[0]}</Text>
            </Text>
            <Text h4>Plot:</Text>
            <Text h6>{query_data.movie.fullplot}</Text>
          </View>
        </ScrollView>
      </Modal>

      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
          onMovieSelect();
        }}
      >
        <Item
          title={title}
          poster={
            poster ||
            'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1340&q=80'
          }
          rating={rating}
        />
      </TouchableOpacity>
    </View>
  );
}

const mapDispatchToProps = (dispatch) => ({
  addToWatchlist: (movie) => dispatch({type: 'ADD_TO_WATCHLIST', movie}),
  removeFromWatchlist: (movieID) =>
    dispatch({type: 'REMOVE_FROM_WATCHLIST', movieID}),
  updateWatchlistValue: (value) => dispatch({type: 'UPDATE_WATCHLIST', value}), 
});

const mapStateToProps = (state) => ({
  watchlist: state.watchlist,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MovieDetail);

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'center',
    width: '100%',
    padding: 30,
    paddingTop: 10,
  },
  navbar: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'stretch',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  title: {
    margin: 15,
  },
  image: {
    width: 240,
    height: 360,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 16,
    marginHorizontal: 16,
    width: Dimensions.get('window').width - 32, // Subtract 2 times horizontal margin
    height: Dimensions.get('window').height / 5, // Divide by the number of results per screen height
  },
  itemImageContainer: {
    flex: 1,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemText: {
    flex: 2,
    padding: 10,
    justifyContent: 'space-between',
  },
  itemRating: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemTextTitle: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 24,
  },
});
