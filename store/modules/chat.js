import api from '@/services/request.js'

const state = {
	currServerId: "",
	currServer: {},
	serverList: [],
	currChannel: {},
	emojiList: []
}

const mutations = {
	changeCurrServerId(state, serverId) {
		state.currServerId = serverId
	},
	changeCurrServer(state, server) {
		state.currServer = server
	},
	updateServerList(state, serverList) {
		state.serverList = serverList.reverse()
	},
	changeCurrChannel(state, channel) {
		state.currChannel = channel
	},
	setEmojiList(state, list) {
		state.emojiList = list
	}
}

const actions = {
	changeCurrServerId({
		commit
	}, serverId) {
		commit('changeCurrServerId', serverId);
	},
	changeCurrServer({
		commit,
		state,
		dispatch
	}, server) {
		let profile = uni.getStorageSync('profile');
		// 更新本地用户数据
		profile.activeServer = server._id
		const lastActiveChannel = profile.activeInfo[server._id].lastActiveChannel
		profile.activeChannel = lastActiveChannel
		uni.setStorageSync('profile', profile);
		dispatch('user/changeProfile', profile, {
			root: true
		})

		api.getChannelInfo({
			id: lastActiveChannel
		}).then((res) => {
			commit('changeCurrChannel', res.data)
		})
		// console.log(profile.activeInfo[server._id].lastActiveChannel)
		commit('changeCurrServer', server);
		commit('changeCurrServerId', server._id);
	},
	updateServerList({
		commit,
		dispatch
	}, serverList) {
		serverList.forEach((server) => {
			let profile = uni.getStorageSync('profile');
			if (server._id == profile.activeServer) {
				dispatch('chat/changeCurrServer', server, {
					root: true
				})
			}
		})
		commit('updateServerList', serverList)
	},
	async changeCurrChannel({
		rootState,
		commit,
		dispatch
	}, channel) {
		let profile = uni.getStorageSync('profile');
		// 更新本地用户数据
		profile.activeChannel = channel
		profile.activeInfo[channel.serverId].lastActiveChannel = channel._id
		uni.setStorageSync('profile', profile);
		commit('user/changeProfile', profile, {
			root: true
		})
		// 获取该频道的消息
		const msgList = await api.getMsgList({
			origin: 'channel',
			id: channel._id,
			num: 10
		})
		if (msgList.statusCode == 200) {
			dispatch('message/changeChannelMsgList', msgList.data.reverse(), {
				root: true
			})
		}
		commit('changeCurrChannel', channel);
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}