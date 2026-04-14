package com.transistorsoft.rnbackgroundfetch;

import androidx.annotation.Nullable;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

public class RNBackgroundFetchPackage extends TurboReactPackage {

    @Nullable
    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        if (RNBackgroundFetchModule.NAME.equals(name)) {
            return new RNBackgroundFetchModule(reactContext);
        }
        return null;
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            final Map<String, ReactModuleInfo> map = new HashMap<>();
            map.put(
                RNBackgroundFetchModule.NAME,
                new ReactModuleInfo(
                    RNBackgroundFetchModule.NAME,
                    RNBackgroundFetchModule.NAME,
                    false,  // canOverrideExistingModule
                    false,  // needsEagerInit
                    true,   // hasConstants
                    false,  // isCxxModule
                    BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
                )
            );
            return map;
        };
    }
}
