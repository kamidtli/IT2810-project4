import React, { useState } from 'react';
import {
  TouchableHighlight,
  View,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView
} from 'react-native';
import { Text, Image } from 'react-native-elements';
import Modal from 'react-native-modal';
import { Icon, Divider } from 'react-native-elements';
import { classes } from 'istanbul-lib-coverage';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

function Item({title, poster, rating}) {
  return (
    <View style={styles.item}>
      <Image style={styles.itemImage} source={{uri: poster}} />
      <View style={styles.itemText}>
        <Text style={styles.itemTextTitle}>{title}</Text>
        <View style={styles.itemRating}>
          <Icon 
            name="star"
            type="ion-icon"
          />
          <Text>{rating}/10</Text>
        </View>
      </View>
    </View>
  )
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
                  setIsInWatchlist(true);
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
        <Item
          title={title}
          poster={
            poster ||
            'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1340&q=80'
          }
          rating={rating}
          />
      </TouchableHighlight>
    </View>
  );
}

export default MovieDetail;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
    marginVertical: 16,
    marginHorizontal: 16,
    width: Dimensions.get('window').width - 32, // Subtract 2 times horizontal margin
    height: Dimensions.get("window").height / 5, // Divide by the number of results per screen height
  },
  itemImage: {
    flex: 1,
    // width: undefined, // Undefined to fit container
    // height: undefined, // Undefined to fit container
    // resizeMode: "cover", // Scales up images until it fits container, keeping aspect ratio
    marginRight: 120,
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
