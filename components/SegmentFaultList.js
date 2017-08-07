import React, {Component} from 'react';
import {ListView, Text, StyleSheet, TouchableHighlight, RefreshControl, View, Image} from 'react-native';
import Cheerio from 'cheerio-without-node-native';
import NewsDetail from './NewsDetail';
import Moment from 'moment';
import 'moment/locale/zh-cn';

const url = 'https://segmentfault.com/blogs?page=';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

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
      pageNo: 1,
      dataSource: [],
    })
  }

  componentWillMount() {
    this._fetchData();
  }

  _fetchData() {
    if (this.state.refreshing === this.state.loadMore) return;
    fetch(url + this.state.pageNo)
      .then(response => response.text())
      .then(text => {
        let temp = [];
        const $ = Cheerio.load(text);
        $('.stream-list__item').each(function (i, v) {
          const title = $(v).find('.title').text();
          const href = $(v).find('.title>a').attr('href');
          const avatar = $(v).find('.author>li:first-child').find('a:first-child').find('img').attr('src');
          const name = $(v).find('.author>li:first-child').find('span>a:first-child').text().replace(/\r\n/gi, '').trim();
          const time = $(v).find('.author>li:first-child').find('span').children().remove().end().text()
            .replace('发布于', '')
            .replace(/\r\n/gi, '').trim();
          const zan = $(v).find('.stream__item-zan>span:last-child').text();
          temp.push({
            title: title,
            href: 'https://segmentfault.com' + href,
            name: name,
            time: time,
            avatar: avatar,
            zan: zan,
          });
        });
        this.setState({
          refreshing: false,
          loadMore: false,
          dataSource: this.state.pageNo === 1 ? temp : this.state.dataSource.concat(temp)
        })
      })
      .catch(error => console.info(error));
  }

  _onRefresh() {
    this.setState({
      pageNo: 1
    }, () => this._fetchData())
  }

  _onEndReached() {
    if (this.state.dataSource.length === 0) return;
    this.setState({
      loadMore: true,
      pageNo: this.state.pageNo + 1
    }, () => this._fetchData());
  }

  _onPress(rowData) {
    const {navigate} = this.props.navigation;
    navigate('NewsDetail', {
      title: rowData.title,
      href: rowData.href
    })
  }

  _renderRow(rowData) {
    return <TouchableHighlight
      underlayColor='#008b8b'
      onPress={() => this._onPress(rowData)}>
      <View style={styles.rowStyle}>
        <Text style={{fontSize: 18}}>{rowData.title}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'flex-end'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={{uri: rowData.avatar}} style={{width: 20, height: 20, borderRadius: 10, marginRight: 10}}/>
            <Text style={styles.other}>{rowData.name}</Text>
            <Text style={styles.other}>{rowData.time}</Text>
          </View>
          <Text style={styles.other}>{rowData.zan} 赞</Text>
        </View>
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
  other: {
    marginRight: 5,
    fontSize: 14,
    color: '#777'
  },
  rowStyle: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  footer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
});