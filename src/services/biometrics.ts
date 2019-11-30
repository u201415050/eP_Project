import Biometrics from 'react-native-biometrics';
import DeviceInfo from 'react-native-device-info';
interface BiometricsInterface {
  touchId: string;
  faceId: boolean;
  sensor: string;
}
export default new class BiometricsService implements BiometricsInterface {
  touchId: string;
  faceId: boolean;
  sensor: string;
  async init() {
    this.sensor = await Biometrics.isSensorAvailable();
    //Biometrics.isSensorAvailable().then(x => alert(x));
    this.touchId = this.sensor;
    this.faceId = this.sensor === 'FaceID';
    return;
  }
}();
