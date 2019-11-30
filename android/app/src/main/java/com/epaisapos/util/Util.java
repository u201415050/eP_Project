package com.epaisapos.util;

import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

import com.epaisapos.R;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public class Util {

    public static WritableMap buildFailureResponse(String errorCode, String errorMessage) {
        WritableMap failureResponse = Arguments.createMap();
        failureResponse.putBoolean("success", false);
        failureResponse.putString("errorCode", errorCode);
        failureResponse.putString("errorMessage", errorMessage);
        return failureResponse;
    }

    public static boolean isBluetoothEnabled(Context context) {
        boolean isBluetoothSupported = context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH);
        BluetoothAdapter btAdapter = BluetoothAdapter.getDefaultAdapter();
        return isBluetoothSupported && btAdapter != null && btAdapter.isEnabled();
    }

    public static boolean isNetworkAvailable(Context context) {
        ConnectivityManager connectivityManager
                = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }

    public static String getErrorMessage(Context context, String rs) {


        if (rs == null) {
            return context.getString(R.string.err207_12);
        }
        if (rs.equals("207_01")) {
            return context.getString(R.string.err207_01);
        }
        if (rs.equals("EP508")) {
            return "Transaction Reversed";
        } else if (rs.equals("8888")) {
            return context.getString(R.string.err8888);

        } else if (rs.equals("207_02")) {
            return context.getString(R.string.err207_02);

        } else if (rs.equals("207_03")) {
            return context.getString(R.string.err207_03);

        } else if (rs.equals("207_04")) {
            return context.getString(R.string.err207_04);

        } else if (rs.equals("207_05")) {
            return context.getString(R.string.err207_05);

        } else if (rs.equals("207_06")) {
            return context.getString(R.string.err207_06);

        } else if (rs.equals("207_07")) {
            return context.getString(R.string.err207_06);

        } else if (rs.equals("207_08")) {
            return context.getString(R.string.err207_06);

        } else if (rs.equals("207_09")) {
            return context.getString(R.string.err207_06);

        } else if (rs.equals("207_10")) {
            return context.getString(R.string.err207_06);

        } else if (rs.equals("207_11")) {
            return context.getString(R.string.err207_06);

        } else if (rs.equals("207_12")) {
            return context.getString(R.string.err207_06);

        } else if (rs.equals("5027_01")) {
            return context.getString(R.string.err5027_01);

        } else if (rs.equals("5027_02")) {
            return context.getString(R.string.err5027_02);

        } else if (rs.equals("5027_03")) {
            return context.getString(R.string.err5027_03);

        } else if (rs.equals("5027_04")) {
            return context.getString(R.string.err5027_04);

        } else if (rs.equals("5027_05")) {
            return context.getString(R.string.err5027_05);

        } else if (rs.equals("5027_06")) {
            return context.getString(R.string.err5027_06);

        } else if (rs.equals("5027_07")) {
            return context.getString(R.string.err5027_07);

        } else if (rs.equals("5027_08")) {
            return context.getString(R.string.err5027_08);

        } else if (rs.equals("5027_09")) {
            return context.getString(R.string.err5027_09);

        } else if (rs.equals("5027_10")) {
            return context.getString(R.string.err5027_10);

        } else if (rs.equals("5027_11")) {
            return context.getString(R.string.err5027_11);

        } else if (rs.equals("5027_12")) {
            return context.getString(R.string.err5027_12);
        } else if (rs.equals("5027_13")) {
            return context.getString(R.string.err5027_13);
        } else if (rs.equals("5027_14")) {
            return context.getString(R.string.err5027_14);
        } else if (rs.equals("5027_15")) {
            return context.getString(R.string.err5027_15);
        } else if (rs.equals("5027_16")) {
            return context.getString(R.string.err5027_16);
        } else if (rs.equals("5027_17")) {
            return context.getString(R.string.err5027_17);
        } else if (rs.equals("5027_18")) {
            return context.getString(R.string.err5027_18);
        } else if (rs.equals("5027_19")) {
            return context.getString(R.string.err5027_19);
        } else if (rs.equals("5027_20")) {
            return context.getString(R.string.err5027_20);
        } else if (rs.equals("5027_21")) {
            return context.getString(R.string.err5027_21);
        }


        int responsecode = -1;

        try {
            responsecode = Integer.parseInt(rs);
        } catch (Exception e) {
            responsecode = -1;
        }

        switch (responsecode) {
            case -11:
                return "Something went wrong \n Please retry";

            case 000:
                return "Transaction has been reversed";
            case 1:
                return context.getString(R.string.err1);
            case 2:
                return context.getString(R.string.err02);
            case 3:
                return context.getString(R.string.err03);
            case 4:
                return context.getString(R.string.err04);
            case 5:
                return context.getString(R.string.err05);

            case 12:
                return context.getString(R.string.err12);
            case 13:
                return context.getString(R.string.err13);
            case 14:
                return context.getString(R.string.err14);
            case 15:
                return context.getString(R.string.err15);
            case 30:
                return context.getString(R.string.err30);
            case 33:
                return context.getString(R.string.err33);
            case 34:
                return context.getString(R.string.err34);
            case 38:
                return context.getString(R.string.err38);
            case 39:
                return context.getString(R.string.err39);
            case 41:
                return context.getString(R.string.err41);
            case 42:
                return context.getString(R.string.err42);
            case 51:
                return context.getString(R.string.err51);
            case 52:
                return context.getString(R.string.err52);
            case 54:
                return context.getString(R.string.err54);
            case 55:
                return context.getString(R.string.err55);
            case 57:
                return context.getString(R.string.err57);
            case 58:
                return context.getString(R.string.err58);
            case 59:
                return context.getString(R.string.err59);
            case 61:
                return context.getString(R.string.err61);
            case 62:
                return context.getString(R.string.err62);

            case 63:

                return context.getString(R.string.err63);
            case 75:
                return context.getString(R.string.err75);
            case 89:
                return context.getString(R.string.err89);
            case 91:
                return context.getString(R.string.err91);

            case 92:
                return context.getString(R.string.err92);
            case 95:
                return context.getString(R.string.err95);
            case 96:
                return context.getString(R.string.err96);
            case 98:
                return context.getString(R.string.err98);

            case 127:
                return context.getString(R.string.err127);
            case 101:
                return context.getString(R.string.err101);
            case 102:
                return context.getString(R.string.err102);
            case 103:
                return context.getString(R.string.err103);
            case 104:
                return context.getString(R.string.err104);
            case 105:
                return context.getString(R.string.err105);
            case 106:
                return context.getString(R.string.err106);
            case 107:
                return context.getString(R.string.err107);
            case 108:
                return context.getString(R.string.err108);
            case 109:
                return context.getString(R.string.err109);
            case 110:
                return context.getString(R.string.err110);
            case 200:
                return context.getString(R.string.err200);
            case 201:
                return context.getString(R.string.err201);
            case 202:
                return context.getString(R.string.err202);
            case 203:
                return context.getString(R.string.err203);
            case 204:
                return context.getString(R.string.err204);
            case 205:
                return context.getString(R.string.err205);
            case 206:
                return context.getString(R.string.err206);
            case 207:
                return context.getString(R.string.err207);
            case 300:
                return context.getString(R.string.err300);
            case 301:
                return context.getString(R.string.err301);
            case 302:
                return context.getString(R.string.err302);
            case 303:
                return context.getString(R.string.err303);
            case 304:
                return context.getString(R.string.err304);
            case 305:
                return context.getString(R.string.err305);
            case 306:
                return context.getString(R.string.err306);
            case 307:
                return context.getString(R.string.err307);
            case 308:
                return context.getString(R.string.err308);
            case 310:
                return context.getString(R.string.err310);
            case 311:
                return context.getString(R.string.err311);
            case 312:
                return "Network Error";
            case 313:
                return context.getString(R.string.err313);
            case 314:
                return context.getString(R.string.err314);
            case 320:
                return context.getString(R.string.err320);
            case 321:
                return context.getString(R.string.err321);
            case 322:
                return context.getString(R.string.err322);

            case 323:
                return "Reversal Not Present";

            case 316:
                return context.getString(R.string.err316);
            case 317:
                return context.getString(R.string.err317);
            case 318:
                return context.getString(R.string.err318);
            case 319:
                return context.getString(R.string.err319);
            case 400:
                return context.getString(R.string.err400);
            case 401:
                return context.getString(R.string.err401);
            case 402:
                return context.getString(R.string.err402);
            case 403:
                return context.getString(R.string.err403);
            case 404:
                return context.getString(R.string.err404);
            case 501:
                return context.getString(R.string.err501);
            case 502:
                return context.getString(R.string.err502);
            case 700:
                return context.getString(R.string.err700);
            case 701:
                return context.getString(R.string.err701);
            case 702:
                return context.getString(R.string.err702);
            case 703:
                return context.getString(R.string.err703);
            case 1001:
                return context.getString(R.string.err1001);
            case 1002:
                return context.getString(R.string.err1002);
            case 1003:
                return context.getString(R.string.err1003);

            case 1004:
                return context.getString(R.string.err1004);

            case 1005:
                return context.getString(R.string.err1005);
            case 1006:
                return context.getString(R.string.err1006);
            case 1007:
                return context.getString(R.string.err1007);
            case 1008:
                return context.getString(R.string.err1008);

            case 1009:
                return context.getString(R.string.err1009);

            case 1010:
                return context.getString(R.string.err1011);

            case 1011:
                return context.getString(R.string.err1011);

            case 1012:
                return context.getString(R.string.err1012);

            case 1013:
                return context.getString(R.string.err1013);

            case 1014:
                return context.getString(R.string.err1014);

            case 1015:
                return context.getString(R.string.err1015);

            case 1016:
                return context.getString(R.string.err1016);

            case 1025:
                return context.getString(R.string.err1025);

            case 1026:
                return context.getString(R.string.err1026);

            case 1027:
                return context.getString(R.string.err1027);

            case 1028:
                return context.getString(R.string.err1028);

            case 1029:
                return context.getString(R.string.err1029);

            case 1031:
                return context.getString(R.string.err1031);

            case 1032:
                return context.getString(R.string.err1032);

            case 1033:
                return context.getString(R.string.err1033);

            case 1034:
                return context.getString(R.string.err1034);

            case 1035:
                return context.getString(R.string.err1035);
            case 1036:
                return context.getString(R.string.err1036);
            case 1037:
                return context.getString(R.string.err1037);
            case 1038:
                return context.getString(R.string.err1038);
            case 1039:
                return context.getString(R.string.err1039);
            case 5001:
                return context.getString(R.string.err5001);
            case 5002:
                return context.getString(R.string.err5002);
            case 5003:
                return context.getString(R.string.err5003);
            case 5004:
                return context.getString(R.string.err5004);
            case 5005:
                return context.getString(R.string.err5005);
            case 5006:
                return context.getString(R.string.err5006);

            case 5014:
                return context.getString(R.string.err5014);
            case 5015:
                return context.getString(R.string.err5015);
            case 5018:
                return context.getString(R.string.err5018);
            case 5019:
                return context.getString(R.string.err5019);
            case 5021:
                return context.getString(R.string.err5021);
            case 5022:
                return context.getString(R.string.err5022);
            case 5025:
                return context.getString(R.string.err5025);
            case 5026:

                return context.getString(R.string.err5026);
            case 5027:
                return context.getString(R.string.err5027);
            case 5031:
                return context.getString(R.string.err5031);
            case 5032:
                return context.getString(R.string.err5032);
            case 5034:
                return context.getString(R.string.err5034);
            case 5035:
                return context.getString(R.string.err5035);
            case 5036:
                return context.getString(R.string.err5036);

            case 5037:
                return context.getString(R.string.err5037);

            case 5038:
                return context.getString(R.string.err5038);

            case 999:
                return context.getString(R.string.networkIssue);

        }
        if (responsecode != -1)
            return "Unknown Response From Processor";
        else
            return "Unknown Response From Processor";


    }
}
