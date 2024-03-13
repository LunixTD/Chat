import api from '@/services/request.js'
const state = {
	currTabPage: 'ChatRoom',
	searchType: '0',
	inputHeight: 0,
	msgPageRaiseHeight: 0,
	showContentBox: false,
	chatroomState: 'hide',
	canUsePushAnime: false,
	channelTypeStateChangeCounter: 0,
	myPopupRef: null
}

const mutations = {
	changeTabPage(state, tabName) {
		state.currTabPage = tabName
	},
	changeSearchType(state, type) {
		state.searchType = type
	},
	changeInputHeight(state, height) {
		state.inputHeight = height
	},
	changeMsgPageRaiseHeight(state, height) {
		state.msgPageRaiseHeight = height
	},
	changeShowContentBox(state, bool) {
		state.showContentBox = bool
	},
	changeChatroomState(state, roomState) {
		state.chatroomState = roomState
	},
	changeCanUsePushAnime(state, bool) {
		state.canUsePushAnime = bool
	},
	runTypeChangeCounter(state) {
		state.channelTypeStateChangeCounter += 1
		if ((state.channelTypeStateChangeCounter / 10) % 1 == 0) {
			const profile = uni.getStorageSync('profile')
			uni.request({
				url: api.user_update,
				method: "POST",
				data: {
					activeInfo: profile.activeInfo
				},
				success: (res) => {
					console.log(res)
				}
			})
		}
	},
	setMyPopupRef(state, ref) {
		state.myPopupRef = ref
	}
}

const actions = {
	changeTabPage({
		commit
	}, tabName) {
		commit('changeTabPage', tabName)
	},
	changeSearchType({
		commit
	}, type) {
		commit('changeSearchType', type)
	},
	changeInputHeight({
		commit
	}, height) {
		commit('changeInputHeight', height)
	},
	changeMsgPageRaiseHeight({
		commit
	}, height) {
		commit('changeMsgPageRaiseHeight', height)
	},
	changeShowContentBox({
		commit
	}, bool) {
		commit('changeShowContentBox', bool)
	},
	changeChatroomState({
		commit
	}, roomState) {
		commit('changeChatroomState', roomState)
	},
	changeCanUsePushAnime({
		commit
	}, bool) {
		commit('changeCanUsePushAnime', bool)
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}