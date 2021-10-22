import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Event {
  taskId:string;
  isHeadless: boolean;
  timestamp:string;
  key: string;

  static destroyAll() {
    AsyncStorage.setItem('events', JSON.stringify([]));
  }

  static async create(taskId:string, isHeadless:boolean) {
    const event = new Event(taskId, isHeadless);

    // Persist event into AsyncStorage.
    AsyncStorage.getItem('events').then((json) => {
      const data = (json === null) ? [] : JSON.parse(json);
      data.push(event.toJson());
      AsyncStorage.setItem('events', JSON.stringify(data));
    }).catch((error) => {
      console.error('Event.create error: ', error);
    });
    return event;
  }

  static async all() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('events').then((json) => {
        const data = (json === null) ? [] : JSON.parse(json);
        resolve(data.map((record:any) => {
          return new Event(record.taskId, record.isHeadless, record.timestamp);
        }));
      }).catch((error) => {
        console.error('Event.create error: ', error);
        reject(error);
      });
    });
  }

  constructor(taskId:string, isHeadless:boolean, timestamp?:string) {
    if (!timestamp) {
      const now:Date = new Date();
      timestamp = now.toLocaleDateString() + ' ' + now.toLocaleTimeString()
    }

    this.taskId = taskId;
    this.isHeadless = isHeadless;
    this.timestamp = timestamp;
    this.key = `${this.taskId}-${this.timestamp}`;
  }

  toJson() {
    return {
      taskId: this.taskId,
      timestamp: this.timestamp,
      isHeadless: this.isHeadless
    }
  }
}
