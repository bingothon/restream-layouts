<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="show"
    id="TimerBox"
    class="RunInfoBox FlexContainer"
    :style="textColor"
    v-html="time"
  />
  <!-- eslint-enable -->
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { store } from '../../browser-util/state';
import { METHODS } from "http";
import { Timer } from "../../../speedcontrol-types";

@Component({})
export default class TestTimerContainer extends Vue {
    get estimate(): string {
        return store.state.runDataActiveRun.estimate
    }

    get timer(): Timer {
        return store.state.timer
    }

    data() {
        return {
            show: false,
            time: '',
            backupTimerTO: <any>setTimeout("0"),
            textColor: {
                color: 'white',
            },
        };
    }

  
    updateData(timer) {
      timer.show = true;
      timer.time = this.splitStringToSpans(timer.time);
      switch (timer.state) {
      default:
      case 'running':
        timer.textColor.color = getComputedStyle(document.documentElement).getPropertyValue('--timer-colour');
        break;
      case 'paused':
      case 'stopped':
        timer.textColor.color = getComputedStyle(document.documentElement).getPropertyValue('--timer-paused-colour');
        break;
      case 'finished':
        timer.textColor.color = getComputedStyle(document.documentElement).getPropertyValue('--timer-finish-colour');
      }
      // Backup timer (see below).
      clearTimeout(timer.backupTimerTO);
      timer.backupTimerTO = setTimeout(timer.backupTimer, 1000);
    }
    splitStringToSpans(string) {
      return string.replace(/\S/g, '<span>$&</span>');
    }
    // Backup timer that takes over if the connection to the server is lost.
    // Based on the last timestamp that was received.
    // When the connection is restored, the server timer will recover and take over again.
    backupTimer() {
      this.data().backupTimerTO = setTimeout(this.backupTimer, 200);
      if (this.timer.state === 'running') {
        const missedTime = Date.now() - this.timer.timestamp;
        const timeOffset = this.timer.milliseconds + missedTime;
        this.timer.time = this.splitStringToSpans(this.msToDuration(timeOffset));
      }
    }
    msToDuration(ms) {
      const seconds = Math.floor((ms / 1000) % 60);
      const minutes = Math.floor((ms / (1000 * 60)) % 60);
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const hoursStr = (hours < 10) ? `0${hours}` : `${hours}`;
      const minutesStr = (minutes < 10) ? `0${minutes}` : `${minutes}`;
      const secondsStr = (seconds < 10) ? `0${seconds}` : `${seconds}`;
      return `${hoursStr}:${minutesStr}:${secondsStr}`;
    }
}
</script>