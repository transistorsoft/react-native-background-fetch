package com.transistorsoft.rnbackgroundfetch;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;
import com.transistorsoft.tsbackgroundfetch.BackgroundFetch;
import com.transistorsoft.tsbackgroundfetch.BackgroundFetchConfig;

public class RNBackgroundFetchModule extends ReactContextBaseJavaModule implements ActivityEventListener, LifecycleEventListener {
    public static final String TAG = "RNBackgroundFetch";

    private static final String EVENT_FETCH = "fetch";
    private static final String JOB_SERVICE_CLASS = "HeadlessJobService";
    private boolean isForceReload = false;
    private boolean initialized = false;

    public RNBackgroundFetchModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public String getName() {
        return TAG;
    }

    @ReactMethod
    public void configure(ReadableMap options, final Callback failure) {
        BackgroundFetch adapter = getAdapter();

        BackgroundFetchConfig.Builder config = new BackgroundFetchConfig.Builder();
        if (options.hasKey("minimumFetchInterval")) {
            config.setMinimumFetchInterval(options.getInt("minimumFetchInterval"));
        }
        if (options.hasKey("stopOnTerminate")) {
            config.setStopOnTerminate(options.getBoolean("stopOnTerminate"));
        }
        if (options.hasKey("forceReload")) {
            config.setForceReload(options.getBoolean("forceReload"));
        }
        if (options.hasKey("startOnBoot")) {
            config.setStartOnBoot(options.getBoolean("startOnBoot"));
        }
        if (options.hasKey("enableHeadless") && options.getBoolean("enableHeadless")) {
            config.setJobService(getClass().getPackage().getName() + "." + JOB_SERVICE_CLASS);
        }
        if (options.hasKey("requiredNetworkType")) {
            config.setRequiredNetworkType(options.getInt("requiredNetworkType"));
        }
        if (options.hasKey("requiresBatteryNotLow")) {
            config.setRequiresBatteryNotLow(options.getBoolean("requiresBatteryNotLow"));
        }
        if (options.hasKey("requiresCharging")) {
            config.setRequiresCharging(options.getBoolean("requiresCharging"));
        }
        if (options.hasKey("requiresDeviceIdle")) {
            config.setRequiresDeviceIdle(options.getBoolean("requiresDeviceIdle"));
        }
        if (options.hasKey("requiresStorageNotLow")) {
            config.setRequiresStorageNotLow(options.getBoolean("requiresStorageNotLow"));
        }

        BackgroundFetch.Callback callback = new BackgroundFetch.Callback() {
            @Override
            public void onFetch() {
                WritableMap params = new WritableNativeMap();
                getReactApplicationContext().getJSModule(RCTNativeAppEventEmitter.class).emit(EVENT_FETCH, params);
            }
        };
        adapter.configure(config.build(), callback);
        if (isForceReload) {
            callback.onFetch();
        }
        isForceReload = false;
    }

    @ReactMethod
    public void start(Callback success, Callback failure) {
        BackgroundFetch adapter = getAdapter();
        adapter.start();
        success.invoke(adapter.status());
    }

    @ReactMethod
    public void stop() {
        BackgroundFetch adapter = getAdapter();
        adapter.stop();
    }

    @ReactMethod
    public void status(Callback success) {
        BackgroundFetch adapter = getAdapter();
        success.invoke(adapter.status());
    }

    @ReactMethod
    public void finish(Integer fetchResult) {
        BackgroundFetch adapter = getAdapter();
        adapter.finish();
    }

    @Override
    public void onHostResume() {
        if (!initialized) {
            initializeBackgroundFetch();
        }
    }

    @Override
    public void onHostPause() {
    }

    @Override
    public void onNewIntent(Intent intent) {
    }

    @Override
    public void onHostDestroy() {
        initialized = false;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

    private void initializeBackgroundFetch() {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }
        Intent intent = activity.getIntent();
        String action = intent.getAction();

        if ((action != null) && (BackgroundFetch.ACTION_FORCE_RELOAD.equalsIgnoreCase(action))) {
            isForceReload = true;
            activity.moveTaskToBack(true);
        }
        initialized = true;
    }

    private BackgroundFetch getAdapter() {
        return BackgroundFetch.getInstance(getReactApplicationContext());
    }

}
