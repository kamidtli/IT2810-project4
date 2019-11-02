import React from 'react';
import { connect } from 'react-redux';
import {
  SafeAreaView,
  View,
  ScrollView,
  FlatList,
  Text,
  StyleSheet,
  StatusBar
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import MovieDetail from '../components/MovieDetail';

function LinksScreen(props) {
  console.log(props.watchlist);

  if (!props.watchlist) {
    return (
      <View>
        <Text h1>No videos in watchlist</Text>
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={props.watchlist}
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
}

const mapStateToProps = state => ({
  watchlist: state.watchlist
});

export default connect(mapStateToProps)(LinksScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight
  }
});
