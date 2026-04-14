import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  configure(config: Object): Promise<number>;
  start(): Promise<number>;
  stop(taskId: string | null): Promise<boolean>;
  finish(taskId: string): void;
  status(): Promise<number>;
  scheduleTask(config: Object): Promise<boolean>;
  // Required stubs for NativeEventEmitter compatibility
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNBackgroundFetch');
