package com.epaisapos;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import javax.annotation.Nullable;

public class MyTaskService extends HeadlessJsTaskService {

    /**
     * Execute new JS task with name `SomeTask`
     */
    @Nullable
    @Override
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Log.e("DIMA", "getTaskConfig: intent = " + intent.toString());
        if (null != intent.getExtras()) {
            return new HeadlessJsTaskConfig(
                    "SomeTaskName",
                    Arguments.fromBundle(intent.getExtras()),
                    10
            );
        }
        return null;
    }
}