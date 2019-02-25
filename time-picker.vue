<template>
<div class="time-picker-container" :style="cssVars">
  <input type="text" :value="time" @click="showPopup = true" readonly>
  <div v-show="showPopup" class="time-picker-popup" @mouseout="hourHover = undefined; minuteHover = undefined;">
    <svg viewBox="0 0 100 100" ref="clock-face">
      <circle cx="50" cy="50" r="48" stroke-width="1" fill="none" stroke="black"/>

      <circle
        v-if="mobile"
        @touchmove.passive="touchHover"
        @touchend="touchSelect"
        cx="50" cy="50" r="48"
        class="sector"
      />

      <g v-else>
        <g v-if="choosingHour">
          <path
            v-for="i in 12"
            :key="'hour-' + i"
            class="sector"
            d="M 37.58 3.64 A 48,48 0 0,1 62.42,3.64 L 50 50 Z"
            :style="`transform: rotate(${i * 30}deg);`"
            @mouseover="hourHover = i"
            @click="chooseHour(i)"
          />
        </g>
        <g v-else>
          <path
            v-for="(x,i) in 60"
            :key="'minute-' + i"
            class="sector"
            d="M 47.49 2.07 A 48,48 0 0,1 52.51,2.07 L 50 50 Z"
            :style="`transform: rotate(${i * 6}deg);`"
            @mouseover="minuteHover = i"
            @click="chooseMinute(i)"
          />
        </g>
      </g>

      <circle cx="50" cy="50" r="2" fill="black"/>

      <g
        v-for="i in 12" :key="'number-' + i"
        class="clock-text-container"
        :style="`transform: rotate(${i * 30}deg);`"
      >
        <text
          class="clock-text"
          x="50" y="14"
          :style="i > 3 && i < 9 ? 'transform: rotate(180deg);': ''">
          {{ i }}
        </text>
      </g>

      <line
        id="hour-hand"
        class="clock-hand"
        v-if="hourHandDegrees !== undefined"
        stroke="black"
        stroke-width="2"
        x1="50" y1="50"
        x2="50" y2="30"
        :style="`transform: rotate(${hourHandDegrees}deg);`"
      />
      
      <line
        id="minute-hand"
        class="clock-hand"
        v-if="minuteHandDegrees !== undefined"
        stroke="black"
        stroke-width="1"
        x1="50" y1="50"
        x2="50" y2="25"
        :style="`transform: rotate(${minuteHandDegrees}deg);`"
      />

      <circle
        class="hover-circle"
        v-if="choosingHour && hourHover !== undefined"
        cx="50"
        cy="10"
        r="8"
        fill="none"
        stroke="black"
        stroke-width="1"
        :style="`transform: rotate(${hourHover * 30}deg);`"
      />

      <g
        class="hover-circle"
        v-if="!choosingHour && minuteHover !== undefined"
        :style="`transform: rotate(${minuteHover * 6}deg);`"
      >
        <circle
          class="hover-circle"
          cx="50"
          cy="10"
          r="8"
          fill="white"
          stroke="black"
          stroke-width="1"/>

        <text
          class="clock-text"
          x="50" y="14"
          :style="minuteHover > 15 && minuteHover < 45 ? 'transform: rotate(180deg);': ''">
          {{ minuteHover }}
        </text>

      </g>
    </svg>
    <div class="switch-container">
      <label class="switch">
        <input ref="period" type="checkbox" @change="setTimeFromFields">
        <span class="slider round"></span>
      </label>
    </div>

    <div class="button-row">
      <button class="btn-small btn-text" v-if="mobile && choosingHour" @click="choosingHour = false">Next</button>
      <button class="btn-small btn-text" v-else @click="showPopup = false; choosingHour = true">Done</button>

      <button class="btn-small btn-text" v-if="!mobile && choosingHour" @click="choosingHour = false">Choose Minutes</button>
      <button class="btn-small btn-text" v-if="!choosingHour" @click="choosingHour = true">Choose Hour</button>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>

.time-picker-container {
  position: relative;
  --am-color: green;
  --pm-color: blue;
}

.time-picker-container input {
  width: 153.65px;
}

.time-picker-popup {
  position: absolute;
  top: 35px;
  background-color: white;
  border-radius: 15px;
  width: 200px;
  height: 280px;
  box-shadow: 1px 2px 4px 1px rgba(0, 0, 0, 0.15);
  z-index: 150;
}

svg text {
  font-family: 'Montserrat', sans-serif;
  pointer-events: none;
  font-size: 6;
}

.clock-hand {
  pointer-events: none;
}

.sector {
  fill: white;
}

.clock-text-container {
  pointer-events: none;
}

.clock-text {
  pointer-events: none;
  transform-origin: 50px 10px;
  font-size: 10px;
  text-anchor: middle
}

.hover-circle {
  pointer-events: none;
}

.clock-hand,
.sector,
.clock-text-container,
.hover-circle {
  transform-origin: center;
}

.button-row {
  margin: 10px;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
}

