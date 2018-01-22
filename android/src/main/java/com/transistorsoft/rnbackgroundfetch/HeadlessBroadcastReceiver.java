package com.transistorsoft.rnbackgroundfetch;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.transistorsoft.tsbackgroundfetch.BackgroundFetch;

/**
 * Created by chris on 2018-01-20.
 */

public class HeadlessBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        BackgroundFetch adapter = BackgroundFetch.getInstance(context.getApplicationContext());
        if (adapter.isMainActivityActive()) {
            return;
        }
        Log.d(BackgroundFetch.TAG, "HeadlessBroadcastReceiver onReceive");
        new HeadlessTask(context.getApplicationContext());
    }
}
