import React, {useState} from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, Text, Image, Dimensions, ActivityIndicator } from 'react-native';
import {SearchBar, Divider } from 'react-native-elements';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

function Item({title, poster, rating}) {
  return (
    <View style={styles.item}>
      <Image style={styles.itemImage} source={{uri: poster}} />
      <View style={styles.itemText}>
        <Text style={styles.itemTextTitle}>{title}</Text>
        <Text>{rating}</Text>
      </View>
    </View>
  )
}

const SEARCH_QUERY = gql`
  {
    filterMovies (
      searchValue: "nolan",
      genre: "",
      yearRange: [1980,2019],
      ratingRange: [5,10],
      sort: "-imdb", pagination: 12, skip: 0 ) {
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

export default function App() {
  const [search, setSearch] = useState('');

  updateSearch = (search) => {
    setSearch(search);
  };

  const {
    data, loading, error,
  } = useQuery(SEARCH_QUERY);
  
  if(loading) return <ActivityIndicator size="large" />;
  if(error) return <Text>{error.message}</Text>;
  
  console.log(data);
  
  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={this.updateSearch}
        value={search}
        />
      {/* List that renders the data as an Item */}
      <FlatList
        data={data.filterMovies}
        renderItem={({item}) => (
          <View>
            <Item 
              title={item.title}
              poster={item.poster || "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1340&q=80"}
              rating={item.imdb.rating}
              />
            <Divider />
          </View>
        )}
        keyExtractor={(item) => item._id}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 16,
    marginHorizontal: 16,
    width: Dimensions.get('window').width - 32, // Subtract 2 times horizontal margin
  },
  itemImage: {
    width: 150,
    height: 225,
    marginRight: 10,
  },
  itemTextTitle: {
    fontSize: 24,
  },
});
