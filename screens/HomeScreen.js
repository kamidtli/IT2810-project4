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
import { SearchBar, Divider } from 'react-native-elements';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import MovieDetail from '../components/MovieDetail';

const SEARCH_QUERY = gql`
  {
    filterMovies(
      searchValue: "nolan"
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
  };

  const { data, loading, error } = useQuery(SEARCH_QUERY);

  if (loading) return <ActivityIndicator size='large' />;
  if (error) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder='Type Here...'
        onChangeText={this.updateSearch}
        value={search}
      />
      {/* List that renders the data as an Item */}
      <FlatList
        data={data.filterMovies}
        renderItem={({ item }) => (
          <View>
            <MovieDetail
              movieID={item._id}
              title={item.title}
              rating={item.imdb.rating}
              poster={
                item.poster ||
                'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1340&q=80'
              }
            />
            <Divider />
          </View>
        )}
        keyExtractor={item => item._id}
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
  }
});
