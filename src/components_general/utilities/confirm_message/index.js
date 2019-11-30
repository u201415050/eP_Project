import React, {Component} from 'react';
import { View, Text, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { Card, TextMontserrat, ButtonGradient, ButtonGradientOutline  } from 'components';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

class ConfirmMessage extends Component {
  constructor(props) {
    super(props)
    
    this.state={
      orientation: isPortrait(),
    }
  }
  
  render() {
    return (
      <Modal
        //onRequestClose={() => {}}
        transparent={true}
        visible={true}
        presentationStyle="overFullScreen"
      >
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(47, 49, 51, 0.6)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={1}
        >
          <Card 
            style={
              {height: '20%', width: '30%'}
            }
          >
          <TextMontserrat>Are you sure you would like to log out?</TextMontserrat>
          <View
            style={{flexDirection: 'row'}}
          >
            <ButtonGradientOutline 
              borderRadius={5}
              title="SKIP"
              onPress={() => {
                alert('Cancel')
              }}
            />
            
          </View>
          </Card>
        </TouchableOpacity>
      </Modal>
    )
  }
}

export default ConfirmMessage;