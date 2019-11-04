import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Divider, Text} from 'react-native-elements';
import Modal from 'react-native-modal';
import {Icon, Button, ListItem} from 'react-native-elements';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomMarker from './customMarker';


const screenHeight = Dimensions.get('screen').height;

function FilterList({
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
  const filters = ['Sort', 'Genre', 'Year range', 'Rating range'];
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

  const updateSortValue = (value) => {
    setSortValue(value);
    updateSort(value);
  };

  const updateFilterScreen = (filter) => {
    setFilter(filter);
  };

  // Updates year in state
  const handleChangeYear = (newValue) => {
    setYearRange(newValue);
  };

  // Updates rating in state
  const handleChangeRating = (newValue) => {
    setRatingRange(newValue);
  };

  // Updates genre in state and redux store
  const handleChangeGenre = (newGenre) => {
    setGenreValue(newGenre);
  };

  if (filterValue==='Genre') {
    return (
      <View>
        <View style={styles.icon}>
          <Icon name="arrow-back" type="material" color="#F6AE2D"
            onPress={() => updateFilterScreen('')}
          />
        </View>
        <View style={styles.slider}>
          <Text h3>Genre</Text>
          <View style={styles.genreButtons}>
            {genres.map((genre) => (
              <View style={styles.button} key={genre}>
                <Button
                  title={genre}
                  type={genreValue === genre ? 'solid' : 'outline'}
                  color="#F6AE2D"
                  onPress={() => handleChangeGenre(genre)}
                />
              </View>
            ))
            }
          </View>
        </View>
      </View>
    );
  } else if (filterValue === 'Sort') {
    return (
      <View>
        <View style={styles.icon}>
          <Icon name="arrow-back" type="material" color="#F6AE2D"
            onPress={() => updateFilterScreen('')}
          />
        </View>
        <View>
          <Text h3 >Sort</Text>
          <View style={{marginTop: 20}}>
            {
              sortValues.map((sort, i) => (
                <ListItem
                  key={i}
                  title={sort.name}
                  bottomDivider
                  titleStyle={{fontSize: 20,
                    color: sortValue === sort.sort ? '#F6AE2D' : 'black'}}
                  rightIcon={sortValue === sort.sort ?
                  <Icon name='check-box' type='material' color='#F6AE2D'/> :
                  <Icon name='check-box-outline-blank' type='material' />}
                  containerStyle={{padding: 20}}
                  onPress={()=> updateSortValue(sort.sort)}
                />
              ))
            }
          </View>
        </View>
      </View>
    );
  } else if (filterValue === 'Year range') {
    return (
      <View>
        <View style={styles.icon}>
          <Icon name="arrow-back" type="material" color="#F6AE2D"
            onPress={()=> updateFilterScreen('')}
          />
        </View>
        <View style={styles.slider}>
          <Text h3>Year range</Text>
          <MultiSlider
            selectedStyle={{backgroundColor: '#F6AE2D'}}
            values={yearRange}
            isMarkersSeparated={true}
            customMarkerLeft={(e) => {
              return (<CustomMarker currentValue={e.currentValue}/>);
            }}
            customMarkerRight={(e) => {
              return (<CustomMarker currentValue={e.currentValue}/>);
            }}
            onValuesChange={handleChangeYear}
            min={1893}
            max={2019}
            allowOverlap={false}
            snapped={true}
          />
        </View>
      </View>
    );
  } else if (filterValue === 'Rating range') {
    return (
      <View>
        <View style={styles.icon}>
          <Icon name="arrow-back" type="material" color="#F6AE2D"
            onPress={()=> updateFilterScreen('')}
          />
        </View>
        <View style={styles.slider}>
          <Text h3>Rating range</Text>
          <MultiSlider
            selectedStyle={{backgroundColor: '#F6AE2D'}}
            values={ratingRange}
            isMarkersSeparated={true}
            customMarkerLeft={(e) => {
              return (<CustomMarker currentValue={e.currentValue}/>);
            }}
            customMarkerRight={(e) => {
              return (<CustomMarker currentValue={e.currentValue}/>);
            }}
            onValuesChange={handleChangeRating}
            sliderLength={Dimensions.get('window').width -100}
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
      <View>
        <View style={styles.filterHeader}>
          <Text h1> Filter </Text>
          <TouchableOpacity
            onPress={() => {
              updateModal(false);
            }} >
            <Icon reverse
              name='clear'
              type='material'
              color="#F6AE2D"
            />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20}}>
          {
            filters.map((filter, i) => (
              <ListItem
                key={i}
                title={filter}
                bottomDivider
                titleStyle={{fontSize: 20}}
                containerStyle={{padding: 20}}
                onPress={()=> updateFilterScreen(filter)}
                chevron
              />
            ))
          }
          <Button
            style={{marginTop: 10}}
            type='outline'
            title='Reset filter'
            onPress={()=> updateFilterValues('', [1893, 2019], [0, 10])}
          />
          <Button
            style={{marginTop: 10}}
            title="Apply filter"
            onPress={()=>
              updateFilterValues(genreValue, yearRange, ratingRange)}
          />
        </View>
      </View>
    );
  }
}

function FilterModal({
  updateFilter,
  updateSort,
  initialGenre,
  initialYearRange,
  initialRatingRange,
  initialSortValue,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  if (modalVisible) {
    return (
      <View style={styles.container}>
        <Modal
          animationType='slide'
          isVisible={modalVisible}
          customBackdrop={<View style={{backgroundColor: 'transparent'}} />}
          swipeDirection={['down']}
          style={{
            marginRight: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginTop: 200}}
          onSwipeComplete={() => {
            setModalVisible(!modalVisible);
          }}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
          animationOut={'fade'}
        >
          <View style={styles.modal}>
            <FilterList
              updateModal={setModalVisible}
              updateSort={updateSort}
              initialGenreValue={initialGenre}
              initialRatingRange={initialRatingRange}
              initialYearRange={initialYearRange}
              initialSort={initialSortValue}
              updateFilterValues={updateFilter}/>
          </View>
        </Modal>
      </View>
    );
  } else {
    return (
      <View style={styles.filterButton}>
        <Icon
          reverse
          name="filter"
          type="font-awesome"
          raised
          color="#F6AE2D"
          onPress={() => {
            setModalVisible(true);
          }} />
      </View>
    );
  }
}

export default FilterModal;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  filterButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  filterHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    elevation: 10,
  },
  slider: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: screenHeight/3,
  },
  genreButtons: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,

  },
  button: {
    marginTop: 5,
    width: '48%',
    margin: 2,
  },
  icon: {
    width: 40,
    height: 40,
  },
  filterPage: {
    marginTop: 10,
  },

});
