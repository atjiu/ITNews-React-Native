import React, {Component} from 'react';
import {ListView, Text, StyleSheet, TouchableHighlight, RefreshControl, View, Image} from 'react-native';
import Cheerio from 'cheerio-without-node-native';
import NewsDetail from './NewsDetail';
import 'moment/locale/zh-cn';

const url = 'https://www.oschina.net/action/ajax/get_more_news_list?newsType=&p=';
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
        $('.item').each(function (i, v) {
          const title = $(v).find('.title').text();
          let href = $(v).find('.title').attr('href');
          const summary = $(v).find('.summary').text();
          const name = $(v).find('.from>.mr>a').text();
          const time = $(v).find('.from>.mr').children().remove().end().text();
          const avatar = $(v).find('.avatar').attr('src');
          const replyCount = $(v).find('.from>a>.mr').text();
          const thumb = $(v).find('.thumb>a>img').attr('src');
          if (href.indexOf('https://') === -1) href = 'https://www.oschina.net' + href;
          temp.push({
            title: title,
            href: href,
            summary: summary,
            name: name,
            time: time,
            avatar: avatar,
            replyCount: replyCount,
            thumb: thumb,
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
      refreshing: true,
      pageNo: 1
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
      href: rowData.href
    })
  }

  _renderRow(rowData) {
    return <TouchableHighlight
      underlayColor='#008b8b'
      onPress={() => this._onPress(rowData)}>
      <View style={[styles.rowStyle, {flexDirection: 'row', justifyContent: 'space-between'}]}>
        <View style={{flex: 1}}>
          <Text style={styles.rowText}>{rowData.title}</Text>
          <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{width: 20, height: 20, borderRadius: 10, marginRight: 5}}
                source={{uri: rowData.avatar}}
              />
              <Text style={styles.other}>{rowData.name}</Text>
              <Text style={styles.other}>{rowData.time}</Text>
            </View>
            <Text style={[styles.other, {}]}>{rowData.replyCount} 个回复</Text>
          </View>
        </View>
        {
          rowData.thumb ? <Image style={{width: 60}} source={{uri: rowData.thumb}}/> : <View/>
        }
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