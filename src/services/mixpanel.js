//import Mixpanel from 'react-native-mixpanel';

class MixpanelService {
  constructor() {
    this.mp = Mixpanel;
  }
  init(token) {
    this.mp.sharedInstanceWithToken(token);
  }
  track(event_name) {
    this.mp.track(event_name);
  }
}
export default new MixpanelService();
