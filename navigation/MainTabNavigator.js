import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import theme from '../theme';

const config = Platform.select({
  web: {headerMode: 'screen'},
  default: {},
});

const HomeStack = createStackNavigator(
    {
      Home: HomeScreen,
    },
    config,
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarOptions: {
    activeTintColor: '#000',
  },
  tabBarIcon: ({focused}) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios' ?
          `ios-home` :
          'md-home'
      }
    />
  ),
};

HomeStack.path = '';

const WatchlistStack = createStackNavigator(
    {
      Watchlist: WatchlistScreen,
    },
    config,
);

WatchlistStack.navigationOptions = {
  tabBarLabel: 'Watchlist',
  tabBarOptions: {
    activeTintColor: '#000',
  },
  tabBarIcon: ({focused}) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-film' : 'md-film'} />
  ),
};

WatchlistStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  WatchlistStack,
});

tabNavigator.path = '';

export default tabNavigator;
