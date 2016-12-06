import Vue from 'vue'
import Demo from './demo.vue'

import Modal from '../src'

Vue.use(Modal, {
	options : {
		bgcolor : 'rgba(0, 0, 0, .8)'
	}
})

new Vue({
	el: '#app',
	components: { Demo },
	template : '<Demo/>'
})