button {
  background: none;
  border: none;
  padding: 8px;
  margin: 4px;
  position: relative;
  margin: 0;
}

button::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  border-radius: 3px;
  box-shadow: 1px 2px 4px rgba(0,0,0,0.3);
  opacity: 0;
  transition: opacity .2s;
}

button:hover::after {
  opacity: 1;
}

input {
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid black;
  padding: 6px 10px;
  transition: 0.2s;
  font-family: 'Montserrat', sans-serif;
  resize: none;
}

.switch-container {
  display: flex;
  justify-content: center;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: .4s;
  background-color: var(--am-color);
}

.slider:before {
  position: absolute;
  content: "AM";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  text-align: center;
  line-height: 26px;
  font-size: 12px;
}

input:checked + .slider {
  background-color: var(--pm-color);
}


input:checked + .slider:before {
  transform: translateX(26px);
  content: "PM"
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

</style>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'

const textRadius = 35

export default Vue.extend({
  computed: {
    minuteHandDegrees(): number | undefined {
      if (this.minuteHover === undefined) {
        return this.minute === undefined ? undefined : this.minute * 6
      } else {
        return this.minuteHover * 6
      }
    },
    hourHandDegrees(): number | undefined {
      if (this.hourHover === undefined) {
        if (this.hour === undefined) {
          return undefined
        }

        if (this.minuteHandDegrees) {
          return this.minuteHandDegrees / 12 + this.hour * 30
        } else {
          return this.hour * 30
        }
      } else {
        if (this.minuteHandDegrees !== undefined) {
          return this.minuteHandDegrees / 12 + this.hourHover * 30
        } else {
          return this.hourHover * 30
        }
      }
    },
    cssVars(): string {
      let result = ''
      if (this.amColor) {
        result += '--am-color: ' + this.amColor + '; '
      }
      if (this.pmColor) {
        result += '--pm-color: ' + this.pmColor + '; '
      }
      return result
    },
  },
  mounted() {
    if (this.value) {
      this.setFieldsFromValue(this.value)
    }

    if (this.mobileQuery) {
      this.mobile = window.matchMedia(this.mobileQuery).matches
    } else {
      this.mobile = window.matchMedia('only screen and (max-width : 839px)').matches
    }

  },
  data: () => ({
    showPopup: false,
    choosingHour: true,
    hour: undefined,
    minute: undefined,
    hourHover: undefined,
    minuteHover: undefined,
    time: '12:00 AM',
    mobile: false,
  }),
  props: ['value', 'amColor', 'pmColor', 'mobileQuery'],
  methods: {
    emit() {
      this.$emit('input', this.time)
    },
    setTimeFromFields() {
      let minute
      if (this.minute === undefined) {
        minute = '00'
      } else {
        if (this.minute < 10) {
          minute = '0' + this.minute
        } else {
          minute = '' + this.minute
        }
      }

      const hour = this.hour === undefined ? '12' : this.hour

      let period = 'AM'
      if (this.$refs.period && this.$refs.period.checked) {
        period = 'PM'
      }

      this.time = hour + ':' + minute + ' ' + period

      this.emit()
    },
    setFieldsFromValue(value: string) {
      const time = value.match(/(\d+):(\d+)\s(.+)/)

      if (time && time.length === 4) {
        this.hour = +time[1]
        this.minute = +time[2]
        if (this.$refs.period) {
          this.$refs.period.checked = time[3] === 'PM'
        }
        this.time = value
      } else {
        console.error('Invalid time, must be in the format h:mm A')
      }
    },
    chooseHour(i: number) {
      this.hour = i
      this.hourHover = undefined
      if (!this.mobile) {
        this.choosingHour = false
      }
      this.setTimeFromFields()
    },
    chooseMinute(i: number) {
      this.minute = i
      this.minuteHover = undefined
      this.setTimeFromFields()
    },
    touchHover(ev) {
      if (this.choosingHour) {
        this.hourHover = this.getSelectionFromTouchEvent(ev, Math.PI / 6)
      } else {
        this.minuteHover = this.getSelectionFromTouchEvent(ev, Math.PI / 30)
      }
    },
    touchSelect(ev) {
      if (this.choosingHour) {
        this.chooseHour(this.getSelectionFromTouchEvent(ev, Math.PI / 6))
      } else {
        this.chooseMinute(this.getSelectionFromTouchEvent(ev, Math.PI / 30))
      }
    },
    getSelectionFromTouchEvent(ev: any, unit: number) {
      const touch: any = ev.changedTouches[0]
      const rect = ev.target.getBoundingClientRect()
      const x = touch.clientX - rect.left - rect.width / 2
      const y = rect.height / 2 - touch.clientY + rect.top
      let rad = Math.atan2(x, y)
      if (rad < 0) {
        rad += 2 * Math.PI
      }
      return Math.round(rad / unit)
    },
  },
  watch: {
    value(value) {
      if (value) {
        this.setFieldsFromValue(value)
      }
    },
  },
})
</script>
