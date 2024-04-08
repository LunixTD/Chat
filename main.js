import App from './App'
import api from '@/services/request.js'
import {
	Manager
} from '@hyoga/uni-socket.io'
// import fs from 'fs'
// #ifdef H5
import vconsole from 'vconsole'
// #endif
import './utils/interceptor.js'

// console.log(keys);

const manager = new Manager(api.socket_base_url, {
	// key: wss.key,
	// cert: wss.cert,
	autoConnect: false,
	transports: ['websocket', 'polling'],
	reconnectionDelayMax: 10000
})
const socket = manager.socket('/')

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
// import _ from 'lodash';
import store from '@/store/index.js'
import TabBar from '@/components/TabBar/TabBar'
import VConsole from 'vconsole'
export function createApp() {
	const app = createSSRApp(App)
	// app.config.globalProperties.lodash = _;
	app.config.globalProperties.$socketManager = manager
	app.config.globalProperties.$socket = socket
	// #ifdef H5
	app.config.globalProperties.$vconsole = new vconsole()
	// #endif
	app.component('TabBar', TabBar)
	app.use(store)
	return {
		app
	}
}
// #endif