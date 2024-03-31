<template>
	<!-- <page-meta :page-style="pageStyle"></page-meta> -->
	<MyPopup ref="pop"></MyPopup>
	<ModalBottom ref="bottomModel"></ModalBottom>
	<view class="container">
		<ChatRoom v-show="currTabPage == 'ChatRoom'"></ChatRoom>
		<Msg v-show="currTabPage == 'Msg'"></Msg>
		<Notification v-show="currTabPage == 'Notification'"></Notification>
		<My v-show="currTabPage == 'My'"></My>
		<TabBar></TabBar>
	</view>
</template>

<script setup>
import MsgDetail from '@/pages/MsgDetail/MsgDetail.vue';
import ChatRoom from '@/pages/ChatRoom/ChatRoom.vue';
import Msg from '@/pages/Msg/Msg.vue';
import Notification from '@/pages/Notification/Notification.vue';
import My from '@/pages/My/My.vue';
import { useUpdateBadge } from '@/store/hooks/useUpdateBadge.js';
import api from '@/services/request.js';
import io, { Manager } from '@hyoga/uni-socket.io';
import { useState } from '@/store/hooks/useStore.js';

import { computed, onMounted, ref, watch, nextTick, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { onPageScroll, onLoad, onShow } from '@dcloudio/uni-app';
import user from '../../store/modules/user';

// 底部安全区栏颜色，安卓端
// #ifdef APP-PLUS
// var Color = plus.android.importClass('android.graphics.Color');
// plus.android.importClass('android.view.Window');
// var mainActivity = plus.android.runtimeMainActivity();
// var window_android = mainActivity.getWindow();
// window_android.setNavigationBarColor(Color.parseColor('#2c2d35'));
var Color = plus.android.importClass('android.graphics.Color');
plus.android.importClass('android.view.Window');
var mainActivity = plus.android.runtimeMainActivity();
var window_android = mainActivity.getWindow();
var WindowManager = plus.android.importClass('android.view.WindowManager');
var View = plus.android.importClass('android.view.View');
//设置为全透明
window_android.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS | WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
window_android.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
window_android.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
window_android.setNavigationBarColor(Color.TRANSPARENT);
// #endif

const store = useStore();
const uiState = useState('ui', ['currTabPage', 'zPagingRef', 'notiPagingRef', 'detailPagingRef']);
const { currTabPage, zPagingRef, notiPagingRef, detailPagingRef } = uiState;
const currChannel = computed(() => {
	return store.state.chat.currChannel;
});
// tabbar主页面的弹出框引用保存到state,方便后续调用
const instance = getCurrentInstance();
const profile = uni.getStorageSync('profile');
const pop = ref(null);
const bottomModel = ref(null);
// uni.clearStorage();

onMounted(() => {
	const token = uni.getStorageSync('token');
	if (!token) {
		uni.reLaunch({
			url: '/pages/Index/Index'
		});
	}
	connectSocket();
	// 保存ref,必须在onMounted内执行，onload无效
	store.commit('ui/setMyPopupRef', instance.refs.pop);
	store.commit('ui/setBottomModalRef', instance.refs.bottomModel);
});

// socket相关
const socket = instance.proxy.$socket;
const manager = instance.proxy.$socketManager;
const conncectState = ref(false);
const heartBeatConfig = {
	time: 6 * 1000,
	timeout: 3 * 1000,
	reconnect: 10 * 1000
};
const connectTimer = ref(null);

function connectSocket() {
	manager.on('reconnect', () => {
		console.log('重连');
		onReconnect();
	});

	socket.connect();
	socket.on('connect', () => {
		console.log('socket连接成功');
	});
	socket.on('disconnect', () => {
		console.log('socket连接断开');
	});
	// socket.on('reconnect', () => {
	// 	console.log('socket重连成功~');
	// });

	initSocket();
}

// 监听自己id下的消息
socket.emit('joinRoom', profile._id);

// 加入到默认房间
socket.emit('joinRoom', profile.activeChannel);

function initSocket() {
	// 监听心跳响应
	// socket.on('heartBeat', (data) => {
	// 	conncectState.value = true;
	// 	const { timeStamp } = data;
	// 	console.log(`收到心跳响应${timeStamp}`);
	// });

	// 接收聊天信息
	socket.on('channel/chatMsg', (msg) => {
		// console.log(1231);
		store.dispatch('message/changeLastMsg', msg);
		zPagingRef.value.addChatRecordData(msg);
	});
	socket.on('room/chatMsg', async (msg) => {
		insertMsg(msg);
		// console.log(msg);
	});

	// 接收邀请
	socket.on('notice', (data) => {
		// console.log(data);
		if (data.type == 'invite') {
			notiPagingRef.value.addDataFromTop(data);
			if (tabPage.value !== 'Notification') {
				store.commit('ui/updateNoticeBadgeNum', 1);
			}
		}
	});

	// 接收语音请求
	socket.on('voice', (voiceData) => {
		// console.log(data);
		const { type, data } = voiceData;
		const { roomId, userList } = data;
		if (type == 'request') {
			// 语音请求
			let target = null;
			if (userList[0]._id === profile._id) {
				target = userList[1];
			} else {
				target = userList[0];
			}
			let params = {
				target,
				roomId,
				userList
			};
			// 接收到语音请求后调起语音页面
			uni.navigateTo({
				url: `/pages/VoicePage/VoicePage?type=receiver&params=${JSON.stringify(params)}`,
				animationType: 'fade-in'
			});
		} else if (type == 'answer') {
			// 请求的答复
			const { state } = data;
			if (state == 'accept') {
				// 语音接收，初始化webRTC等操作
				uni.$emit('startVoice', 'sender');
				insertMsg({
					content: '[语音请求被对方拒绝]',
					createTime: new Date().getTime(),
					creator: profile,
					msgDisplayType: 'newMsg',
					roomId,
					type: 'text'
				});
			} else if (state == 'reject') {
				// 语音被拒绝
				uni.$emit('closeVoicePage');
				insertMsg({
					content: '[语音请求被对方拒绝]',
					createTime: new Date().getTime(),
					creator: profile,
					msgDisplayType: 'newMsg',
					roomId,
					type: 'text'
				});
			}
		} else if (type == 'handup') {
			const { state } = data;
			if (state == 'cancel') {
				// 语音取消
				uni.$emit('closeVoicePage');
				insertMsg({
					content: '[对方取消语音通话]',
					createTime: new Date().getTime(),
					creator: profile,
					msgDisplayType: 'newMsg',
					roomId,
					type: 'text'
				});
			} else if (state == 'complete') {
				// 语音正常结束
				uni.$emit('closeVoicePage');
				insertMsg({
					content: '[语音通话时长]',
					createTime: new Date().getTime(),
					creator: profile,
					msgDisplayType: 'newMsg',
					roomId,
					type: 'text'
				});
			}
		}
	});

	// uniapp socket相关事件监听
	uni.$on('joinRoom', (roomId) => {
		socket.emit('joinRoom', roomId);
	});
	uni.$on('leaveRoom', (roomId) => {
		socket.emit('leaveRoom', roomId);
	});
	uni.$on('invite', (data) => {
		socket.emit('invite', data);
	});
	uni.$on('channel/sendMsg', (msg) => {
		socket.emit('channel/sendMsg', msg);
	});
	uni.$on('room/sendMsg', (msg) => {
		socket.emit('room/sendMsg', msg);
	});
	uni.$on('voice', (room) => {
		socket.emit('voice', room);
	});
}

function onReconnect() {
	// 监听自己id下的消息
	socket.emit('joinRoom', profile._id);

	// 加入到默认房间
	socket.emit('joinRoom', profile.activeChannel);
}

async function insertMsg(msg) {
	// 只有用户在指定消息页面才插入数据
	const pages = getCurrentPages();
	const currPage = pages.slice(-1)[0];
	if (currPage.$page.path == '/pages/MsgDetail/MsgDetail') {
		detailPagingRef.value.addChatRecordData(msg);
	}
	const roomList = uni.getStorageSync('profile').roomList;
	let hasRoom = false;
	if (roomList && roomList.length !== 0) {
		roomList.forEach((item) => {
			if (item == msg.roomId) {
				hasRoom = true;
			}
		});
	}
	if (hasRoom) {
		console.log('存在房间');
		uni.$emit('updateRoomLastMsg', msg);
	} else {
		console.log('不存在消息所在的房间，初始化创建房间');
		const room = await api.getRoom({
			id: msg.roomId
		});
		uni.$emit('updateRoomList', room.data);
		setTimeout(() => {
			uni.$emit('updateRoomLastMsg', msg);
		}, 400);
	}
	store.dispatch('message/changeLastMsg', msg);
	if (tabPage.value !== 'Msg' && msg.creator._id != profile._id) {
		store.commit('ui/updateMsgBadgeNum', 1);
	}
}
</script>

<style lang="scss">
/* #ifdef H5 */
::-webkit-scrollbar {
	display: none;
}
/* #endif */
.container {
	touch-action: none;
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow-x: hidden;
	background-color: $ThemeDark3Color;
	// z-index: 0;
}
.myBox {
	transition: opacity ease 0.3s;
}
.needInit {
	opacity: 0;
	z-index: -999;
}
</style>
