import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Icon, ListItem, Text} from 'react-native-elements';
import theme from '../../theme';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomMarker from './customMarker';

const screenHeight = Dimensions.get('screen').height;

/**
 * Filter list for changing filter values on the movie list
 * @param {function} updateSkip
 * @param {String} initialGenreValue
 * @param {function} updateSort
 * @param {function} updateFilterValues
 * @param {function} updateModal
 * @param {Array} initialYearRange
 * @param {String} initialSort
 * @param {Array} initialRatingRange
 * @return {React}
 * @constructor
 */

function FilterList({
  updateSkip,
  initialGenreValue,
  updateSort,
  updateFilterValues,
  updateModal,
  initialYearRange,
  initialSort,
  initialRatingRange}) {
  const genres = ['Action', 'Animation', 'Comedy', 'Documentary',
    'Drama', 'Fantasy', 'Romance', 'Thriller'];
  const [filterValue, setFilter] = useState('');
  const [sortValue, setSortValue] = useState(initialSort);
  const [genreValue, setGenreValue] = useState(initialGenreValue);
  const [yearRange, setYearRange] = useState(initialYearRange);
  const [ratingRange, setRatingRange] = useState(initialRatingRange);
  const filters = [`Sort`, `Genre (${genreValue})`,
    `Year (${yearRange[0]}-${yearRange[1]})`,
    `Rating (${ratingRange[0]}-${ratingRange[1]})`];
  const sortValues = [
    {
      name: 'Alphabetic',
      sort: 'title',
    },
    {
      name: 'Released (Newest first)',
      sort: '-released',
    },
    {
      name: 'Released (Latest first)',
      sort: 'released',
    },
    {
      name: 'Rating (Highest first)',
      sort: '-imdb',
    },
    {
      name: 'Rating (Lowest first)',
      sort: 'imdb',
    },
  ];

  // Updates the sort value of both the redux store and
  // the state of the modal
  const updateSortValue = (value) => {
    setSortValue(value);
    updateSort(value);
    updateSkip(0);
  };

  // Updates the filter state of
  // the filter list
  const updateFilterScreen = (filter) => {
    setFilter(filter);
  };

  // Updates the redux store filter values
  // and applies the filter
  const applyFilter = () => {
    updateFilterValues(genreValue, yearRange, ratingRange);
    updateSkip(0);
    updateModal(false);
  };

  // Reset filter values to the initial values
  // both in redux store and state
  const resetFilter = () => {
    updateFilterValues('', [1893, 2019], [0, 10]);
    updateSortValue('-imdb');
    updateModal(false);
  };

  // Updates year in state
  const handleChangeYear = (newValue) => {
    setYearRange(newValue);
  };

  // Updates rating in state
  const handleChangeRating = (newValue) => {
    setRatingRange(newValue);
  };

  // Updates genre in state
  const handleChangeGenre = (newGenre) => {
    setGenreValue(newGenre);
  };

  if (filterValue===1) {
    return (
      <View style={styles.subMenu}>
        <View style={styles.subHeader}>
          <Icon
            size={36}
            name="arrow-back"
            type="material"
            color="#F6AE2D"
            onPress={() => updateFilterScreen('')}
          />
          <View style={styles.subTitle}>
            <Text h3>Genre</Text>
          </View>
        </View>
        <View>
          <View style={styles.genreButtons}>
            {genres.map((genre) => (
              <View style={styles.button} key={genre}>
                <Button
                  title={genre}
                  type={genreValue === genre ? 'solid' : 'outline'}
                  buttonStyle={{borderColor: theme.colors.primary,
                    backgroundColor: genreValue === genre ?
                      theme.colors.primary : 'white',
                  }}
                  titleStyle={{color: genreValue === genre ?
                      'white' : theme.colors.primary}}
                  onPress={() => handleChangeGenre(genre)}
                />
              </View>
            ))
            }
          </View>
        </View>
      </View>
    );
  } else if (filterValue === 0) {
    return (
      <View>
        <View style={styles.subHeader}>
          <Icon
            size={36}
            style={{width: '40%'}}
            name="arrow-back"
            type="material"
            color={theme.colors.primary}
            onPress={() => updateFilterScreen('')}
          />
          <View style={styles.subTitle}>
            <Text h3>Sort</Text>
          </View>
        </View>
        <View>
          <View>
            {
              sortValues.map((sort, i) => (
                <ListItem
                  key={i}
                  title={sort.name}
                  bottomDivider
                  titleStyle={{fontSize: screenHeight/33,
                    color: sortValue === sort.sort ?
                      theme.colors.primary :
                      'black'}}
                  rightIcon={sortValue === sort.sort ?
                    <Icon name='check-box' type='material' color='#F6AE2D'/> :
                    <Icon name='check-box-outline-blank' type='material' />}
                  containerStyle={{padding: screenHeight/39}}
                  onPress={()=> updateSortValue(sort.sort)}
                />
              ))
            }
          </View>
        </View>
      </View>
    );
  } else if (filterValue === 2) {
    return (
      <View style={styles.subMenu}>
        <View style={styles.subHeader}>
          <Icon
            size={36}
            name="arrow-back"
            type="material"
            color="#F6AE2D"
            onPress={()=> updateFilterScreen('')}
          />
          <View style={styles.subTitle}>
            <Text h3>Year range</Text>
          </View>
        </View>
        <View style={styles.subContent}>
          <MultiSlider
            selectedStyle={{backgroundColor: theme.colors.primary}}
            values={yearRange}
            isMarkersSeparated={true}
            customMarkerRight={(e) => {
              return (<CustomMarker currentValue={e.currentValue}/>);
            }}
            customMarkerLeft={(e) => {
              return (<CustomMarker currentValue={e.currentValue}/>);
            }}
            onValuesChange={handleChangeYear}
            sliderLength={Dimensions.get('window').width - 100}
            min={1893}
            max={2019}
            allowOverlap={false}
            snapped={true}
          />
        </View>
      </View>
    );
  } else if (filterValue === 3) {
    return (
      <View style={styles.subMenu}>
        <View style={styles.subHeader}>
          <Icon
            size={36}
            name="arrow-back"
            type="material"
            color="#F6AE2D"
            onPress={()=> updateFilterScreen('')}
          />
          <View style={styles.subTitle}>
            <Text h3>Rating range</Text>
          </View>
        </View>
        <View style={styles.subContent}>
          <MultiSlider
            selectedStyle={{backgroundColor: theme.colors.primary}}
            values={ratingRange}
            isMarkersSeparated={true}
            customMarkerRight={(e) => {
              return (<CustomMarker currentValue={e.currentValue}/>);
            }}
            customMarkerLeft={(e) => {
              return (<CustomMarker currentValue={e.currentValue}/>);
            }}
            onValuesChange={handleChangeRating}
            sliderLength={Dimensions.get('window').width - 100}
            min={0}
            max={10}
            allowOverlap={false}
            snapped={true}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.filterMenu}>
        <View style={styles.filterHeader}>
          <Text h2> Filter </Text>
          <TouchableOpacity
            onPress={() => {
              updateModal(false);
            }} >
            <Icon
              size={36}
              name='clear'
              type='material'
              color="#F6AE2D"
            />
          </TouchableOpacity>
        </View>
        <View>
          {
            filters.map((filter, i) => (
              <ListItem
                key={i}
                title={filter}
                bottomDivider
                titleStyle={{fontSize: screenHeight/33}}
                containerStyle={{padding: screenHeight/38}}
                onPress={()=> updateFilterScreen(i)}
                chevron
              />
            ))
          }
        </View>
        <Button
          title='Reset filter'
          type = 'outline'
          buttonStyle={{borderColor: theme.colors.primary,
            backgroundColor: 'white'}}
          titleStyle={{color: theme.colors.primary}}
          onPress={resetFilter}
        />
        <Button
          title="Apply filter"
          buttonStyle={{borderColor: theme.colors.primary,
            backgroundColor: theme.colors.primary,
          }}
          titleStyle={{color: 'white'}}
          onPress={applyFilter}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateSkip: (skipValue) => dispatch({type: 'UPDATE_SKIP', skipValue}),
});

export default connect(
    // Needs to be null because mapDispatchToProps always follows mapStateToProp
    null,
    mapDispatchToProps,
)(FilterList);

const styles = StyleSheet.create({
  filterMenu: {
    display: 'flex',
    justifyContent: 'space-evenly',
    height: '100%',
  },
  filterHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subMenu: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  subHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: screenHeight/7,
  },
  subTitle: {
    flexGrow: 1,
    padding: 20,
  },
  subContent: {
    display: 'flex',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreButtons: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    marginTop: 5,
    width: '48%',
    margin: 2,
  },

});
