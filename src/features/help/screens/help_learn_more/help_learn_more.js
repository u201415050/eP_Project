import React, {Component} from 'react';
import {
    Dimensions,
    View,
    Text,
    Image,
    StyleSheet,
    ImageBackground,
    Platform,
} from 'react-native';
import SideSwipe from 'react-native-sideswipe';
import {TextMontserrat, ButtonGradient} from 'components';
import {isTablet} from '../../../my_account/constants/isLandscape';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Swiper from 'react-native-swiper';

export default class HelpLearnMore extends Component {
    static navigationOptions = {
        header: null,
    };

    state = {
        currentIndex: 0,
    };

    images = [
        {
            title: 'Welcome to ePaisa',
            subtitle: 'Get started using the app now and see the main features.',
            image: isTablet
                ? require('./images/welcomeToEpaisaTablet.png')
                : require('./images/welcomeToEpaisa.png'),
        },
        {
            title: 'Receive Payments',
            subtitle:
                'Receive payments is cash, debit or credit cards and many other methods.',
            image: isTablet
                ? require('./images/ManageYourBusinessTablet.png')
                : require('./images/ManageYourBusiness.png'),
        },
        {
            title: 'Manage your Business',
            subtitle:
                'Manage your products, inventory and sales with an intuitive interface.',
            image: isTablet
                ? require('./images/ReceivePaymentsTablet.png')
                : require('./images/ReceivePayment.png'),
        },
        // {
        //   title: 'Value Added Services',
        //   subtitle: 'Money transfer, phone recharge, bus tickets and many more.',
        //   image: require('./images/wizard_four.jpg'),
        // },
    ];
    // images = []

    render = () => {
        return (
            <View style={{flex: 1}}>
                <Swiper
                    loop={false}
                    style={{flex: Platform.OS === 'ios' ? 0 : 1}}
                    paginationStyle={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        marginBottom: hp('1%'),
                        paddingLeft: wp('8%'),
                    }}
                    dotStyle={{
                        width: hp('2%'),
                        height: hp('2%'),
                        borderRadius: 30,
                        backgroundColor: 'lightgray',
                    }}
                    activeDotStyle={{
                        width: hp('2%'),
                        height: hp('2%'),
                        borderRadius: 30,
                        backgroundColor: '#174285',
                    }}
                >
                    {this.images.map(item => {
                        return (
                            <View style={{flex: 1}}>
                                <ImageBackground
                                    source={item.image}
                                    style={{flex: 1}}
                                    resizeMode={'cover'}
                                >
                                    <View style={{alignItems: "center", justifyContent: "center" ,display:"flex" ,height:"100%"}}>
                                        <TextMontserrat
                                            style={{
                                                width: '100%',
                                                fontSize: isTablet ? hp('4%') : wp('7%'),
                                                fontWeight: '700',
                                                color: "white",
                                                marginTop: hp('5%'),
                                                paddingLeft: isTablet ? wp('5%') : wp('8%'),
                                                //backgroundColor: 'green'
                                            }}
                                        >
                                            {item.title}
                                        </TextMontserrat>
                                        <TextMontserrat
                                            style={{
                                                width: '100%',
                                                fontSize: isTablet ? hp('2.5%') : wp('4.5%'),
                                                fontWeight: '600',
                                                color: 'white',
                                                marginTop: hp('2.5%'),
                                                paddingHorizontal: isTablet ? wp('5%') : wp('8%'),
                                                //backgroundColor: 'red'
                                            }}
                                        >
                                            {item.subtitle}
                                        </TextMontserrat>
                                    </View>
                                </ImageBackground>
                            </View>
                        );
                    })}
                </Swiper>
                <View
                    style={{
                        // padding: 30,
                        height: hp('8%'),
                        paddingRight: isTablet ? wp('5%') : wp('7%'),
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: hp('3%'),
                        width: isTablet ? wp('100%') : wp('100%'),
                    }}
                >
                    <ButtonGradient
                        labelSize={isTablet ? hp('2.5%') : wp('3.5%')}
                        style={
                            isTablet
                                ? {width: wp('20%'), height: hp('8%')}
                                : {width: wp('35%'), height: hp('8%')}
                        }
                        title={'Get Started'}
                        onPress={() => this.props.navigation.goBack()}
                    />
                </View>
            </View>
        );
    };
}
