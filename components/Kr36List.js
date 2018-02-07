import React, {Component} from 'react';
import {ListView, Text, StyleSheet, TouchableHighlight, RefreshControl, View, Image} from 'react-native';
import Moment from 'moment';
import 'moment/locale/zh-cn';

const url = 'http://36kr.com/api/info-flow/main_site/posts?column_id=&per_page=20&b_id=';
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
          dataSource: this.state.pageNo === '' ? json.data.items : this.state.dataSource.concat(json.data.items)
        })
      })
      .catch(error => console.info('kr36-error', error));
  }

  _onRefresh() {
    this.setState({
      pageNo: ''
    }, () => this._fetchData());
  }

  _onEndReached() {
    if (this.state.dataSource.length === 0) return;
    this.setState({
      loadMore: true,
      pageNo: this.state.dataSource[this.state.dataSource.length-1].id
    }, () => this._fetchData());
  }

  _onPress(rowData) {
    const {navigate} = this.props.navigation;
    navigate('NewsDetail', {
      title: rowData.title,
      href: 'http://36kr.com/p/' + rowData.id
    })
  }

  _renderRow(rowData) {
    return <TouchableHighlight
      underlayColor='#008b8b'
      onPress={() => this._onPress(rowData)}>
      <View style={styles.rowStyle}>
        {
          rowData.cover ?
            <Image
              style={{width: 120, height: 75, marginRight: 10}}
              source={{uri: rowData.cover}}
            /> : null
        }
        <View style={{flex: 1}}>
          <Text style={styles.rowText}>{rowData.title}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <Text style={styles.other}>{Moment(rowData.published_at).fromNow()}</Text>
            <Text style={[styles.other]}>{rowData.counters.comment} 个回复</Text>
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