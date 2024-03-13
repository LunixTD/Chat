import {
	createStore
} from 'vuex'

import ui from './modules/ui.js'
import chat from './modules/chat.js'
import user from './modules/user.js'
import message from './modules/message.js'

const store = createStore({
	modules: {
		ui: ui,
		chat: chat,
		user,
		message
	}
})

export default store