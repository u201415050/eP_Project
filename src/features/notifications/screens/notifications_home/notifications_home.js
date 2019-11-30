import React, { Component, Fragment } from 'react';
import {
  ImageBackground,
  Dimensions,
  View,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import Header from '../../../customers/components/header';
import { isTablet } from '../../../cash_register/constants/isLandscape';
import NotificationItem from './components/notification_item.js/notification_item';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import realm from '../../../../services/realm_service';
import { TextMontserrat } from '../../../modal_customer/components/texts';
import colors from '../../../my_account/styles/colors';
import Notification from '../../../../services/realm_models/notification';
import { epaisaRequest } from '../../../../services/epaisa_service';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class NotificationsHome extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    orientation: isPortrait(),
    notifications: [],
  };

  componentDidMount() {
    epaisaRequest('', '/notifications/list', 'GET')
      .then(data => {
        if (data.success) {
          const { response } = data;
          const notifications = response.Notifications;
        }
      })
      .catch(err => console.log({ err }));
    const user = realm.objectForPrimaryKey('User', 0);
    const { userId } = user;
    this.setState({
      notifications: Array.from(
        Notification.getById(userId).sorted('date', true)
      ),
    });
    // const id = await AsyncStorage.getItem('@CURRENT_USER_ID');
    // notifications_service.list(`userId = ${id}`).then(notifications => {
    //   this.setState({
    //     notifications: notifications.sorted('date', true).map(x => {
    //       return {
    //         ...x,
    //         date: moment(x.date).format('DD-MMM-YYYY'),
    //         read: j => {
    //           j.readed = true;
    //           notifications_service.update();
    //           this.setState({ updated: +new Date() });
    //           updateRow(() => {
    //             x.readed = true;
    //           });
    //         },
    //       };
    //     }),
    //   });
    // });
  }

  render() {
    return (
      <Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor:Platform.OS==="ios"&&isTablet?'#001C57': colors.darkBlue }} />

        <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkWhite }}>
          <ImageBackground
            source={
              this.state.orientation
                ? require('../../../../assets/images/bg/loadingBackground.png')
                : require('./assets/images/background_landscape.png')
            }
            style={{
              flex: 1,
              backgroundColor: colors.darkWhite,
            }}
          >
            <View
              style={[
                isTablet ? { flexDirection: 'row', height: '100%' } : null,
              ]}
            >
              <View
                style={{
                  height: '100%',
                  width: '100%',
                }}
              >
                <Header
                  label="NOTIFICATIONS"
                  navigation={this.props.navigation}
                  renderRightButton={false}
                />
                <ScrollView
                  contentContainerStyle={{
                    paddingHorizontal: wp(isTablet ? '2%' : '3%'),
                    paddingVertical: hp('1.5%'),
                  }}
                >
                  {this.state.notifications.length > 0 &&
                    this.state.notifications.map((notification, i) => (
                      <NotificationItem
                        onPress={() => {
                          notification.read(notification);
                          this.forceUpdate();
                          // alert(notification.title);
                        }}
                        key={`notification_${i}`}
                        data={{
                          title: notification.title,
                          message: notification.body,
                          date: moment(notification.date).format('DD-MMM-YYYY'),
                          readed: notification.readed,
                        }}
                      />
                    ))}
                  {this.state.notifications.length === 0 && (
                    <View>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <TextMontserrat
                          style={{
                            fontWeight: '600',
                            color: '#888888',
                            marginVertical: 20,
                            fontSize: 18,
                          }}
                        >
                          You have no new notifications
                        </TextMontserrat>
                        <Image source={require('./assets/images/bell.png')} />
                      </View>
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          </ImageBackground>
        </SafeAreaView>
      </Fragment>
    );
  }
}
export default NotificationsHome;
