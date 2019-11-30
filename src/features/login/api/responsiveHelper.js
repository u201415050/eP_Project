
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const isTablet = width > 460;
const getCardPadding = () => {
    if(isTablet) return 30;

    return 30
};

const isPortrait = () => {
    const dim = Dimensions.get('window');
    if(dim.height >= dim.width){
      return true;
    }else {
      return false;
    }
};

export {getCardPadding, isPortrait};