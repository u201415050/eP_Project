import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    Dimensions,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import colors from '../../styles/colors'
import EStyleSheet from 'react-native-extended-stylesheet';
import {isTablet} from '../../constants/isLandscape';
import {TRANSACTION_SCREEN} from './../../../../navigation/screen_names';
import NavigationService from 'services/navigation';
import Search from 'react-native-vector-icons/FontAwesome';
import Settings from 'react-native-vector-icons/FontAwesome5';

export default class Header extends Component {


    navigateTo = (screen) => {
        return NavigationService.navigate(screen);
    }

    render() {
        const {openTransaction, onPressCloseButton} = this.props
        const {label, cant, toggleSide, toggleRight, toggleOptions} = this.props
        const isLandscape = isTablet
        return (
            <View style={styles.container}>

                <TouchableOpacity style={styles.iconLeft} onPress={toggleSide}>
                </TouchableOpacity>
                <Text style={[styles.titleCentral]}>{label}</Text>

                {
                    !isLandscape ?
                        <View style={styles.iconRight}>
                            <TouchableOpacity onPress={openTransaction}
                                              style={[styles.iconItemSetting, {width: hp('4.3%'), height: hp('4.3%')}]}
                                              onPress={onPressCloseButton}>
                                <Settings color="gray" name="sliders-h" size={hp('2.4%')}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.iconItem, {width: hp('4.5%'), height: hp('4.5%')}]}>

                            </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.iconRight}>
                            <TouchableOpacity style={[styles.iconItem, {
                                width: hp('4.5%'),
                                height: hp('4.5%'),
                                marginRight: hp('3%')
                            }]}>
                            </TouchableOpacity>
                        </View>
                }
            </View>
        );
    }
}

const styles = EStyleSheet.create({
    container: {

        width: '100%',
        justifyContent: 'center',
        height: hp('7%'),
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingHorizontal: 22,
        elevation: 0
    },
    iconLeft: {
        position: 'absolute',
        height: '100%',
        left: 20,
        color: colors.white,
        fontSize: 17,
        fontWeight: '700',
        justifyContent: 'center',

    },
    badge: {
        position: 'absolute',
        right: -hp('0.6%'),
        top: -hp('0.6%'),
        backgroundColor: colors.gray,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        paddingHorizontal: hp('0.5'),
    },
    badgeText: {
        color: colors.white,
        fontSize: 9,
        fontFamily: 'Montserrat-Bold'
    },
    stack: {
        position: 'absolute',
        left: '27%',
        top: '5%',
        alignItems: 'center',
        justifyContent: 'center',

    },
    stackText: {
        color: colors.white,
        fontSize: 13,
        fontFamily: 'Montserrat-Bold',

    },
    iconRight: {
        flexDirection: 'row',
        position: 'absolute',
        height: '100%',
        right: hp('2.4%'),
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconItem: {
        height: '100%',
        justifyContent: 'center',
        marginHorizontal: hp('0.3%'),
        alignItems: 'center',

        borderRadius: 20,
    },
    iconItemSetting: {
        justifyContent: 'center',
        marginHorizontal: hp('0.3%'),
        alignItems: 'center',
        width: hp('5%'),
        height: hp('5%'),

        backgroundColor: 'white',

        borderRadius: 20,
    },
    marginExtra: {
        marginLeft: 12,
    },
    iconContainer: {
        flexDirection: 'row',
        height: '100%',
        justifyContent: 'space-between'
    },
    titleCentral: {
        color: colors.white,
        fontSize: hp('2.5%'),
        letterSpacing: 2,
        textAlign: 'center',
        fontFamily: 'Montserrat-Bold',

    },
    '@media (min-width: 200) and (max-width: 400)': { // media queries
        badge: {
            right: -hp('1.3%'),
            top: -hp('1.3%'),
        },
    }

});
