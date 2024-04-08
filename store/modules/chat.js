import {
	getCurrentInstance
} from 'vue'
import api from '@/services/request.js'
import {
	asyncUserProfile
} from '@/utils/hooks/useAsyncUserProfile.js'

const state = {
	currServerId: "",
	currServer: {},
	serverList: [],
	currChannel: {},
	emojiList: [],
	onlineUsers: [],
	serverUserList: [],
	currRoom: {}
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
	},
	async updateServerUserList(state) {
		// 获取服务器在线数据,过滤在线用户
		let profile = uni.getStorageSync('profile');
		const serverDataRes = await api.getServerOnlineData({
			serverId: profile.activeServer
		})
		state.serverUserList = serverDataRes.data.userList
	},
	changeCurrRoom(state, room) {
		state.currRoom = room
	}
}

const actions = {
	changeCurrServerId({
		commit
	}, serverId) {
		commit('changeCurrServerId', serverId);
	},
	updateServerList({
		commit,
		dispatch
	}, serverList) {
		serverList.forEach((server) => {
			let profile = uni.getStorageSync('profile');
			// 遍历获取到的服务器,对比刚才更新的激活服务器id,更新本地的当前服务器
			if (server._id == profile.activeServer) {
				dispatch('chat/changeCurrServer', server, {
					root: true
				})
			}
		})
		commit('updateServerList', serverList)
	},
	async changeCurrServer({
		commit,
		state,
		dispatch
	}, server) {
		let profile = uni.getStorageSync('profile');
		// 更新本地用户数据的步骤放在更新频道中，更新服务器必定更新频道
		const lastActiveChannel = profile.activeInfo[server._id].lastActiveChannel

		// 获取该频道数据
		api.getChannelInfo({
			id: lastActiveChannel
		}).then((res) => {
			dispatch('changeCurrChannel', res.data)
		})

		// console.log(profile.activeInfo[server._id].lastActiveChannel)
		commit('changeCurrServer', server);
		commit('changeCurrServerId', server._id);
		// 提醒zpaging刷新数据
		// uni.$emit('reloadData');
	},
	async changeCurrChannel({
		rootState,
		state,
		commit,
		dispatch
	}, channel) {
		uni.$emit('showLoadingState', true)
		let profile = uni.getStorageSync('profile');


		// 如果不相等说明是只更新频道，而不是更新服务器带来的联动频道更新，更新数据前先用旧id离开房间
		if (profile.activeChannel != channel._id) {
			// 更新频道的在线用户数据
			api.updateChannelInfo({
				oldChannelId: profile.activeChannel,
				newChannelId: channel._id,
				uid: profile._id
			})
			uni.$emit('leaveRoom', profile.activeChannel);
		}

		// 与服务器同步本地用户数据
		profile.activeServer = channel.serverId
		profile.activeChannel = channel._id
		profile.activeInfo[channel.serverId].lastActiveChannel = channel._id
		await asyncUserProfile('updateProfile', profile)


		// console.log(serverDataRes);
		commit('updateServerUserList')

		uni.$emit('joinRoom', channel._id);
		commit('changeCurrChannel', channel);

		// 提醒zpaging刷新数据
		uni.$emit('reloadData');
		// 更新后弹出聊天页面
		// dispatch('ui/changeChatroomState', 'show', {
		// 	root: true
		// });
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}