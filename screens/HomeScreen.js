import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  View,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';
import { SearchBar, Divider, Icon } from 'react-native-elements';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';
import MovieDetail from '../components/MovieDetail';

const DATA = {
  data: {
    findMoviesBasedOnYearRange: [
      {
        _id: '573a13f8f29313caabde8d7a',
        title: 'The Treasure',
        plot:
          'Costi leads a peaceful life. At night he likes to read his 6-year-old son stories, to help him sleep. Their favourite is Robin Hood. Costi sees himself as the hero - righter of wrongs and ...',
        poster:
          'https://m.media-amazon.com/images/M/MV5BMTUzNjIyOTU1Ml5BMl5BanBnXkFtZTgwMjEzNzI2NzE@._V1_SY1000_SX677_AL_.jpg',
        imdb: {
          rating: '7.5'
        }
      },
      {
        _id: '573a13d6f29313caabda10e6',
        title: 'Knight of Cups',
        plot:
          'A screenwriter living in LA tries to make sense of the strange events occurring around him.',
        poster:
          'https://m.media-amazon.com/images/M/MV5BMjQyOTcwODIyNF5BMl5BanBnXkFtZTgwMDE4OTI4NzE@._V1_SY1000_SX677_AL_.jpg',
        imdb: {
          rating: '7.1'
        }
      },
      {
        _id: '573a13f4f29313caabde0bfd',
        title: 'Shut In',
        plot:
          "Anna suffers from agoraphobia so crippling that when a trio of criminals break into her house, she cannot bring herself to flee. But what the intruders don't realize is that agoraphobia is not her only psychosis.",
        poster:
          'https://m.media-amazon.com/images/M/MV5BMTY5MzE0MjUwNV5BMl5BanBnXkFtZTgwNjQxNzM2NzE@._V1_SY1000_SX677_AL_.jpg',
        imdb: {
          rating: '7.1'
        }
      },
      {
        _id: '573a13f7f29313caabde74df',
        title: 'Dègradè',
        plot:
          "A hot summer's day in the Gaza Strip. Today the electricity is on. Christine's beauty salon is heaving with female clients: a bride-to-be, a pregnant woman, a bitter divorcèe, a devout ...",
        poster: null,
        imdb: {
          rating: '6.5'
        }
      },
      {
        _id: '573a13f9f29313caabdeb527',
        title: 'Land and Shade',
        plot:
          'After having left a long time ago, a humble country sugar cane worker returns home to meet his grandson and deal with the hardships his family has been put into.',
        poster:
          'https://m.media-amazon.com/images/M/MV5BMTUwZTM3M2ItZWM2Ny00ZDUwLWIzYzEtMWVmODc2NzYwODE1XkEyXkFqcGdeQXVyNjQ0NTQwNjk@._V1_SY1000_SX677_AL_.jpg',
        imdb: {
          rating: '7.6'
        }
      },
      {
        _id: '573a13f0f29313caabdd969c',
        title: 'Remember',
        plot:
          'The darkest chapter of the 20th century collides with a contemporary mission of revenge.',
        poster:
          'https://m.media-amazon.com/images/M/MV5BMjM3OTY3Njc1OV5BMl5BanBnXkFtZTgwNDY0MzE1NzE@._V1_SY1000_SX677_AL_.jpg',
        imdb: {
          rating: '7.4'
        }
      },
      {
        _id: '573a13f2f29313caabddd3b6',
        title: 'Bang Gang (A Modern Love Story)',
        plot:
          'In the well-to-do suburbs of a small town, a group of pretty average, well-adjusted sixteen and seventeen year olds are ordinary adolescents who take a singular path.',
        poster: null,
        imdb: {
          rating: '6.1'
        }
      },
      {
        _id: '573a13e9f29313caabdcc6c6',
        title: 'Equals',
        plot:
          'A futuristic love story set in a world where emotions have been eradicated.',
        poster:
          'https://m.media-amazon.com/images/M/MV5BMTg3NTQ5MDU3OF5BMl5BanBnXkFtZTgwODc2Mzk5NzE@._V1_SY1000_SX677_AL_.jpg',
        imdb: {
          rating: '6.3'
        }
      },
      {
        _id: '573a13f0f29313caabdda7ac',
        title: 'Mountains May Depart',
        plot:
          'China, 1999. Childhood friends Liangzi and Zhang are both in love with Tao, the town beauty. Tao eventually decides to marry the wealthier Zhang. They soon have a son he names Dollar... ...',
        poster:
          'https://m.media-amazon.com/images/M/MV5BMjMwNjgyMjk1OV5BMl5BanBnXkFtZTgwMzgzNDc5NzE@._V1_SY1000_SX677_AL_.jpg',
        imdb: {
          rating: '6.6'
        }
      }
    ]
  }
};

const DEFAULT_QUERY = gql`
  {
    findMoviesBasedOnYearRange(
      min: 2015
      max: 2019
      sort: "-released"
      pagination: 12
      skip: 0
    ) {
      _id
      title
      plot
      poster
      imdb {
        rating
      }
    }
  }
`;

const SEARCH_QUERY = gql`
  query searchQuery($searchValue: String!) {
    filterMovies(
      searchValue: $searchValue
      genre: ""
      yearRange: [1980, 2019]
      ratingRange: [5, 10]
      sort: "-imdb"
      pagination: 12
      skip: 0
    ) {
      _id
      title
      poster
      imdb {
        rating
      }
    }
  }
`;

function App(props) {
  const [search, setSearch] = useState('');
  const [toSearch, setToSearch] = useState(false);
  const [
    getDefaultResults,
    { called: defaultCalled, loading: defaultLoading, data: defaultData }
  ] = useLazyQuery(DEFAULT_QUERY);
  const [getResults, { called, loading, data }] = useLazyQuery(SEARCH_QUERY, {
    variables: { searchValue: search }
  });

  renderDivider = () => {
    return <Divider />;
  };

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
    setToSearch(false);
  };

  // Called when user submits search value
  runSearchQuery = () => {
    getResults();
    setToSearch(true);
  };

  if (toSearch && called && loading) return <ActivityIndicator size='large' />;

  const results =
    toSearch && called
      ? data.filterMovies
      : DATA.data.findMoviesBasedOnYearRange;

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder='Search...'
        onChangeText={this.updateSearch}
        onSubmitEditing={this.runSearchQuery}
        value={search}
      />
      <FlatList
        data={results}
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
      />
    </SafeAreaView>
  );
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  createWatchlist: movies => dispatch({ type: 'CREATE_WATCHLIST', movies })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    display: 'flex',
    backgroundColor: 'red',
    flexDirection: 'row',
    marginVertical: 16,
    marginHorizontal: 16,
    width: Dimensions.get('window').width - 32, // Subtract 2 times horizontal margin
    height: Dimensions.get('window').height / 5 // Divide by the number of results per screen height
  },
  itemImage: {
    flex: 1,
    width: undefined, // Undefined to fit container
    height: undefined, // Undefined to fit container
    resizeMode: 'cover', // Scales up images until it fits container, keeping aspect ratio
    marginRight: 10
  },
  itemText: {
    backgroundColor: 'yellow',
    flex: 2,
    justifyContent: 'space-between'
  },
  itemRating: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  itemTextTitle: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 24
  }
});
