import React, {Component} from 'react';
import {
  Platform,
  ScrollView,
  RefreshControl,
  Dimensions,
  Share,
  Linking,
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import Web from 'react-native-webview2';
import Icon from "react-native-vector-icons/FontAwesome";
import Collection from '../models/Collection';
import Config from '../config';

export default class NewsDetail extends Component {
  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.title}`,
    headerTitleStyle: {
      paddingRight: Platform.OS === 'ios' ? 0 : 60
    },
    headerRight: <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
      <Icon
        name="heart-o"
        size={20}
        color="#000"
        style={{paddingRight: 10}}
        onPress={async () => {
          const newCollection = new Collection({
            title: navigation.state.params.title,
            href: navigation.state.params.href
          });
          let arr = [];
          const collections = await AsyncStorage.getItem(Config.collectionsKey);
          if(collections) {
            arr = JSON.parse(collections);
            const collection = await arr.filter((collection) => {
              return collection.href === newCollection.href && collection.title === newCollection.title;
            });
            if (collection.length > 0) return;
          }
          arr.push(newCollection);
          await AsyncStorage.setItem(Config.collectionsKey, JSON.stringify(arr));
          alert('收藏成功');
        }}
      />
      <Icon
        name="firefox"
        size={20}
        color="#000"
        style={{paddingRight: 10}}
        onPress={() => {
          Linking.openURL(navigation.state.params.href)
        }}
      />
      <Icon
        name="share-alt"
        size={20}
        color="#000"
        style={{paddingRight: 10}}
        onPress={() => {
          Share.share({
            message: navigation.state.params.title + ' \r\n' + navigation.state.params.href + ' \r\n' + '分享来自ITNews'
          })
            .then(() => {
            })
            .catch((error) => console.log(error.message));
        }}
      />
    </View>
  });

  setMessage(value) {
    alert(value);
  }

  constructor(props) {
    super(props);
    this.state = ({
      height: 0,
      refreshing: true,
      title: this.props.navigation.state.params.title,
      href: this.props.navigation.state.params.href,
    });
  }

  _onRefresh() {
    this.setState({
      refreshing: true,
    });
    this.refs.webview.reload();
  }

  _onLoadEnd() {
    this.setState({
      height: Dimensions.get('window').height,
      refreshing: false
    })
  }

  render() {
    return (
      <ScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
        <Web
          canGoBack={true}
          ref="webview"
          source={{uri: this.state.href}}
          onLoadEnd={this._onLoadEnd.bind(this)}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // backgroundColor: 'black',
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  menuTrigger: {
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  menuTriggerText: {
    // color: 'lightgrey',
    fontWeight: '600',
    fontSize: 20
  },
  disabled: {
    color: '#ccc'
  },
  divider: {
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  content: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  contentText: {
    fontSize: 18
  },
  dropdown: {
    width: 300,
    borderColor: '#999',
    borderWidth: 1,
    padding: 5
  },
  dropdownOptions: {
    marginTop: 30,
    borderColor: '#ccc',
    borderWidth: 2,
    width: 300,
    height: 200
  }
});