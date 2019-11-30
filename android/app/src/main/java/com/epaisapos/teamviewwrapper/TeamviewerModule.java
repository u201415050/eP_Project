package com.epaisapos.teamviewwrapper;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.modules.core.DeviceEventManagerModule;


import java.util.Map;

import javax.annotation.Nonnull;

public class TeamviewerModule extends ReactContextBaseJavaModule implements ScreenSharingWrapper.RunningStateListener {


    private final ReactApplicationContext reactContext;

    public TeamviewerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }



/**onResume*/
    @ReactMethod
    public void register() {
        // ensure the correct reference is listening
        Log.e("team","regis");
        ScreenSharingWrapper.getInstance().setRunningStateListener(this);
    }
/*onPause*/
    @ReactMethod
    public void unRegister() {
        Log.e("team","regis");
        // don't keep the reference when activity is destroyed
        ScreenSharingWrapper.getInstance().setRunningStateListener(null);
    }

    @ReactMethod
    public void startScreenSharing(String serviceCaseName) {
        Log.e("team","startScreenSharing");
        ScreenSharingWrapper.getInstance().startTeamViewerSession(getCurrentActivity(), serviceCaseName);
        boolean buttonEnabled = !ScreenSharingWrapper.getInstance().isSessionRunning();
        emitSessionState(buttonEnabled);
//        txtShareScreen.setEnabled(buttonEnabled);
    }

    /**
     * @return the name of this module. This will be the name used to
     * {@code require()} this module from javascript.
     */

    @Nonnull
    @Override
    public String getName() {
        return "TeamviewerModule";
    }

    /**
     * Will be called on running state changes of the TeamViewer session.
     *
     * @param isRunning New session state.
     */
    @Override
    public void onRunningStateChange(boolean isRunning) {
        boolean buttonEnabled = !ScreenSharingWrapper.getInstance().isSessionRunning();
        emitSessionState(buttonEnabled);
    }

    private void emitSessionState(boolean buttonEnabled) {
        Log.e("buttonEnabled",String.valueOf(buttonEnabled));
        WritableMap payload = Arguments.createMap();
        // Put data to map
        payload.putBoolean("isRunning", buttonEnabled);
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("teamViewerSessionState", payload);
//        txtShareScreen.setEnabled(buttonEnabled);
    }
}
