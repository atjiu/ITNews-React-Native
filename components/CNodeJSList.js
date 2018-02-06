import React, {Component} from 'react';
import {ListView, Text, StyleSheet, TouchableHighlight, RefreshControl, Image, View} from 'react-native';
import Moment from 'moment';
import 'moment/locale/zh-cn';

import NewsDetail from './NewsDetail';

const url = 'https://cnodejs.org/';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ItemList extends Component {
  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.name}`,
    headerStyle: { backgroundColor: '#0099ff', },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: { color: 'white' },
  });

  constructor(props) {
    super(props);

    this.state = ({
      refreshing: true,
      loadMore: false,
      name: this.props.name,
      pageNo: 1,
      dataSource: [],
    })
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData() {
    if (this.state.loadMore === this.state.loadMore) return;
    fetch(url + 'api/v1/topics?page=' + this.state.pageNo)
      .then(response => response.json())
      .then(json => {
        this.setState({
          refreshing: false,
          loadMore: false,
          dataSource: this.state.pageNo === 1 ? json.data : this.state.dataSource.concat(json.data)
        })
      })
      .catch(error => console.info(error));
  }

  _onRefresh() {
    this.setState({
      refreshing: true,
      pageNo: 1,
    }, () => this._fetchData());
  }

  _onEndReached() {
    if (this.state.dataSource.length === 0) return;
    this.setState({
      loadMore: true,
      pageNo: this.state.pageNo + 1,
    }, () => this._fetchData());
  }

  _onPress(rowData) {
    const {navigate} = this.props.navigation;
    navigate('NewsDetail', {
      title: rowData.title,
      href: url + 'topic/' + rowData.id
    })
  }

  _renderRow(rowData) {
    return <TouchableHighlight
      underlayColor='#008b8b'
      onPress={() => this._onPress(rowData)}>
      <View style={styles.rowStyle}>
        <Image
          style={{width: 40, height: 40, borderRadius: 20}}
          source={{uri: rowData.author.avatar_url}}
        />
        <View style={{paddingLeft: 10, flexDirection: 'column', flex: 1}}>
          <Text style={{fontSize: 18,}}>{rowData.title}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <Text style={styles.other}>{Moment(rowData.create_at).fromNow()}</Text>
            <Text style={[styles.other]}>{rowData.reply_count} 个回复</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  }

  render() {
    const FooterView = this.state.loadMore ?
      <View style={styles.footer}>
        <Text style={{fontSize: 18, color: '#777'}}>加载更多...</Text>
      </View> : null;
    return <ListView
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}
        />
      }
      style={[styles.listView]}
      dataSource={ds.cloneWithRows(this.state.dataSource)}
      enableEmptySections={true}
      renderRow={this._renderRow.bind(this)}
      onEndReachedThreshold={10}
      onEndReached={this._onEndReached.bind(this)}
      renderFooter={() => FooterView}
    />
  }
}

const styles = StyleSheet.create({
  listView: {
    backgroundColor: '#eee',
  },
  other: {
    fontSize: 14,
    paddingTop: 10,
    color: '#777'
  },
  rowStyle: {
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginBottom: 1,
  },
  footer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
});