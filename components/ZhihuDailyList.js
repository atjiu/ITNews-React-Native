import React, {Component} from 'react';
import {ListView, Text, StyleSheet, TouchableHighlight, RefreshControl, Image, View} from 'react-native';
import Moment from 'moment';
import 'moment/locale/zh-cn';

import NewsDetail from './NewsDetail';

const url = 'https://news-at.zhihu.com/api/4/news/before/';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const ONEDAY = 24 * 60 * 60 * 1000;
let pageNo = Moment(new Date().getTime() + ONEDAY).format('YYYYMMDD');

export default class ItemList extends Component {
  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.name}`,
  });

  constructor(props) {
    super(props);

    this.state = ({
      refreshing: true,
      loadMore: false,
      name: this.props.name,
      pageNo: pageNo,
      dataSource: [],
    })
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData() {
    fetch(url + this.state.pageNo)
      .then(response => response.json())
      .then(json => {
        this.setState({
          refreshing: false,
          loadMore: false,
          dataSource: pageNo === this.state.pageNo ? json.stories : this.state.dataSource.concat(json.stories)
        })
      })
      .catch(error => console.info(error));
  }

  _onRefresh() {
    this.setState({
      pageNo: Moment(new Date().getTime() + ONEDAY).format('YYYYMMDD'),
    }, () => this._fetchData());
  }

  _onEndReached() {
    if (this.state.dataSource.length === 0) return;
    this.setState({
      loadMore: true,
      pageNo: Moment(new Date(Moment(this.state.pageNo)).getTime() - ONEDAY).format('YYYYMMDD')
    }, () => this._fetchData());
  }

  _onPress(rowData) {
    const {navigate} = this.props.navigation;
    navigate('NewsDetail', {
      title: rowData.title,
      href: 'http://daily.zhihu.com/story/' + rowData.id
    })
  }

  _renderRow(rowData) {
    return <TouchableHighlight
      underlayColor='#008b8b'
      onPress={() => this._onPress(rowData)}>
      <View style={styles.rowStyle}>
        <Text style={{fontSize: 20, flex: 1}}>{rowData.title}</Text>
        <Image style={{width: 100, height: 80}} source={{uri: rowData.images[0]}}/>
      </View>
    </TouchableHighlight>
  }

  render() {
    const FooterView = this.state.loadMore ?
      <View style={styles.footer}>
        <Text style={{fontSize: 16, color: '#777'}}>加载更多...</Text>
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
  rowStyle: {
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  footer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
});