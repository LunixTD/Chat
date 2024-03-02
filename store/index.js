import {
	createStore
} from 'vuex'

import ui from './modules/ui.js'
import chat from './modules/chat.js'

const store = createStore({
	modules: {
		ui: ui,
		chat: chat
	}
})

export default store