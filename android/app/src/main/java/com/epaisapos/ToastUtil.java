package com.epaisapos;

import android.content.Context;
import android.view.Gravity;
import android.widget.Toast;

/**
 * Created by Admin on 10/4/2017.
 */

public class ToastUtil {

    static Toast toast;

    public static void showToast(final Context context, final String message) {
        if (context == null)
            return;
        Runnable runnable = new Runnable() {
            public void run() {
                if (toast != null) {
                    toast.cancel();
                }
                toast = Toast.makeText(context, message, Toast.LENGTH_SHORT);
                toast.setGravity(Gravity.CENTER, 0, 0);
                toast.show();
            }
        };
        runnable.run();

    }

    public static void showToastBottom(final Context context, final String message) {
        Runnable runnable = new Runnable() {
            public void run() {
                if (toast != null) {
                    toast.cancel();
                }
                toast = Toast.makeText(context, message, Toast.LENGTH_SHORT);
                toast.setGravity(Gravity.CENTER, 0, 0);
                toast.show();
            }
        };
        runnable.run();
    }
}
