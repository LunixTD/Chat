import {
	nextTick
} from 'vue'
import io from '@hyoga/uni-socket.io';
import api from '@/services/request.js';

const state = {
	channelMsgList: [],
	diretMsgList: [],
	diretTarget: {},
	currActiveMsg: '',
	// 最后一条消息数据暂时只为插入动画用，这样无需关心消息初始化时的变化
	lastMsg: {},
	canloadHistory: false,
	channelSocket: null,

}

const mutations = {
	changeChannelMsgList(state, list) {
		state.channelMsgList = list
		// console.log(list)
	},
	updateChannelMsgList(state, list) {
		// state.channelMsgList = [...list, ...state.channelMsgList]
		state.channelMsgList = state.channelMsgList.concat(list)
		// console.log(state.channelMsgList);
	},
	addMsgToChannelMsgList(state, msg) {
		state.channelMsgList.push(msg)
		// nextTick(() => {
		// 	uni.pageScrollTo({
		// 		scrollTop: 99999999,
		// 		duration: 200
		// 	})
		// })
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
	},
	changeLastMsg(state, msg) {
		state.lastMsg = msg
	},
	changeCanloadHistory(state, loadState) {
		state.canloadHistory = loadState
	},
	changeChannelSocket(state, socket) {
		state.channelSocket = socket
	},
}

const actions = {
	connectSocket({
		commit
	}, data) {
		console.log(234234)
	},
	changeChannelMsgList({
		dispatch,
		commit
	}, list) {
		commit('changeChannelMsgList', list);
		nextTick(() => {
			// setTimeout(() => {
			// 	dispatch('ui/changeScrollIntoView', 'lastBox', {
			// 		root: true
			// 	})
			// }, 500)
			// commit('changeCanloadHistory', true);
		})
	},
	updateChannelMsgList({
		state,
		commit
	}, list) {
		// console.log(list);
		commit('updateChannelMsgList', list);
		commit('changeCanloadHistory', true);
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
	},
	changeLastMsg({
		commit
	}, msg) {
		commit('changeLastMsg', msg)
	},
	changeCanloadHistory({
		commit
	}, state) {
		commit('changeCanloadHistory', state)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}