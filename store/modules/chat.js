const state = {
	currServer: '001',
	serverList: ['001', '002', '003', '004', '005'],
	currRoom: {
		id: 'room01',
		lastMsg: {
			id: ''
		}
	},
	currActiveMsg: '00001',
	msgList: [{
		id: '00001',
		uid: '11111',
		user: 'tudou',
		date: 1708693732579,
		msg: {
			type: 'text',
			voiceData: {},
			imgData: {},
			content: '土豆tudou1',
		}
	}, {
		id: '00002',
		uid: '22222',
		user: 'douzi',
		date: 1708693732579,
		msg: {
			type: 'voice',
			voiceData: {},
			imgData: {},
			content: '土豆tudou1',
		}
	}, {
		id: '00003',
		uid: '11111',
		user: 'tudou',
		date: 1708693732579,
		msg: {
			type: 'text',
			voiceData: {},
			imgData: {},
			content: '土豆土豆2',
		}
	}]
}

const mutations = {
	changeCurrServer(state, serverId) {
		state.currServer = serverId
	},
	updateServerList(state, serverList) {
		state.serverList = serverList
	},
	addMsgToList(state, msg) {
		state.msgList.push(msg)
	},
	changeCurrActiveMsg(state, id) {
		state.currActiveMsg = id
	}
}

const actions = {
	changeCurrServer({
		commit
	}, serverId) {
		commit('changeCurrServer', serverId);
	},
	updateServerList({
		commit
	}, serverList) {
		commit('updateServerList', serverList)
	},
	addMsgToList({
		commit
	}, msg) {
		commit('addMsgToList', msg)
	},
	changeCurrActiveMsg({
		commit
	}, id) {
		commit('changeCurrActiveMsg', id)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}