import React, {Component} from 'react';
import {Platform, ScrollView, RefreshControl, Dimensions, Share, Linking, View} from 'react-native';
import Web from 'react-native-webview2';
import Icon from "react-native-vector-icons/FontAwesome";

export default class NewsDetail extends Component {
  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.title}`,
    headerTitleStyle: {
      // color: '#ff0000',
      paddingRight: Platform.OS === 'ios' ? 0 : 40
    },
    headerRight: <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
      <Icon
        name="firefox"
        size={22}
        color="#000"
        style={{paddingRight: 20}}
        onPress={() => {
          Linking.openURL(navigation.state.params.href)
        }}
      />
      <Icon
        name="share-alt"
        size={22}
        color="#000"
        style={{paddingRight: 20}}
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
    return <ScrollView
      style={{flex: 1}}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}
        />
      }>
      <Web
        ref="webview"
        source={{uri: this.state.href}}
        onLoadEnd={this._onLoadEnd.bind(this)}
      />
    </ScrollView>
  }

}