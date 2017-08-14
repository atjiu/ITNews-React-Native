import React, {Component} from 'react';
import {ListView, Text, StyleSheet, AsyncStorage, TouchableHighlight, View} from 'react-native';
import Config from '../config';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class CollectionList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    }
  }

  async componentDidMount() {
    // await AsyncStorage.removeItem(Config.collectionsKey);
    const value = await AsyncStorage.getItem(Config.collectionsKey);
    const collections = value ? JSON.parse(value) : [];
    this.setState({
      dataSource: collections
    })
  }

  _renderRow(rowData) {
    return <TouchableHighlight
      underlayColor='#008b8b'
      onPress={() => this._onPress(rowData)}>
      <View style={styles.rowStyle}>
        <Text style={{fontSize: 18}}>{rowData.title}</Text>
      </View>
    </TouchableHighlight>
  }

  render() {
    return (<View>
      {
        this.state.dataSource.length > 0 ?
          <ListView
            style={styles.listView}
            dataSource={ds.cloneWithRows(this.state.dataSource)}
            enableEmptySections={true}
            renderRow={this._renderRow.bind(this)}
          /> : <Text style={{padding: 10, textAlign: 'center', fontSize: 16, color: '#777'}}>你还没有收藏任何资讯~</Text>
      }
    </View>)
  }
}

const styles = StyleSheet.create({
  listView: {
    backgroundColor: '#eee',
  },
  rowStyle: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 1,
  },
});