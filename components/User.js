import React, {Component} from 'react';
import {Text, StyleSheet, View,TouchableHighlight} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";

export default class UserComponent extends Component {

  _onPress() {

  }
  render() {
    return <View>
      <TouchableHighlight
        style={styles.rowStyle}
        underlayColor='#008b8b'
        onPress={() => this._onPress()}>
        <View style={styles.container}>
          <Icon name="book" size={20} style={{paddingRight: 5}}/>
          <Text style={styles.text}>稍候阅读</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.rowStyle}
        underlayColor='#008b8b'
        onPress={() => this._onPress()}>
        <View style={styles.container}>
          <Icon name="heart-o" size={20} style={{paddingRight: 5}}/>
          <Text style={styles.text}>我的收藏</Text>
        </View>
      </TouchableHighlight>
    </View>
  }
}

const styles = StyleSheet.create({
  container : {
    backgroundColor: '#fff',
    padding: 15,
    flexDirection: 'row',
    marginBottom: 1,
  },
  text: {
    fontSize: 18,
  },
  rowText: {
    marginLeft: 10,
    fontSize: 18,
    flex: 1,
  },
});