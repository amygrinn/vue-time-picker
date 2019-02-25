import Vue from 'vue'
import { expect } from 'chai'

import './dist/vue-time-picker.min'

let TimePicker

window.TimePicker.install({
  component(s, c) {
    TimePicker = Vue.extend(c)
  }
})

window.matchMedia = (s) => true

describe('Time Picker', () => {

  it('Sets the initial time to midnight', () => {
    const vm = new TimePicker()
    expect(vm.time).to.equal('12:00 AM')
  })

  describe('Styles', () => {
    it('Sets css vars to be empty string if no props', () => {
      const vm = new TimePicker()
      expect(vm.cssVars).to.be.empty
    })

    it('Sets am color var if prop passed in', () => {
      const vm = new TimePicker({
        propsData: {
          amColor: 'blue'
        }
      })

      expect(vm.cssVars).to.include('--am-color: blue')
    })

    it('Sets pm color if prop passed in', () => {
      const vm = new TimePicker({
        propsData: {
          pmColor: 'green'
        }
      })

      expect(vm.cssVars).to.include('--pm-color: green')
    })

    it('Sets both am and pm color if props passed in', () => {
      const vm = new TimePicker({
        propsData: {
          amColor: 'black',
          pmColor: 'yellow'
        }
      })

      expect(vm.cssVars).to.include('--am-color: black')
      expect(vm.cssVars).to.include('--pm-color: yellow')
    })
  })

  describe('Set fields from value', () => {
    it('Sets the hours field to 3', () => {
      const vm = new TimePicker({
        propsData: {
          value: '3:00 AM'
        }
      }).$mount()
  
      expect(vm.hour).to.equal(3)
    })
  
    it('Sets the minutes field to 39', () => {
      const vm = new TimePicker({
        propsData: {
          value: '3:39 AM'
        }
      }).$mount()
  
      expect(vm.minute).to.equal(39)
    })  
  })

  describe('Set time from fields', () => {
    it('Sets the hours to 5', () => {
      const vm = new TimePicker()
      vm.hour = 5,
      vm.setTimeFromFields()
      expect(vm.time).to.include('5')
    })

    it('Sets the minutes to 35', () => {
      const vm = new TimePicker()
      vm.minute = 35,
      vm.setTimeFromFields()
      expect(vm.time).to.include(':35')
    })

    it('Sets the time to 4:34', () => {
      const vm = new TimePicker()
      vm.minute = 34,
      vm.hour = 4
      vm.setTimeFromFields()
      expect(vm.time).to.equal('4:34 AM')
    })
  })

  describe('Minute hand degrees', () => {
    it('Returns undefined if no minutes set or hovered', () => {
      const vm = new TimePicker()
      expect(vm.minuteHandDegrees).to.be.undefined
    })

    it('Returns 90 degrees if minutes is 15', () => {
      const vm = new TimePicker()
      vm.minute = 15
      expect(vm.minuteHandDegrees).to.equal(90)
    })

    it('Returns 180 degrees if minute hover is 30', () => {
      const vm = new TimePicker()
      vm.minuteHover = 30
      expect(vm.minuteHandDegrees).to.equal(180)
    })

    it('Uses minute hover value if set over the value of minute', () => {
      const vm = new TimePicker()
      vm.minute = 15
      vm.minuteHover = 45
      expect(vm.minuteHandDegrees).to.equal(270)
    })
  })

  describe('Hour hand degrees', () => {
    it('Returns undefined when no hour set', () => {
      const vm = new TimePicker()
      expect(vm.hourHandDegrees).to.be.undefined
    })

    it('Returns 30 degrees if hour is 1', () => {
      const vm = new TimePicker()
      vm.hour = 1
      expect(vm.hourHandDegrees).to.equal(30)
    })

    it('Returns 120 degrees if hour hover is 4', () => {
      const vm = new TimePicker()
      vm.hourHover = 4
      expect(vm.hourHandDegrees).to.equal(120)
    })

    it('Uses hour hover value over hour', () => {
      const vm = new TimePicker()
      vm.hour = 6
      vm.hourHover = 9
      expect(vm.hourHandDegrees).to.equal(270)
    })

    it('Gets halfway point between hours if minutes is 30', () => {
      const vm = new TimePicker()
      vm.hour = 6
      vm.minute = 30
      expect(vm.hourHandDegrees).to.equal(195)
    })

    it('Gets halfway point if minute hover is 30', () => {
      const vm = new TimePicker()
      vm.hour = 3
      vm.minuteHover = 30
      expect(vm.hourHandDegrees).to.equal(105)
    })
  })
  
})
