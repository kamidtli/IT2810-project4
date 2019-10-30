import React, { useState } from 'react';
import {
  TouchableHighlight,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView
} from 'react-native';
import { Text, Image } from 'react-native-elements';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

function Item({ title, poster, rating }) {
  return (
    <View style={styles.item}>
      <Image style={styles.itemImage} source={{ uri: poster }} />
      <View style={styles.itemText}>
        <Text style={styles.itemTextTitle}>{title}</Text>
        <Text>{rating}</Text>
      </View>
    </View>
  );
}

function MovieDetail({ movieID, title, poster, rating }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const defaultData = {
    movie: {
      _id: '00000000',
      title: 'Title',
      year: 2000,
      poster:
        'https://i.pinimg.com/originals/72/24/f6/7224f6d53614cedbf8cef516b705a555.jpg',
      fullplot: 'Plot is not available',
      imdb: {
        rating: '5.0'
      },
      directors: ['Director'],
      genres: ['Genre']
    }
  };
  const [qdata, setData] = useState(defaultData);

  const SEARCH_QUERY = gql`
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

  const handleWatchlistClick = event => {
    if (event === 'add') {
      setIsInWatchlist(true);
      props.addToWatchlist({type: 'ADD_TO_WATCHLIST', movieID})
    } else {
      setIsInWatchlist(false);
      props.removeFromWatchlist({type: 'REMOVE_FROM_WATCHLIST', movieID})
    }
  };

  const { data, loading, error } = useQuery(SEARCH_QUERY);
  if (loading)
    return (
      <View>
        <ActivityIndicator size='large' color='#F6AE2D' />
      </View>
    );
  if (error) return <p>{error.message}</p>;
  if (data && qdata.movie.title === 'Title') {
    console.log(data);
    setData(data);
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType='slide'
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        propagateSwipe
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.navbar}>
            <TouchableHighlight
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
            </TouchableHighlight>
            {!isInWatchlist ? (
              <TouchableHighlight
                onPress={() => {
                  handleWatchlistClick('add');
                }}
              >
                <Icon reverse name='plus' type='evilicon' color='#F6AE2D' />
              </TouchableHighlight>
            ) : (
              <TouchableHighlight
                onPress={() => {
                  setIsInWatchlist(false);
                }}
              >
                <Icon reverse name='minus' type='evilicon' color='#F6AE2D' />
              </TouchableHighlight>
            )}
          </View>
          <Text h1 style={styles.title}>
            {qdata.movie.title}
          </Text>
          <Image
            style={styles.image}
            source={{
              uri: qdata.movie.poster
            }}
            PlaceholderContent={<ActivityIndicator />}
          />

          <View>
            <Text h4>Released: {qdata.movie.year}</Text>
            <Text h4>IMDb rating: {qdata.movie.imdb.rating}</Text>
            <Text h4>Director: {qdata.movie.directors[0]}</Text>
            <Text h4>
              Genre: <Text h5>{qdata.movie.genres[0]}</Text>
            </Text>
            <Text h4>Plot:</Text>
            <Text h6>{qdata.movie.fullplot}</Text>
          </View>
        </ScrollView>
      </Modal>

      <TouchableHighlight
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <View>
          <Item
            title={title}
            poster={
              poster ||
              'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1340&q=80'
            }
            rating={rating}
          />
        </View>
      </TouchableHighlight>
    </View>
  );
}

const mapDispatchToProps = dispatch => ({
  addToWatchlist: movie => dispatch({ type: 'WATCHLIST_ADD', movie }),
  removeFromWatchlist: movie => dispatch({ type: 'WATCHLIST_REMOVE', movie })
});

const mapStateToProps

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MovieDetail);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ede3f2',
    padding: 100
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7021a',
    padding: 100
  },
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'center'
  },
  navbar: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'stretch',
    flexWrap: 'nowrap',
    justifyContent: 'space-between'
  },
  title: {
    margin: 15
  },
  image: {
    width: 240,
    height: 360
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 16,
    marginHorizontal: 16,
    width: Dimensions.get('window').width - 32 // Subtract 2 times horizontal margin
  },
  itemImage: {
    width: 150,
    height: 225,
    marginRight: 10
  },
  itemTextTitle: {
    fontSize: 24
  }
});
