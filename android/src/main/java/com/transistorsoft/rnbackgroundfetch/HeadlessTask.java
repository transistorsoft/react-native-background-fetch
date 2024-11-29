package com.transistorsoft.rnbackgroundfetch;

import android.content.Context;
import android.os.Handler;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceEventListener;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.jstasks.HeadlessJsTaskContext;

import com.transistorsoft.tsbackgroundfetch.BGTask;
import com.transistorsoft.tsbackgroundfetch.BackgroundFetch;
import com.facebook.react.common.LifecycleState;

import java.lang.reflect.Method;

/**
 * Created by chris on 2018-01-17.
 */

public class HeadlessTask {
    private static final String HEADLESS_TASK_NAME = "BackgroundFetch";
    private static final Handler mHandler = new Handler();

    private final BGTask mBGTask;
    public HeadlessTask(Context context, BGTask task) {
        mBGTask = task;
        WritableMap clientEvent = new WritableNativeMap();
        clientEvent.putString("taskId", task.getTaskId());
        clientEvent.putBoolean("timeout", task.getTimedOut());
        HeadlessJsTaskConfig config = new HeadlessJsTaskConfig(HEADLESS_TASK_NAME, clientEvent, 30000);
        try {
            startTask(config, context);
        } catch (AssertionError e) {
            Log.d(BackgroundFetch.TAG, "[HeadlessTask] Failed invoke HeadlessTask: " + e.getMessage());
        }
    }

    /**
     * Start a task. This method handles starting a new React instance if required.
     *
     * Has to be called on the UI thread.
     *
     * @param taskConfig describes what task to start and the parameters to pass to it
     */
    protected void startTask(final HeadlessJsTaskConfig taskConfig, Context context) {
        UiThreadUtil.assertOnUiThread();

        ReactContext reactContext = getReactContext(context);

        if (reactContext == null) {
            createReactContextAndScheduleTask(taskConfig, context);
        } else {
            invokeStartTask(reactContext, taskConfig);
        }
    }

    private void invokeStartTask(ReactContext reactContext, final HeadlessJsTaskConfig taskConfig) {
        if (reactContext.getLifecycleState() == LifecycleState.RESUMED) {
            return;
        }
        final HeadlessJsTaskContext headlessJsTaskContext = HeadlessJsTaskContext.getInstance(reactContext);

        UiThreadUtil.runOnUiThread(() -> {
            try {
                final int taskId = headlessJsTaskContext.startTask(taskConfig);
                Log.d(BackgroundFetch.TAG, "[HeadlessTask] start HeadlessJsTask: " + taskId);
                // Add a BGTask.finish(taskId) listener.  This is executed when the user runs BackgroundFetch.finish(taskId).
                // We use this to finish the RN headless task.
                mBGTask.setCompletionHandler(() -> {
                    Log.d(BackgroundFetch.TAG, "[HeadlessTask] end HeadlessJsTask: " + taskId);
                    headlessJsTaskContext.finishTask(taskId);
                });
            } catch (IllegalStateException exception) {
                Log.e(BackgroundFetch.TAG, "[HeadlessTask] task attempted to run in the foreground.  Task ignored.");
            }
        });
    }

    private ReactNativeHost getReactNativeHost(Context context) {
        return ((ReactApplication) context.getApplicationContext()).getReactNativeHost();
    }

    /**
     * Get the {ReactHost} used by this app. ure and returns null if not.
     */
    private @Nullable Object getReactHost(Context context) {
        context = context.getApplicationContext();
        try {
            Method getReactHost = context.getClass().getMethod("getReactHost");
            return getReactHost.invoke(context);
            // Original non-reflection return:
            //return ((ReactApplication) context.getApplicationContext()).getReactHost();
        } catch (Exception e) {
            Log.d(BackgroundFetch.TAG, "[HeadlessTask] Reflection error ReactHost: " + e);
            return null;
        }
    }

    private ReactContext getReactContext(Context context) {
        if (isBridglessArchitectureEnabled()) {
            Object reactHost = getReactHost(context);
            Assertions.assertNotNull(reactHost, "getReactHost() is null in New Architecture");
            try {
                Method getCurrentReactContext = reactHost.getClass().getMethod("getCurrentReactContext");
                return (ReactContext) getCurrentReactContext.invoke(reactHost);
            } catch (Exception e) {
                Log.e(BackgroundFetch.TAG, "[HeadlessTask] Reflection error getCurrentReactContext: " + e);
            }
        }
        final ReactInstanceManager reactInstanceManager = getReactNativeHost(context).getReactInstanceManager();
        return reactInstanceManager.getCurrentReactContext();
    }

    private void createReactContextAndScheduleTask(final HeadlessJsTaskConfig taskConfig, Context context) {
        Log.d(BackgroundFetch.TAG, "[HeadlessTask] initializing ReactContext");

        if (isBridglessArchitectureEnabled()) { // new arch
            final Object reactHost = getReactHost(context);

            ReactInstanceEventListener callback = new ReactInstanceEventListener() {
                @Override
                public void onReactContextInitialized(@NonNull ReactContext reactContext) {
                    mHandler.postDelayed(() -> invokeStartTask(reactContext, taskConfig), 500);
                    try {
                        Method removeReactInstanceEventListener = reactHost.getClass().getMethod("removeReactInstanceEventListener", ReactInstanceEventListener.class);
                        removeReactInstanceEventListener.invoke(reactHost, this);
                    } catch (Exception e) {
                        Log.e(BackgroundFetch.TAG, "[HeadlessTask] reflection error removeReactInstanceEventListener" + e);
                    }
                }
            };

            try {
                Method addReactInstanceEventListener = reactHost.getClass().getMethod("addReactInstanceEventListener", ReactInstanceEventListener.class);
                addReactInstanceEventListener.invoke(reactHost, callback);
                Method startReactHost = reactHost.getClass().getMethod("start");
                startReactHost.invoke(reactHost);
            } catch (Exception e) {
                Log.e(BackgroundFetch.TAG, "[HeadlessTask] reflection error addReactInstanceEventListener: " + e);
            }
        } else { // old arch
            final ReactInstanceManager reactInstanceManager = getReactNativeHost(context).getReactInstanceManager();
            reactInstanceManager.addReactInstanceEventListener(new ReactInstanceEventListener() {
                @Override
                public void onReactContextInitialized(@NonNull ReactContext reactContext) {
                    mHandler.postDelayed(() -> invokeStartTask(reactContext, taskConfig), 500);
                    reactInstanceManager.removeReactInstanceEventListener(this);
                }
            });
            reactInstanceManager.createReactContextInBackground();
        }
    }

    // Returns true if the app has enabled bridgeless mode.  Thanks to @mikehardy for this block.
    private boolean isBridglessArchitectureEnabled() {
        try {
            Class<?> entryPoint = Class.forName("com.facebook.react.defaults.DefaultNewArchitectureEntryPoint");
            Method bridgelessEnabled = entryPoint.getMethod("getBridgelessEnabled");
            Object result = bridgelessEnabled.invoke(null);
            return (result == Boolean.TRUE);
        } catch (Exception e) {
            return false;
        }
    }
}
