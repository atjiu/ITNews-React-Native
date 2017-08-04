import React, {Component} from 'react';
import {ScrollView, RefreshControl, Dimensions} from 'react-native';
import Web from 'react-native-webview2';

export default class NewsDetail extends Component {
  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.title}`,
  });
  constructor(props) {
    super(props);
    this.state = ({
      height: 0,
      refreshing: true,
      html: '',
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