import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { Divider } from 'react-native-elements';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import MovieDetail from '../components/MovieDetail';

const SEARCH_QUERY = gql`
  query searchQuery($searchValue: String!) {
    filterMovies (
      searchValue: $searchValue,
      genre: "",
      yearRange: [1980,2019],
      ratingRange: [5,10],
      sort: "-imdb", pagination: 12, skip: 0 ) {
      _id
      title
      poster
      imdb {
        rating
      }
    }
  }
`;

export default function Results({query}) {
    
  const { data, loading, error } = useQuery(SEARCH_QUERY,
    { variables: { searchValue: query },
  });

  renderDivider = () => {
    return (
      <Divider />
    );
  }

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>{error.message}</Text>;

  return (
    <FlatList
    data={data.filterMovies}
    renderItem={({item}) => (
        <View>
        <MovieDetail
            movieID={item._id}
            title={item.title}
            rating={item.imdb.rating}
            poster={item.poster}
            />
        </View>
    )}
    keyExtractor={(item) => item._id}
    ItemSeparatorComponent={this.renderDivider}
    />
  )
}
