import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  AsyncStorage,
} from 'react-native';
import {SearchBar, Divider} from 'react-native-elements';
import Results from '../components/Results';
import FilterModal from '../components/Filter';

function HomeScreen(props) {
  const [search, setSearch] = useState('');
  const [genre, setGenreValue] = useState(props.genre);
  const [yearRange, setYearRange] = useState(props.yearRange);
  const [ratingRange, setRatingRange] = useState(props.ratingRange);
  const [sortValue, setSortValue] = useState(props.sortValue);


  renderDivider = () => {
    return <Divider />;
  };

  useEffect(() => {
    try {
      const fetchAsync = async () => {
        await AsyncStorage.getItem('Watchlist').then((data) => {
          JSON.parse(data) ?
            props.createWatchlist(JSON.parse(data)) :
            // If data is null,
            // the redux store watchlist is initialized as empty list
            props.createWatchlist([]);
        });
      };
      fetchAsync();
    } catch (error) {
      // Alert user about error fetching watchlist from AsyncStorage
      Alert.alert(
          'An error has occured',
          'Could not fetch watchlist from AsyncStorage.',
      );
    }
  }, []);

  const updateSearch = (search) => {
    setSearch(search);
    props.updateSkip(0);
  };

  const handleClearSearch = () => {
    updateSearch('');
  };

  const updateFilterValues = (genre, yearRangeValue, ratingRangeValue) => {
    if (yearRangeValue) {
      setYearRange(yearRangeValue);
      props.addYearFilter(yearRangeValue);
    }
    if (ratingRangeValue) {
      setRatingRange(ratingRangeValue);
      props.addRatingFilter(ratingRangeValue);
    }
    if (genre || genre === '') {
      setGenreValue(genre);
      props.addGenreFilter(genre);
    }
  };

  const updateSort = (sort) => {
    setSortValue(sort);
    props.newSortValue(sort);
  };


  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        platform={Platform.OS === 'ios' ? 'ios' : 'android'}
        placeholder='Search...'
        onChangeText={updateSearch}
        onClear={handleClearSearch}
        value={search}
        style={styles.searchBar}
      />
      <Divider />
      <Results
        query={search}
        genre={genre}
        yearRange={yearRange}
        ratingRange={ratingRange}
        sort={sortValue}
      />
      <FilterModal
        initialGenre={genre}
        updateSort={updateSort}
        initialYearRange={yearRange}
        initialRatingRange={ratingRange}
        initialSortValue={sortValue}
        updateFilter={updateFilterValues}
      />
    </SafeAreaView>
  );
}

// Removes top navigation
HomeScreen.navigationOptions = {
  headerStyle: {
    display: 'none',
  },
};

const mapStateToProps = (state) => ({
  user: state.user,
  search: state.search,
  genre: state.genre,
  yearRange: state.yearRange,
  ratingRange: state.ratingRange,
  sortValue: state.sortValue,
});

const mapDispatchToProps = (dispatch) => ({
  createWatchlist: (movies) => dispatch({type: 'CREATE_WATCHLIST', movies}),
  updateSkip: (skipValue) => dispatch({type: 'UPDATE_SKIP', skipValue}),
  addYearFilter: (years) =>
    dispatch({type: 'ADD_YEAR_FILTER', years}),
  addRatingFilter: (ratings) =>
    dispatch({type: 'ADD_RATING_FILTER', ratings}),
  addGenreFilter: (chosenGenre) =>
    dispatch({type: 'ADD_GENRE_FILTER', chosenGenre}),
  newSortValue: (sort) =>
    dispatch({type: 'NEW_SORT_VALUE', sort}),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});
