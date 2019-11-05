import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import {Icon, Button, ListItem} from 'react-native-elements';
import FilterList from './FilterList';
import theme from '../../theme';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;


/**
 * FilterModal component for which are used on the homepage
 * Consist of both the filter button and the actual filter modal card
 * @param {function} updateFilter
 * @param {function} updateSort
 * @param {String} initialGenre
 * @param {Array} initialYearRange
 * @param {Array} initialRatingRange
 * @param {String} initialSortValue
 * @return {React}
 * @constructor
 */
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
      <View>
        <Modal
          animationType='slide'
          isVisible={modalVisible}
          customBackdrop={<View style={{backgroundColor: 'transparent'}} />}
          swipeDirection={['down']}
          style={{padding: 0, margin: 0}}
          onSwipeComplete={() => {
            setModalVisible(!modalVisible);
          }}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
          animationOut={'fade'}
        >
          <View style={styles.modalCard}>
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
          color={theme.colors.primary}
          onPress={() => {
            setModalVisible(true);
          }} />
      </View>
    );
  }
}

export default FilterModal;

const styles = StyleSheet.create({
  modalCard: {
    position: 'absolute',
    bottom: 0,
    padding: 20,
    height: screenHeight/1.4,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: screenWidth,
    elevation: 20,
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
});
