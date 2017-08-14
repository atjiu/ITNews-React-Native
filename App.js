import React, {Component} from 'react';
import {
  AppRegistry
} from 'react-native';
import {StackNavigator, TabNavigator, TabBarBottom} from 'react-navigation';
import Icon from "react-native-vector-icons/FontAwesome";

import UserComponent from './components/User';
import HomeComponent from './components/Home';

import CNodeJSList from './components/CNodeJSList';
import OSChinaList from './components/OSChinaList';
import ToutiaoList from './components/ToutiaoList';
import TuiCoolList from './components/TuiCoolList';
import SegmentFaultList from './components/SegmentFaultList';
import ZhihuDailyList from "./components/ZhihuDailyList";
import NewsDetail from "./components/NewsDetail";
import JueJinList from "./components/JueJinList";
import Kr36List from "./components/Kr36List";
import CollectionList from "./components/CollectionList";

const ITNewsTabNavigator = TabNavigator({
    Main: {
      screen: HomeComponent,
      navigationOptions: {
        title: 'IT资讯',
        headerTitle: 'IT资讯',
        tabBarLabel: "IT资讯",
        tabBarIcon: ({tintColor}) => (
          <Icon
            name="home"
            size={24}
            color={tintColor}
          />
        )
      }
    },
    User: {
      screen: UserComponent,
      navigationOptions: {
        title: '我的',
        headerTitle: '我的',
        tabBarLabel: "我的",
        tabBarIcon: ({tintColor}) => (
          <Icon
            name="user"
            size={24}
            color={tintColor}
          />
        )
      }
    }
  }, {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    backBehavior: 'none',
  })
;

const ITNews = StackNavigator({
  ITNewsTab: {screen: ITNewsTabNavigator},
  CNodeJS: {screen: CNodeJSList},
  OSChina: {screen: OSChinaList},
  TouTiao: {screen: ToutiaoList},
  TuiCool: {screen: TuiCoolList},
  SegmentFault: {screen: SegmentFaultList},
  ZhihuDaily: {screen: ZhihuDailyList},
  JueJin: {screen: JueJinList},
  Kr36: {screen: Kr36List},
  NewsDetail: {screen: NewsDetail},
  Collections: {
    screen: CollectionList,
    navigationOptions: {
      headerTitle: '我的收藏'
    }
  },
});

AppRegistry.registerComponent('ITNews', () => ITNews);