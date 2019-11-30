import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

const stylesButtons = EStyleSheet.create({
  container: {
    width: '100%',
    height: '5.5rem',
    flexDirection: 'row',
    elevation: 5,
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWhite: {
    flex: 1.8,
    backgroundColor: 'white',
    borderColor: '#174285',
    borderWidth: 1,
    borderTopLeftRadius: 12,
  },
  buttonAccept: {
    flex: 3.2,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderTopRightRadius: 12,
  },
  textWhite: {
    color: '#174285',
  },
  text: {
    color: '#FFFFFF',
    fontSize: '1.8rem',
    fontFamily: 'Montserrat-SemiBold',
  },
});
export default class ESignModal extends Component {
  render() {
    const {
      modalBackdrop,
      modalContent,
      modalTitleContainer,
      modalTermsTitle,
      modalBody,
      modalTermsText,
    } = styles;
    return (
      <Modal
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {}}
        presentationStyle="overFullScreen"
      >
        <View style={modalBackdrop}>
          <View style={modalContent}>
            {/* <View style={{flexDirection:'row',backgroundColor:'transparent',borderRadius:5}}>
                            <TouchableOpacity style={{backgroundColor: '#174285', width:'100%', borderTopLeftRadius: 10, borderTopRightRadius:10}} onPress={this.props.closeModal }>
                                <Text style={{color:'#fff', fontSize:16, fontWeight:'bold', textAlign:'center', paddingVertical:10,letterSpacing:1.5}}>CLOSE</Text>
                            </TouchableOpacity>
                        </View> */}
            <View style={stylesButtons.container}>
              <TouchableOpacity
                style={[stylesButtons.button, stylesButtons.buttonWhite]}
                onPress={this.props.decline}
              >
                <Text style={[stylesButtons.text, stylesButtons.textWhite]}>
                  DECLINE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[stylesButtons.button, stylesButtons.buttonAccept]}
                onPress={this.props.accept}
              >
                <LinearGradient
                  colors={['#174285', '#0079AA']}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 1 }}
                  style={stylesButtons.gradient}
                >
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={stylesButtons.text}>ACCEPT</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={true}>
              <View style={{ flex: 1 }}>
                <View style={modalTitleContainer}>
                  <Text style={modalTermsTitle}>e-Sign Consent</Text>
                </View>
                <View style={modalBody}>
                  <View>
                      <Text style={[modalTermsText, {paddingHorizontal: '2.5%'}]}>
                        ePaisa Services Pvt Ltd. and its affiliates and third-party service providers (“ePaisa”) may need 
                        to provide you with certain communications, notices, agreements, billing statements, or disclosures 
                        in writing (“Communications”) regarding our Services. Your agreement to this E-sign Consent confirms 
                        your ability and consent to receive Communications electronically from ePaisa, its affiliates, and 
                        its third-party service providers, rather than in paper form, and to the use of electronic signatures 
                        in our relationship with you (“Consent”). If you choose not to agree to this Consent or you withdraw 
                        your consent, you may be restricted from using the Services. {'\n'}
                        {'\n'}
                      </Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={modalTitleContainer}>
                  <Text style={[modalTermsTitle, {width:'100%', paddingHorizontal:'5%'}]}>Electronic Delivery of Communications and Use of Electronic Signatures</Text>
                </View>
                <View style={modalBody}>
                  <View>
                      <Text style={[modalTermsText, {paddingHorizontal: '2.5%'}]}>
                        Under this Consent, ePaisa may provide all Communications electronically by email, 
                        by text message, or by making them accessible via ePaisa websites or applications. 
                        Communications include, but are not limited to, (1) agreements and policies required 
                        to use the Services (e.g. this Consent, the ePaisa Privacy Notice, the ePaisa Seller Agreement.  
                        (2) payment authorizations and transaction receipts or confirmations, (3) account statements 
                        and history, (4) and all federal and state tax statements and documents. We may also use 
                        electronic signatures and obtain them from you. {'\n'}
                        {'\n'}
                      </Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View >
                  <Text style={[modalTermsTitle, {width:'100%', paddingHorizontal:'5%'}]}>System Requirements</Text>
                </View>
                <View style={modalBody}>
                  <View>
                      <Text style={[modalTermsText, {paddingHorizontal: '2.5%'}]}>
                        To access and retain the electronic Communications, you will need the following:{'\n'}
                      </Text>
                      <View style={{width:'100%', paddingHorizontal:'5%'}}>
                          <View style={{flexDirection:'row', paddingRight:'5%'}}>
                            <Text style={[modalTermsText,{margin:0}]}>•	</Text>
                            <Text style={[modalTermsText,{margin:0}]}>A computer or mobile device with Internet or mobile connectivity.{'\n'}</Text>
                          </View>
                          <View style={{flexDirection:'row'}}>
                            <Text style={[modalTermsText,{margin:0}]}>•	</Text>
                            <Text style={[modalTermsText,{margin:0}]}>For desktop website-based Communications:{'\n'}</Text>
                          </View>
                          <View style={{width:'100%', paddingLeft:'5%'}}>
                            <View style={{flexDirection:'row'}}>
                              <Text style={[modalTermsText,{margin:0}]}>⦿	</Text>
                              <Text style={[modalTermsText,{margin:0, flex:1, paddingRight:'5%'}]}>Recent web browser that supports TLS 1.2 and above;{'\n'}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                              <Text style={[modalTermsText,{margin:0}]}>⦿	</Text>
                              <Text style={[modalTermsText,{margin:0, flex:1, paddingRight:'5%'}]}>The browser must have cookies enabled. Use of browser extensions may impair full website functionality; and{'\n'}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                              <Text style={[modalTermsText,{margin:0}]}>⦿	</Text>
                              <Text style={[modalTermsText,{margin:0, flex:1, paddingRight:'5%'}]}>Minimum recommended browser standards are the most recent versions of Mozilla Firefox (see http://www.mozilla.com for latest version), Apple Safari (see http://www.apple.com/safari for latest version), or Google Chrome (see http://www.google.com/chrome for latest version).{'\n'}</Text>
                            </View>
                          </View>
                      </View>
                      <View style={{width:'100%', paddingLeft:'5%'}}>
                        <Text style={[modalTermsText,{margin:0}]}>
                          •	For application-based Communications:{'\n'}
                        </Text>
                        <View style={{width:'100%', paddingHorizontal:'5%'}}>
                          <View style={{flexDirection:'row'}}>
                            <Text style={[modalTermsText,{margin:0}]}>⦿	</Text>
                            <Text style={[modalTermsText,{margin:0, flex:1, paddingRight:'5%'}]}>A recent device operating system that supports text messaging, downloading, and applications from the Apple App Store or Google Play store; and{'\n'}</Text>
                          </View>
                          <View style={{flexDirection:'row'}}>
                            <Text style={[modalTermsText,{margin:0}]}>⦿	</Text>
                            <Text style={[modalTermsText,{margin:0, flex:1, paddingRight:'5%'}]}>The most recent versions of Apple Safari or Google Chrome on iOS or Google Chrome for Android OS.{'\n'}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{width:'100%', paddingHorizontal:'5%'}}>
                          <View style={{flexDirection:'row'}}>
                            <Text style={[modalTermsText,{margin:0}]}>•	</Text>
                            <Text style={[modalTermsText,{margin:0}]}>Access to the email address used to create an account for Square Services.{'\n'}</Text>
                          </View>
                          <View style={{flexDirection:'row'}}>
                            <Text style={[modalTermsText,{margin:0}]}>•	</Text>
                            <Text style={[modalTermsText,{margin:0}]}>Sufficient storage space to save Communications and/or a printer to print them.{'\n'}</Text>
                          </View>
                          <View style={{flexDirection:'row'}}>
                            <Text style={[modalTermsText,{margin:0}]}>•	</Text>
                            <Text style={[modalTermsText,{margin:0}]}>If you use a spam filter that blocks or re-routes emails from senders not listed in your email address book, you must add noreply@epaisa.com to your email address book.</Text>
                          </View>
                        <Text style={[modalTermsText,{margin:0}]}>
                          {'\n'}
                          {'\n'}
                        </Text>
                      </View>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={modalTitleContainer}>
                  <Text style={[modalTermsTitle, {width:'100%', paddingHorizontal:'5%'}]}>Paper Delivery of Communications</Text>
                </View>
                <View style={modalBody}>
                  <View>
                      <Text style={[modalTermsText, {paddingHorizontal: '2.5%'}]}>
                        You have the right to receive Communications in paper form. To request a paper copy of 
                        any Communication at no charge, please write to ePaisa Services Private Limites., C-25A,  
                        Market Road, Vasant Vihar, New Delhi, 110057, India, Attn: Customer Support - Legal (“ePaisa Address”) 
                        within 180 days of the date of the Disclosure, specifying in detail the Communication you would like to receive.{'\n'}
                        {'\n'}
                      </Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={modalTitleContainer}>
                  <Text style={[modalTermsTitle, {width:'100%', paddingHorizontal:'5%'}]}>Withdrawal of Consent to Electronic Communications</Text>
                </View>
                <View style={modalBody}>
                  <View>
                      <Text style={[modalTermsText, {paddingHorizontal: '2.5%'}]}>
                        You may withdraw your consent to receive electronic Communications at any time, 
                        by writing to the ePaisa Address. However, withdrawal of your consent to receive 
                        electronic Communications may result in termination of your access to Services. 
                        Any withdrawal of your consent will be effective after a reasonable period of 
                        time for processing your request. {'\n'}
                        {'\n'}
                      </Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={modalTitleContainer}>
                  <Text style={[modalTermsTitle, {width:'100%', paddingHorizontal:'5%'}]}>Updating Your Email Address</Text>
                </View>
                <View style={modalBody}>
                  <View>
                      <Text style={[modalTermsText, {paddingHorizontal: '2.5%'}]}>
                        You can change your email address by writing to the ePaisa Address. 
                        ou may also be able to change your email address yourself through the Services. {'\n'}
                        {'\n'}
                      </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = EStyleSheet.create({
  /*Terms Modal*/
  modalBackdrop: {
    backgroundColor: 'rgba(47, 49, 51, 0.6)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '92%',
    height: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // height: '5rem',
    paddingTop: '2%',
    paddingBottom: '1%'
  },
  modalBody: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    padding: 10,
    paddingTop: 0,
  },
  modalTermsTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: '1.8rem',
    fontFamily: 'Montserrat-Bold',
    color: '#174285',
  },
  modalTermsButtonContainer: {
    flex: 0.1,
    justifyContent: 'flex-end',
  },
  modalTermsButtonText: {
    fontSize: '2rem',
  },
  modalTermsBottom: {},
  modalTermsText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: '1.2rem',
  },

   
});
