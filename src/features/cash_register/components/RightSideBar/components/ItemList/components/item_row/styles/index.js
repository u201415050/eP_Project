import { Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../../../../../../constants/isLandscape';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

export const styles = {
  color: '#555555',
  fontWeight: '500',
  fontSize: !isTablet ? wp('3.4%') : hp('2.1%'),
};
