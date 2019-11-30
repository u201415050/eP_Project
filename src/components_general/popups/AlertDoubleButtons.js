import React from 'react';
import { View, Modal } from 'react-native';
import ButtonGradient from '../../features/payments/screens/cash/components/transaction_details/components/buttonGradientColor/ButtonGradient';
import TextMontserrat from '../texts/textMontserrat';
import { isTablet } from '../../features/my_account/constants/isLandscape';
import {heightPercentageToDP, heightPercentageToDP as hp,} from 'react-native-responsive-screen';
import ButtonGradientPay from "../buttons/ButtonGradientPay";
const AlertDoubleButtons = ({
  visible,
  negativeAction,
  positiveAction,
  message,
  close,
  title,
  titleConfirm,
  titleCancel
}) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={close}
      animationType="fade"
      transparent={true}
    >
      <View
        style={{
          width: '100%',
          flex: 1,
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: heightPercentageToDP('1%'),
            width: isTablet ? '40%' : '75%',
            backgroundColor: 'white',
            padding: 20,
            elevation: 6,
          }}
        >
          {title && (
            <TextMontserrat
              style={{
                color: 'rgba(0,0,0,0.7)',
                fontSize: heightPercentageToDP('3%'),
                fontWeight: '600',
                marginBottom: 5,
              }}
            >
              {title}
            </TextMontserrat>
          )}
          <TextMontserrat
            style={{
              color: 'rgba(0,0,0,0.7)',
              fontSize: heightPercentageToDP('2%'),
              fontWeight: '600',
              marginBottom: 5,
              textAlignVertical: "center",
              textAlign: "center",
            }}
          >
            {message}
          </TextMontserrat>
          <View
            style={{
              flexDirection: 'row',
              marginTop: heightPercentageToDP('3%'),
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ width: '48%' }}>
                <ButtonGradientPay
                onPress={() => {
                  positiveAction();
                  close();
                }}
                radius={heightPercentageToDP('3.5%')}
                firstColor={'#114B8C'}
                secondColor={'#0079AA'}
                title={titleConfirm || 'YES'}
              />
            </View>
            <View style={{ width: '48%'}}>
              <ButtonGradientPay
                onPress={() => {
                  negativeAction();
                  close();
                }}
                radius={heightPercentageToDP('3.5%')}
                firstColor={'#114B8C'}
                secondColor={'#0079AA'}
                title={titleCancel || 'NO'}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default AlertDoubleButtons;
