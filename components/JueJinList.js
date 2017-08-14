import React, {Component} from 'react';
import {ListView, Text, StyleSheet, TouchableHighlight, RefreshControl, Image, View} from 'react-native';
import Moment from 'moment';
import 'moment/locale/zh-cn';

const url = 'https://timeline-merger-ms.juejin.im/v1/get_entry_by_rank?src=web&limit=20&category=all&before=';
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
      pageNo: '',
      dataSource: [],
    })
  }

  componentWillMount() {
    this._fetchData();
  }

  _fetchData() {
    if (this.state.refreshing === this.state.loadMore) return;
    fetch(url + this.state.pageNo)
      .then(response => response.json())
      .then(json => {
        this.setState({
          refreshing: false,
          loadMore: false,
          dataSource: this.state.pageNo === '' ? json.d.entrylist : this.state.dataSource.concat(json.d.entrylist)
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
      pageNo: this.state.dataSource[this.state.dataSource.length-1].rankIndex,
    }, () => this._fetchData());
  }

  _onPress(rowData) {
    const {navigate} = this.props.navigation;
    navigate('NewsDetail', {
      title: rowData.title,
      href: 'https://juejin.im/entry/' + rowData.objectId
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
                source={{uri: rowData.user.avatarLarge}}
              />
              <Text style={styles.other}>{rowData.user.username}</Text>
              <Text style={styles.other}>{Moment(rowData.createAt).fromNow()}</Text>
            </View>
            <Text style={[styles.other, {}]}>{rowData.commentsCount} 个回复</Text>
          </View>
        </View>
        {
          rowData.screenshot ? <Image style={{width: 60}} source={{uri: rowData.screenshot}}/> : <View/>
        }
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