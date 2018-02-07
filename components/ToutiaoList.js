import React, {Component} from 'react';
import {ListView, Text, StyleSheet, TouchableHighlight, RefreshControl, View, Image} from 'react-native';
import Cheerio from 'cheerio-without-node-native';
import Moment from 'moment';
import 'moment/locale/zh-cn';

const url = 'https://toutiao.io/prev/';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let pageNo = Moment(new Date()).format('YYYY-MM-DD');
const ONEDAY = 24 * 60 * 60 * 1000;

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
      pageNo: pageNo,
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
        $('.post').each(function (i, v) {
          const title = $(v).find('.title').text().replace(/\r\n/gi, '').trim();
          const href = $(v).find('.title a').attr('href');
          const avatar = $(v).find('.user-avatar img').attr('src');
          const replyCount = $(v).find('.meta span').text().replace(/\r\n/gi, '').trim();
          const originUrl = $(v).find('.meta').children().remove().end().text().replace(/\r\n/gi, '').trim();
          temp.push({
            title: title,
            href: 'https://toutiao.io' + href,
            avatar: avatar,
            originUrl: originUrl,
            replyCount: replyCount,
          });
        });
        this.setState({
          refreshing: false,
          loadMore: false,
          dataSource: pageNo === Moment(new Date()).format('YYYY-MM-DD') ? temp : this.state.dataSource.concat(temp)
        })
      })
      .catch(error => console.info(error));
  }

  _onRefresh() {
    pageNo = Moment(new Date()).format('YYYY-MM-DD');
    this.setState({
      pageNo: pageNo
    }, () => this._fetchData());
  }

  _onEndReached() {
    if (this.state.dataSource.length === 0) return;
    pageNo = Moment(new Date(pageNo).getTime() - ONEDAY).format("YYYY-MM-DD");
    this.setState({
      loadMore: true,
      pageNo: pageNo
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
        {
          rowData.avatar ?
            <Image
              style={{width: 40, height: 40, borderRadius: 20, marginRight: 10}}
              source={{uri: rowData.avatar}}
            /> : null
        }
        <View style={{flex: 1}}>
          <Text style={styles.rowText}>{rowData.title}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <Text style={styles.other}>{rowData.originUrl}</Text>
            <Text style={[styles.other]}>{rowData.replyCount} 个回复</Text>
          </View>
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
  rowText: {
    fontSize: 18,
    paddingRight: 10,
  },
  other: {
    fontSize: 14,
    marginTop: 10,
    color: '#777'
  },
  rowStyle: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
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