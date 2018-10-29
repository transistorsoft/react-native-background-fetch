declare module "react-native-background-fetch" {
	interface BackgroundFetchConfig {
		/**
		* The minimum interval in minutes to execute background fetch events.  Defaults to 15 minutes.  Minimum is 15 minutes.
		*/
		minimumFetchInterval?:number;
		/**
		* [Android only] Set false to continue background-fetch events after user terminates the app.  Default to true.
		*/
		stopOnTerminate?:boolean;
		/**
		* [Android only] Set true to initiate background-fetch events when the device is rebooted.  Defaults to false.
		*/
		startOnBoot?:boolean;
		/**
		* [Android only] Set true to automatically relaunch the application (if it was terminated) -- the application will launch to the foreground then immediately minimize.  Defaults to false.
		*/
		forceReload?:boolean;
		/**
		* [Android only] Set true to enable Headless mechanism for handling fetch events after app termination.
		*/
		enableHeadless?:boolean;
	}

	/**
	* | BackgroundFetchStatus              | Description                                     |
	* |------------------------------------|-------------------------------------------------|
	* | BackgroundFetch.STATUS_RESTRICTED  | Background fetch updates are unavailable and the user cannot enable them again. For example, this status can occur when parental controls are in effect for the current user. |
	* | BackgroundFetch.STATUS_DENIED      | The user explicitly disabled background behavior for this app or for the whole system. |
	* | BackgroundFetch.STATUS_AVAILABLE   | Background fetch is available and enabled.      |
	*/
	type BackgroundFetchResult = 0 | 1 | 2;

	/**
	* | BackgroundFetchResult                 | Description                                                   |
	* |---------------------------------------|---------------------------------------------------------------|
	* | BackgroundFetch.FETCH_RESULT_NEW_DATA | New data was successfully downloaded.                         |
	* | BackgroundFetch.FETCH_RESULT_NO_DATA  | There was no new data to download.                            |
	* | BackgroundFetch.FETCH_RESULT_FAILED   | An attempt to download data was made but that attempt failed. |
	*/
	type BackgroundFetchStatus = 0 | 1 | 2;

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
		* New data was successfully downloaded.
		*/
		static FETCH_RESULT_NEW_DATA: BackgroundFetchResult;
		/**
		* There was no new data to download.
		*/
		static FETCH_RESULT_NO_DATA: BackgroundFetchResult;
		/**
		* An attempt to download data was made but that attempt failed.
		*/
		static FETCH_RESULT_FAILED: BackgroundFetchResult;

		/**
		* Initial configuration of BackgroundFetch, including config-options and Fetch-callback.  The [[start]] method will automatically be executed.
		*/
		static configure(config:BackgroundFetchConfig, callback:() => void, failure?:(status:BackgroundFetchStatus) => void):void;
		/**
		* Add an extra fetch event listener in addition to the one initially provided to [[configure]].
		* @event
		*/
		static onFetch(callback:() => void):void;
		/**
		* Start subscribing to fetch events.
		*/
		static start(success?:() => void, failure?:(status:BackgroundFetchStatus) => void):void;
		/**
		* Stop subscribing to fetch events.
		*/
		static stop():void;
		/**
		* You must execute [[finish]] within your fetch-callback to signal completion of your task.  You may optionally provide a [[BackgroundFetchResult]].  If no result is provided, default to FETCH_RESULT_NEW_DATA.
		*
		* | BackgroundFetchResult                 |
		* |---------------------------------------|
		* | BackgroundFetch.FETCH_RESULT_NEW_DATA |
		* | BackgroundFetch.FETCH_RESULT_NO_DATA  |
		* | BackgroundFetch.FETCH_RESULT_FAILED   |
		*
		*/
		static finish(result?:BackgroundFetchResult):void;
		/**
		* Query the BackgroundFetch API status
		*
		* | BackgroundFetchStatus              | Description                                     |
		* |------------------------------------|-------------------------------------------------|
		* | BackgroundFetch.STATUS_RESTRICTED  | Background fetch updates are unavailable and the user cannot enable them again. For example, this status can occur when parental controls are in effect for the current user. |
		* | BackgroundFetch.STATUS_DENIED      | The user explicitly disabled background behavior for this app or for the whole system. |
		* | BackgroundFetch.STATUS_AVAILABLE   | Background fetch is available and enabled.      |
		*/
		static status(callback:(status:BackgroundFetchStatus) => void):void;
		/**
		* [Android only] Register a function to execute when the app is terminated.  Requires stopOnTerminate: false.
		*/
		static registerHeadlessTask(task:() => void):void;
	}
}
