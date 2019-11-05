import React, {useState} from 'react';
import {connect} from 'react-redux';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Text, Image, Divider} from 'react-native-elements';
import Modal from 'react-native-modal';
import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';
import theme from '../theme';
import Item from './ClosedModalItem';
import MovieDetailNavbar from './MovieDetailNavbar';

export default MovieDetail = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {
    movie,
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
    movie (_id: "${movie._id}") {
      _id
      fullplot
      year
      genres
      directors
    }
  }
  `;

  // By using lazyQuery the rest of the data is not fetched before the modal is opened
  const [fetchMovie, {data, error}] = useLazyQuery(MOVIE_QUERY);

  // If data has been fetched, and the default values haven't been changed then change data state.
  if (data && query_data.movie.title === 'Title') {
    setData(data);
  }

  // Run when the modal is opened
  const onMovieSelect = () => {
    setModalVisible(true);
    fetchMovie();
  };

  //  If query results in an error, then alert user.
  if (error) {
    Alert.alert('An error has occured', 'Could not fetch data.');
  }

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
          <MovieDetailNavbar
            isModalVisible={modalVisible}
            setModalVisible={setModalVisible}
            movie={movie}
          />
          <Divider />
          <Text h3 style={styles.title}>{movie.title}</Text>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri: movie.poster,
              }}
              PlaceholderContent={<ActivityIndicator />}
            />
          </View>

          <View style={styles.infoContainer}>
            {query_data.movie.year ? <Text style={styles.info}>{query_data.movie.year}</Text> : <View />}
            {movie.imdb.rating ? <Text style={styles.info}>IMDB: {movie.imdb.rating}</Text> : <View />}
            {query_data.movie.genres ? <Text style={styles.info}>{query_data.movie.genres[0]}</Text> : <View />}
            {query_data.movie.directors ? <Text style={styles.info}>{query_data.movie.directors[0]}</Text> : <View />}
            <Divider style={{marginVertical: 16}}/>
            <Text style={{textAlign: 'justify'}}>{query_data.movie.fullplot}</Text>
          </View>
        </ScrollView>
      </Modal>

      <TouchableOpacity
        onPress={() => {
          onMovieSelect();
        }}
      >
        <Item
          title={movie.title}
          poster={
            movie.poster ||
            'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1340&q=80'
          }
          rating={movie.imdb.rating}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.8 / 0.67,
  },
  title: {
    margin: 16,
  },
  infoContainer: {
    padding: 16,
  },
  info: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
