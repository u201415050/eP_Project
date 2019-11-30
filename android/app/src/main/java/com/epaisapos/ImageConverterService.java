package com.epaisapos;

import android.widget.Toast;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.io.File;
import java.util.HashMap;

public class ImageConverterService extends ReactContextBaseJavaModule {

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  @Override
  public String getName() {
    return "ImageConverterService";
  }

  public ImageConverterService(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @ReactMethod
  public void show(String message, int duration) {
    Toast.makeText(getReactApplicationContext(), message, duration).show();

  }

  @ReactMethod
  public String convertImage(String message) {

    // File sd = //Environment.getExternalStorageDirectory();
    return message;// imageBitmap.getHeight();

  }
}