import React, {Component} from 'react';
import {ListView, Text, StyleSheet, TouchableHighlight, RefreshControl, View, Image} from 'react-native';
import Cheerio from 'cheerio-without-node-native';
import NewsDetail from './NewsDetail';
import Moment from 'moment';
import 'moment/locale/zh-cn';

const url = 'http://www.tuicool.com/ah/0/';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ItemList extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.name}`,
  });
  constructor(props) {
    super(props);

    this.state = ({
      refreshing: true,
      loadMore: false,
      name: this.props.name,
      pageNo: 0,
      dataSource: [],
    })
  }

  componentWillMount() {
    this._fetchData();
  }

  _fetchData() {
    fetch(url + this.state.pageNo)
      .then(response => response.text())
      .then(text => {
        let temp = [];
        const $ = Cheerio.load(text);
        $('.list_article_item').each(function (i, v) {
          const title = $(v).find('.title').text().replace(/\r\n/gi, '').trim();
          const href = $(v).find('.title>a').attr('href');
          const img = $(v).find('.article_thumb_image>img').attr('src');
          const name = $(v).find('.tip>span').eq(0).text().replace(/\r\n/gi, '').trim();
          const time = $(v).find('.tip>span').eq(2).text().replace(/\r\n/gi, '').trim();
          temp.push({
            title: title,
            href: 'http://www.tuicool.com' + href,
            name: name,
            time: time,
            img: img,
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
      pageNo: 0
    })
  }

  _onEndReached() {
    this.setState({
      loadMore: true,
      pageNo: this.state.pageNo + 1
    });
    this._fetchData();
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
        <View style={{flex: 1, paddingRight: 10}}>
          <Text style={{fontSize: 18}}>{rowData.title}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
            <Text style={styles.other}>{rowData.name}</Text>
            <Text style={styles.other}>{rowData.time}</Text>
          </View>
        </View>
        <Image source={{uri: rowData.img}} style={{width: 60}}/>
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
    flexDirection: 'row',
    marginBottom: 1,
    justifyContent: 'space-between'
  },
  footer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
});