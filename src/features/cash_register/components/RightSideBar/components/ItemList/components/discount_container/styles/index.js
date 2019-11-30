import { Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isTablet } from '../../../../../../../../transactions/constants/isLandscape';

const isPortrait = () => {
  const dim = Dimensions.get('window');
  if (dim.height >= dim.width) {
    return true;
  } else {
    return false;
  }
};

export const styles = {
  color: '#FD853D',
  fontWeight: '600',
  fontSize: !isTablet ? wp('3.1%') : hp('2.1%'),
};
