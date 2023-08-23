declare module "react-native-background-fetch" {

	interface AbstractConfig {
		/**
		* [Android only] Set false to continue background-fetch events after user terminates the app.  Default to true.
		*/
		stopOnTerminate?:boolean;
		/**
		* [Android only] Set true to initiate background-fetch events when the device is rebooted.  Defaults to false.
		*/
		startOnBoot?:boolean;
		/**
		* [Android only] Set true to enable Headless mechanism for handling fetch events after app termination.
		*/
		enableHeadless?:boolean;
		/**
		* [Android only]
		*/
		forceAlarmManager?:boolean;
		/**
		* [Android only] Set detailed description of the kind of network your job requires.
		*
		* If your job doesn't need a network connection, you don't need to use this option, as the default is [[BackgroundFetch.NEWORK_TYPE_NONE]].
		*
		* Calling this method defines network as a strict requirement for your job. If the network requested is not available your job will never run.
		*/
		requiredNetworkType?:NetworkType;
		/**
		* [Android only] Specify that to run this job, the device's battery level must not be low.
		*
		* This defaults to false. If true, the job will only run when the battery level is not low, which is generally the point where the user is given a "low battery" warning.
		*/
		requiresBatteryNotLow?:boolean;
		/**
		* [Android only] Specify that to run this job, the device's available storage must not be low.
		*
		* This defaults to false. If true, the job will only run when the device is not in a low storage state, which is generally the point where the user is given a "low storage" warning.
		*/
		requiresStorageNotLow?:boolean;
		/**
		* [Android only] Specify that to run this job, the device must be charging (or be a non-battery-powered device connected to permanent power, such as Android TV devices). This defaults to false.
		*/
		requiresCharging?:boolean;
		/**
		* [Android only] When set true, ensure that this job will not run if the device is in active use.
		*
		* The default state is false: that is, the for the job to be runnable even when someone is interacting with the device.
		*
		* This state is a loose definition provided by the system. In general, it means that the device is not currently being used interactively, and has not been in use for some time. As such, it is a good time to perform resource heavy jobs. Bear in mind that battery usage will still be attributed to your application, and surfaced to the user in battery stats.
		*/
		requiresDeviceIdle?:boolean;
	}

	interface TaskConfig extends AbstractConfig {
		/**
		* The name of the task.  This will be used with [[BackgroundFetch.finish]] to signal task-completion.
		*/
		taskId:string;
		/**
		* The minimum interval in milliseconds to execute this task.
		*/
		delay:number;
		/**
		* Whether this task will continue executing or just a "one-shot".
		*/
		periodic?:boolean;
		/**
		* When set true, ensure that this job will run if the device has network connection.
		*/
		requiresNetworkConnectivity?:boolean;
	}

	interface BackgroundFetchConfig extends AbstractConfig {
		/**
		* The minimum interval in minutes to execute background fetch events.  Defaults to 15 minutes.  Minimum is 15 minutes.
		*/
		minimumFetchInterval?:number;
	}

	/**
	* | BackgroundFetchStatus              | Description                                     |
	* |------------------------------------|-------------------------------------------------|
	* | BackgroundFetch.STATUS_RESTRICTED  | Background fetch updates are unavailable and the user cannot enable them again. For example, this status can occur when parental controls are in effect for the current user. |
	* | BackgroundFetch.STATUS_DENIED      | The user explicitly disabled background behavior for this app or for the whole system. |
	* | BackgroundFetch.STATUS_AVAILABLE   | Background fetch is available and enabled.      |
	*/
	type BackgroundFetchStatus = 0 | 1 | 2;

	/**
	* | NetworkType                           | Description                                                   |
	* |---------------------------------------|---------------------------------------------------------------|
	* | BackgroundFetch.NETWORK_TYPE_NONE     | This job doesn't care about network constraints, either any or none.                         |
	* | BackgroundFetch.NETWORK_TYPE_ANY  	  | This job requires network connectivity.                          |
	* | BackgroundFetch.NETWORK_TYPE_CELLULAR | This job requires network connectivity that is a cellular network. |
	* | BackgroundFetch.NETWORK_TYPE_UNMETERED | This job requires network connectivity that is unmetered. |
	* | BackgroundFetch.NETWORK_TYPE_NOT_ROAMING | This job requires network connectivity that is not roaming. |
	*/
	type NetworkType = 0 | 1 | 2 | 3 | 4;

	export interface HeadlessEvent {
		/**
		* The name of the task.  This will be used with [[BackgroundFetch.finish]] to signal task-completion.
		*/
		taskId: string;
		/**
		* Whether this event is a timeout event or not. If true stop all processing and call [[BackgroundFetch.finish]] immediately.
		*/
		timeout: boolean;
	}

	/**
	* BackgroundFetch is a module to receive periodic callbacks (min every 15 min) while your app is running in the background or terminated.
	*/
	export default class BackgroundFetch {
		/**
		* Background fetch updates are unavailable and the user cannot enable them again. For example, this status can occur when parental controls are in effect for the current user.
		*/
		static STATUS_RESTRICTED: BackgroundFetchStatus;
		/**
		* The user explicitly disabled background behavior for this app or for the whole system.
		*/
		static STATUS_DENIED: BackgroundFetchStatus;
		/**
		* Background fetch is available and enabled.
		*/
		static STATUS_AVAILABLE: BackgroundFetchStatus;
		/**
		* This job doesn't care about network constraints, either any or none.
		*/
		static NETWORK_TYPE_NONE: NetworkType;
		/**
		* This job requires network connectivity.
		*/
		static NETWORK_TYPE_ANY: NetworkType;
		/**
		* This job requires network connectivity that is a cellular network.
		*/
		static NETWORK_TYPE_CELLULAR: NetworkType;
		/**
		* This job requires network connectivity that is unmetered.
		*/
		static NETWORK_TYPE_UNMETERED: NetworkType;
		/**
		* This job requires network connectivity that is not roaming.
		*/
		static NETWORK_TYPE_NOT_ROAMING: NetworkType;

		/**
		* Initial configuration of BackgroundFetch, including config-options and Fetch-callback.  The [[start]] method will automatically be executed.
		*/
		static configure(config:BackgroundFetchConfig, onEvent:(taskId:string) => void, onTimeout?:(taskId:string) => void):Promise<BackgroundFetchStatus>;
		/**
		* Add an extra fetch event listener in addition to the one initially provided to [[configure]].
		* @event
		*/
		static scheduleTask(config:TaskConfig):Promise<boolean>;

		/**
		* Start subscribing to fetch events.
		*/
		static start():Promise<BackgroundFetchStatus>;
		/**
		* Stop subscribing to fetch events.
		*/
		static stop(taskId?:string):Promise<boolean>;
		/**
		* You must execute [[finish]] within your fetch-callback to signal completion of your task.
		*/
		static finish(taskId?:string):void;
		/**
		* Query the BackgroundFetch API status
		*
		* | BackgroundFetchStatus              | Description                                     |
		* |------------------------------------|-------------------------------------------------|
		* | BackgroundFetch.STATUS_RESTRICTED  | Background fetch updates are unavailable and the user cannot enable them again. For example, this status can occur when parental controls are in effect for the current user. |
		* | BackgroundFetch.STATUS_DENIED      | The user explicitly disabled background behavior for this app or for the whole system. |
		* | BackgroundFetch.STATUS_AVAILABLE   | Background fetch is available and enabled.      |
		*/
		static status(callback?:(status:BackgroundFetchStatus) => void):Promise<BackgroundFetchStatus>;
		/**
		* [Android only] Register a function to execute when the app is terminated.  Requires stopOnTerminate: false.
		*/
		static registerHeadlessTask(task:(event:HeadlessEvent) => Promise<void>):void;
	}
}
