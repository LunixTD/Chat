import api from '@/services/request.js'
const state = {
	currTabPage: 'Notification',
	searchType: '0',
	raiseForInputHeight: 0,
	msgPageRaiseHeight: 0,
	showContentBox: false,
	bottomBoxRaiseHeight: 0,
	chatroomState: 'hide',
	canUsePushAnime: false,
	channelTypeStateChangeCounter: 0,
	myPopupRef: null,
	bottomModalRef: null,
	zPagingRef: null,
	notiPagingRef: null,
	msgPagingRef: null,
	detaiPagingRef: null,
	scrollTop: 0,
	scrollIntoView: '',
	serverBadgeNum: 0,
	msgBadgeNum: 0,
	noticeBadgeNum: 0,
	safeAreaBottom: 0,
	voiceTagetId: null,
	showVoicePage: false
}

const mutations = {
	changeTabPage(state, tabName) {
		state.currTabPage = tabName;
		switch (tabName) {
			case 'ChatRoom':
				state.serverBadgeNum = 0
				break
			case 'Msg':
				state.msgBadgeNum = 0
				break
			case 'Notification':
				state.noticeBadgeNum = 0
				break
		}
	},
	changeSearchType(state, type) {
		state.searchType = type
	},
	changeRaiseForInputHeight(state, height) {
		state.raiseForInputHeight = height
	},
	changeMsgPageRaiseHeight(state, height) {
		state.msgPageRaiseHeight = height
	},
	changeShowContentBox(state, bool) {
		state.showContentBox = bool
	},
	changeBottomBoxRaiseHeight(state, height) {
		state.bottomBoxRaiseHeight = height
	},
	changeChatroomState(state, roomState) {
		state.chatroomState = roomState
	},
	changeCanUsePushAnime(state, bool) {
		state.canUsePushAnime = bool
	},
	runTypeChangeCounter(state) {
		state.channelTypeStateChangeCounter += 1
	},
	setMyPopupRef(state, ref) {
		state.myPopupRef = ref
	},
	setBottomModalRef(state, ref) {
		state.bottomModalRef = ref
	},
	setzPagingRef(state, ref) {
		state.zPagingRef = ref
	},
	setNotiPagingRef(state, ref) {
		state.notiPagingRef = ref
	},
	setMsgPagingRef(state, ref) {
		state.msgPagingRef = ref
	},
	setDetailPagingRef(state, ref) {
		state.detailPagingRef = ref
	},
	changeScrollTop(state, top) {
		state.scrollTop = top
	},
	changeScrollIntoView(state, id) {
		state.scrollIntoView = id
	},
	updateServerBadgeNum(state, num) {
		let count = state.serverBadgeNum + num
		state.serverBadgeNum = count > 999 ? 999 : count
	},
	updateMsgBadgeNum(state, num) {

		let count = state.msgBadgeNum + num
		state.msgBadgeNum = count > 999 ? 999 : count
	},
	updateNoticeBadgeNum(state, num) {
		let count = state.noticeBadgeNum + num
		state.noticeBadgeNum = count > 999 ? 999 : count
	},
	setSafeAreaBottom(state, height) {
		state.safeAreaBottom = height
		// console.log(height)
	},
	changeVoiceTargetId(state, id) {
		state.voiceTagetId = id
	},
	changeShowVoicePage(state, bool) {
		state.showVoicePage = bool
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
	changeRaiseForInputHeight({
		commit
	}, height) {
		commit('changeRaiseForInputHeight', height)
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
	changeBottomBoxRaiseHeight({
		commit
	}, height) {
		commit('changeBottomBoxRaiseHeight', height)
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
	changeScrollTop({
		commit
	}, top) {
		commit('changeScrollTop', top)
	},
	changeScrollIntoView({
		commit
	}, id) {
		commit('changeScrollIntoView', id)
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}