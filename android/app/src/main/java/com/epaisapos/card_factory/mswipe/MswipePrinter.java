package com.epaisapos.card_factory.mswipe;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.common.MapBuilder;
import com.mswipetech.wisepad.sdk.Print;
import com.socsi.smartposapi.printer.Align;
import com.socsi.smartposapi.printer.FontLattice;

import java.util.Map;

import javax.annotation.Nonnull;

public class MswipePrinter extends ReactContextBaseJavaModule {
    private static final String ALIGN_BOTTOM = "ALIGN_BOTTOM";
    private static final String ALIGN_LEFT = "ALIGN_LEFT";
    private static final String ALIGN_CENTER = "ALIGN_CENTER";
    private static final String ALIGN_RIGHT = "ALIGN_RIGHT";
    private static final String ALIGN_TOP = "ALIGN_TOP";

    private static final String FontLattice_SIXTEEN = "FontLattice_SIXTEEN";
    private static final String FontLattice_TWENTY_FOUR = "FontLattice_TWENTY_FOUR";
    private static final String FontLattice_THIRTY_TWO = "FontLattice_THIRTY_TWO";
    private static final String FontLattice_FORTY_EIGHT = "FontLattice_FORTY_EIGHT";
    private static final String FontLattice_EIGHT = "FontLattice_EIGHT";

    public MswipePrinter(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = MapBuilder.newHashMap();

        constants.put(ALIGN_BOTTOM, ALIGN_BOTTOM);
        constants.put(ALIGN_LEFT, ALIGN_LEFT);
        constants.put(ALIGN_CENTER, ALIGN_CENTER);
        constants.put(ALIGN_RIGHT, ALIGN_RIGHT);
        constants.put(ALIGN_TOP, ALIGN_TOP);

        constants.put(FontLattice_SIXTEEN, FontLattice_SIXTEEN);
        constants.put(FontLattice_TWENTY_FOUR, FontLattice_TWENTY_FOUR);
        constants.put(FontLattice_THIRTY_TWO, FontLattice_THIRTY_TWO);
        constants.put(FontLattice_FORTY_EIGHT, FontLattice_FORTY_EIGHT);
        constants.put(FontLattice_EIGHT, FontLattice_EIGHT);
        /*constants.put(ALIGN_BOTTOM, ALIGN_BOTTOM);
        constants.put(ALIGN_LEFT, ALIGN_LEFT);
        constants.put(ALIGN_CENTER, ALIGN_CENTER);
        constants.put(ALIGN_RIGHT, ALIGN_RIGHT);
        constants.put(ALIGN_TOP, ALIGN_TOP);

        constants.put(FontLattice_SIXTEEN, FontLattice_SIXTEEN);
        constants.put(FontLattice_TWENTY_FOUR, FontLattice_SIXTEEN);
        constants.put(FontLattice_THIRTY_TWO, FontLattice_SIXTEEN);
        constants.put(FontLattice_FORTY_EIGHT, FontLattice_SIXTEEN);
        constants.put(FontLattice_EIGHT, FontLattice_EIGHT);*/
        return constants;
    }

    @ReactMethod
    public static void startPrintingData(String printData, String fontSize, Boolean isBold, String align,
                                         Boolean isLineBreak) {
        Log.e("startPrintingData", printData);
        Log.e("startPrintingData", fontSize);
        Log.e("startPrintingData", align);
        Align align1 = getAligment(align);
        FontLattice fontLattice = getFont(fontSize);
        Log.e("startPrintingDat Fa", fontLattice.name());
        Print.StartPrinting(printData, fontLattice, isBold, align1, isLineBreak);

    }

    @ReactMethod
    public static void startPrinting(String printData) {
        Log.e("startPrinting called", printData);
        Print.StartPrinting(printData);
    }

    @ReactMethod
    public static void newLine() {
        Print.StartPrinting();
    }

    @ReactMethod
    public static void StartPrintingImage(String filePath, String align) {
//         Bitmap icon = BitmapFactory.decodeFile("data/data/" +
//                 DeviceUtils.getPackageName(EpaisaApplication.getInstance()) + "/printing_logo.png");
        Bitmap icon = BitmapFactory.decodeFile(filePath);
        Print.StartPrintingImage(icon, Align.CENTER);
    }

    private static Align getAligment(String align) {
        if (align == null) {
            align = ALIGN_CENTER;
        }
        Align align1 = Align.CENTER;
        switch (align) {
            case ALIGN_BOTTOM:
                align1 = Align.BOTTOM;
                break;
            case ALIGN_LEFT:
                align1 = Align.LEFT;
                break;
            case ALIGN_CENTER:
                align1 = Align.CENTER;
                break;
            case ALIGN_RIGHT:
                align1 = Align.RIGHT;
                break;
            case ALIGN_TOP:
                align1 = Align.TOP;
                break;
            default:
                align1 = Align.CENTER;
                break;

        }
        return align1;
    }

    private static FontLattice getFont(String fontLattice) {
        FontLattice fontLattice1 = FontLattice.SIXTEEN;
        switch (fontLattice) {
            case FontLattice_EIGHT:
                fontLattice1 = FontLattice.EIGHT;
                break;
            case FontLattice_SIXTEEN:
                fontLattice1 = FontLattice.SIXTEEN;
                break;
            case FontLattice_THIRTY_TWO:
                fontLattice1 = FontLattice.THIRTY_TWO;
                break;
            case FontLattice_TWENTY_FOUR:
                fontLattice1 = FontLattice.TWENTY_FOUR;
                break;
            case FontLattice_FORTY_EIGHT:
                fontLattice1 = FontLattice.FORTY_EIGHT;
                break;
            default:
                fontLattice1 = FontLattice.SIXTEEN;
                break;

        }
        return fontLattice1;
    }

    /**
     * @return the name of this module. This will be the name used to
     * {@code require()} this module from javascript.
     */
    @Nonnull
    @Override
    public String getName() {
        return "MswipePrinter";
    }
}
