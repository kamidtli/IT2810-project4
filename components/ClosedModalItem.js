import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Text, Image} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import theme from '../theme';

export default Item = ({title, poster, rating}) => {
  return (
    <View style={styles.item}>
      <View style={styles.itemImageContainer}>
        <Image style={styles.itemImage} source={{uri: poster}} />
      </View>
      <View style={styles.itemText}>
        <Text style={styles.itemTextTitle}>{title}</Text>
        <View style={styles.itemRating}>
          <Icon name='star' type='ion-icon' color={theme.colors.primary}/>
          <Text>{rating}/10</Text>
        </View>
      </View>
    </View>
  );
}
;

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 16,
    marginHorizontal: 16,
    width: Dimensions.get('window').width - 32, // Subtract 2 times horizontal margin
    height: Dimensions.get('window').height / 5, // Divide by the number of results per screen height
  },
  itemImageContainer: {
    flex: 1,
  },
  itemImage: {
    width: '100%',
    height: '100%',
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
