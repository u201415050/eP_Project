package com.epaisapos;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.zmxv.RNSound.RNSoundPackage;
import codes.simen.IMEI.IMEI;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.levelasquez.androidopensettings.AndroidOpenSettingsPackage;
import com.horcrux.svg.SvgPackage;
import com.nuttawutmalee.RCTBluetoothSerial.RCTBluetoothSerialPackage;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;

import io.invertase.firebase.RNFirebasePackage;

import com.bluroverly.SajjadBlurOverlayPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.github.xfumihiro.react_native_image_to_base64.ImageToBase64Package;
import fr.snapp.imagebase64.RNImgToBase64Package;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.imagepicker.ImagePickerPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.fnp.reactnativesyncadapter.SyncAdapterPackage;
import com.solinor.bluetoothstatus.RNBluetoothManagerPackage;
import io.realm.react.RealmReactPackage;
import com.instabug.reactlibrary.RNInstabugReactnativePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import org.wonday.orientation.OrientationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.imagepicker.ImagePickerPackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rnbiometrics.ReactNativeBiometricsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;
import org.pgsqlite.SQLitePluginPackage;
import com.sh3rawi.RNAudioPlayer.*;
import com.epaisapos.ImageConverterPackage;
import co.realtime.reactnativemessagingandroid.RealtimeMessagingPackage; //<-- import
import com.kevinejohn.RNMixpanel.*;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(new RNMixpanel(), new MainReactPackage(),
            new RNSoundPackage(), new IMEI(), new RNCWebViewPackage(),
          new AndroidOpenSettingsPackage(), new SvgPackage(), new RCTBluetoothSerialPackage(),
          new RNBackgroundFetchPackage(), new RNFirebasePackage(), new SajjadBlurOverlayPackage(),
          new ImageResizerPackage(), new ImageToBase64Package(), new RNImgToBase64Package(),
          new ImageConverterPackage(), new BackgroundTimerPackage(), new ImagePickerPackage(),
          new RNFusedLocationPackage(), new ReactNativeOneSignalPackage(), new SyncAdapterPackage(),
          new RNBluetoothManagerPackage(), new RealmReactPackage(), new MswipePrinterPackage(), new TeamViewerPackage(),
          // Production
          // new RNInstabugReactnativePackage.Builder("833b62157acfd01a270b2a8e8ab76a80",
          // MainApplication.this)
          // Deveplopment
          new RNInstabugReactnativePackage.Builder("34835095affedbb4c767f5bbfee484b0", MainApplication.this)
              .setInvocationEvent("shake", "screenshot").setPrimaryColor("#1D82DC").setFloatingEdge("left")
              .setFloatingButtonOffsetFromTop(250).build(),
          new VectorIconsPackage(), new OrientationPackage(), new LinearGradientPackage(), new ExtraDimensionsPackage(),
          new RNDeviceInfo(), new CardPaymentPackage(), new RealtimeMessagingPackage(),
          new ReactNativeBiometricsPackage(), new RNGestureHandlerPackage(), new SQLitePluginPackage(),
          new RNAudioPlayer());

    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

}
