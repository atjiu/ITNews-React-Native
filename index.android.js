// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  * @flow
//  */
//
// import React, { Component } from 'react';
// import {
//   AppRegistry, Navigator,
// } from 'react-native';
// import NewsList from "./NewsList";
//
// export default class ITNews extends Component {
//   render() {
//     return (
//       <Navigator
//         style={{flex: 1}}
//         initialRoute={{
//           name:'IT资讯',    // 名称
//           component:NewsList  // 要跳转的板块
//         }}
//         renderScene={(route, navigator) => {    // 将板块生成具体的组件
//           let Component = route.component;    // 获取路由内的板块
//           return <Component {...route.params} navigator={navigator} />    // 根据板块生成具体组件
//         }}
//       />
//     );
//   }
// }
//
// AppRegistry.registerComponent('ITNews', () => ITNews);


import './App';