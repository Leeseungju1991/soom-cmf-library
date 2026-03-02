import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const TASK_NAME = "BACKGROUND_TASK"

BackgroundFetch.setMinimumIntervalAsync(1); // 1초로 설정

TaskManager.defineTask(TASK_NAME, () => {
    try {
      // fetch data here...
      const receivedNewData = "Simulated fetch " + Math.random()
      console.log("My task ", receivedNewData)
      return receivedNewData
        ? BackgroundFetch.Result.NewData
        : BackgroundFetch.Result.NoData
    } catch (err) {
      return BackgroundFetch.Result.Failed
    }
  })

export async function registerBackgroundTaskAsync() {
  return BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 1, // 1초로 설정
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

export async function unregisterBackgroundTaskAsync() {
  return BackgroundFetch.unregisterTaskAsync(TASK_NAME);
}

export async function isBackgroundNotificationsTaskRegistered() {
  console.log("digh");
  return TaskManager.isTaskRegisteredAsync(TASK_NAME);
}