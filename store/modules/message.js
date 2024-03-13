import {
	nextTick
} from 'vue'
import io from 'socket.io-client'
import api from '@/services/request.js'

const state = {
	channelMsgList: [],
	diretMsgList: [],
	diretTarget: {},
	currActiveMsg: '',
}

const mutations = {
	changeChannelMsgList(state, list) {
		state.channelMsgList = list
		console.log(list)
		nextTick(() => {
			uni.pageScrollTo({
				scrollTop: 99999999,
				duration: 0
			})
		})
	},
	updateChannelMsgList(state, list) {
		// state.channelMsgList = [...list, ...state.channelMsgList]
		state.channelMsgList = list.concat(state.channelMsgList)
		console.log(state.channelMsgList);
	},
	addMsgToChannelMsgList(state, msg) {
		state.channelMsgList.push(msg)
		nextTick(() => {
			uni.pageScrollTo({
				scrollTop: 99999999,
				duration: 200
			})
		})
	},
	addMsgToDiretMsgList(state, msg) {
		state.diretMsgList.push(msg)
	},
	changeDirectTarget(state, target) {
		state.diretTarget = target
	},
	// 当前正在播放媒体文件的消息
	changeCurrActiveMsg(state, id) {
		state.currActiveMsg = id
	}
}

const actions = {
	connectSocket(context, data) {
		const channelSocket = io(api.channel_socket, {
			transports: ["websocket"]
		})
		channelSocket.on("connect", () => {
			console.log("socket连接成功");
		})
		channelSocket.on("disconnect", () => {
			console.log("socket连接断开")
		})
	},
	changeChannelMsgList({
		commit
	}, list) {
		// console.log(list);
		commit('changeChannelMsgList', list);
	},
	updateChannelMsgList({
		commit
	}, list) {
		// console.log(list);
		commit('updateChannelMsgList', list);
	},
	addMsgToChannelMsgList({
		commit
	}, msg) {
		commit('addMsgToChannelMsgList', msg)
	},
	addMsgToDiretMsgList({
		commit
	}, msg) {
		commit('addMsgToDiretMsgList', msg)
	},
	changeDirectTarget({
		commit
	}, target) {
		commit('changeDirectTarget', target)
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