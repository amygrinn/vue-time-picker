import { VueConstructor } from 'vue'

import TimePicker from './time-picker.vue'

module.exports = {
  install(Vue: VueConstructor) {
    Vue.component('time-picker', TimePicker)
  },
}
