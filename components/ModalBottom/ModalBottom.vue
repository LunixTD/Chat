<template>
	<view class="modalContainer" :class="showState ? 'show' : 'hide'">
		<!-- <view class="modalMask show" @click="onMaskClick" :class="showState ? 'show' : 'hide'"></view> -->
		<view @click="onMaskClick">
			<GlobalMask :showState="showState ? 'show' : 'hide'"></GlobalMask>
		</view>
		<view class="modalContent" :style="[contentStyle]" :class="showState ? 'show' : 'hide'">
			<!-- 搜索添加好友 -->
			<view class="inviteArea" :style="searchBoxStyle" v-if="openAareName == 'inviteArea'">
				<MyInput ref="inviteInput" v-model="query" btn="搜索" placeholder="请输入对方昵称或ID号" :btnClick="search" :onInput="queryChange"></MyInput>
				<view class="targetBox" v-if="targetData">
					<image class="avatar" :src="targetData.avatarInfo ? api.target_url + targetData.avatarInfo.thumb : '/static/avatar/placed.jpeg'" mode="widthFix"></image>
					<text class="nickname">{{ targetData.nickname }}</text>
					<view class="uid">
						<text class="uid font-grey">uid:</text>
						<text class="uid">{{ targetData.id }}</text>
					</view>
					<view class="searchBtnBox" v-if="profile.id !== targetData.id">
						<view class="addfriend-btn" @click="handleBtnClick('addfriend')">
							<TouchBox :customStyle="customStyle" renderType="btn">
								<text>申请好友</text>
							</TouchBox>
						</view>
						<view class="invite-btn" @click="handleBtnClick('invite')">
							<TouchBox :customStyle="customStyle" renderType="btn">
								<text>邀请</text>
							</TouchBox>
						</view>
					</view>
					<view class="h1" v-if="profile.id == targetData.id">这是自己哦!</view>
				</view>
				<!-- <scroll-view scroll-y="true" class="searchList">
					<view class="listItem" v-for="(item, index) in 20" :key="index"></view>
				</scroll-view> -->
				<Loader v-if="!targetData" :loadingState="loadingState"></Loader>
			</view>

			<!-- 服务器配置列表项目 -->
			<scroll-view scroll-y="true" class="serverArea" :style="safeAreaBottomStyle" v-if="currServer.avatar && openAareName == 'serverArea'">
				<image class="serverAvatar" :src="api.target_url + currServer.avatar.thumb" mode="widthFix"></image>
				<text class="serverName">{{ currServer.serverName }}</text>
				<!-- <text class="serverProfile">服务器简介</text> -->
				<view class="counter">
					<view class="counterItem">
						<i class="icon green"></i>
						<text>{{ `${onlineCount} 人在线` }}</text>
					</view>
					<view class="counterItem">
						<i class="icon grey"></i>
						<text>{{ `${serverUserList.length} 位成员` }}</text>
					</view>
				</view>
				<view class="btnIconBox">
					<TouchBox :touchStartStyle="touchStartStyle" :touchEndStyle="touchEndStyle">
						<view class="iconBox" @click="toServerDataPage">
							<i class="iconfont icon-tongji"></i>
							<text>服务器数据</text>
						</view>
					</TouchBox>
					<TouchBox :touchStartStyle="touchStartStyle" :touchEndStyle="touchEndStyle">
						<view class="iconBox" @click="toInviteArea">
							<i class="iconfont icon-chatroom-addfriend"></i>
							<text>邀请</text>
						</view>
					</TouchBox>
					<TouchBox :touchStartStyle="touchStartStyle" :touchEndStyle="touchEndStyle">
						<view class="iconBox" @click="handleBtnClick('share')">
							<i class="iconfont icon-addfriend-share"></i>
							<text>邀请码</text>
						</view>
					</TouchBox>
				</view>
				<view class="confList">
					<ModalListItem
						v-for="(item, index) in serverConflistArr"
						:key="index"
						:title="item.title"
						:subTitle="item.subTitle"
						v-model="item.model"
						:initState="item.initState"
						:onClick="item.onClick"
						:color="item.color"
						:divider="index != serverConflistArr.length - 1"
					></ModalListItem>
				</view>
			</scroll-view>

			<!-- 目标用户信息区域 -->
			<scroll-view scroll-y="true" class="targetArea" :style="safeAreaBottomStyle" v-if="params && openAareName == 'targetArea'">
				<Avatar :customStyle="targetAvatarStyle" :uStateStyle="targetStateStyle" :avatarInfo="params.avatarInfo" :name="params.nickname" uState="online"></Avatar>
				<view class="targetAbout">
					<view class="nickname">{{ params.nickname }}</view>
					<view class="profileStr" v-if="params.profileStr">{{ params.profileStr }}</view>
					<view class="btnIconBox">
						<TouchBox :touchStartStyle="targetBtnStartStyle" :touchEndStyle="targetBtnEndStyle">
							<view class="iconBox" @click="handleTargetAreaBtnClick('sendMsg', params._id)">
								<i class="iconfont icon-zhuangtai"></i>
								<text>发消息</text>
							</view>
						</TouchBox>
						<TouchBox v-if="params._id !== profile._id" :touchStartStyle="targetBtnStartStyle" :touchEndStyle="targetBtnEndStyle">
							<view class="iconBox" @click="handleTargetAreaBtnClick('addFriend', params._id)">
								<i class="iconfont font-green icon-chatroom-addfriend"></i>
								<text class="font-green">添加好友</text>
							</view>
						</TouchBox>
					</view>
				</view>
			</scroll-view>

			<view class="permissionArea" :style="safeAreaBottomStyle" v-if="openAareName == 'permissionArea'">
				<text class="h1">“Chat”申请麦克风权限</text>
				<text class="h3 block font-grey">为正常使用该功能，请前往系统“设置”中允许访问麦克风。</text>
				<view class="permissionBtnBox">
					<view class="confirmBtn" @click="permissionBtn(false)">
						<TouchBox renderType="btn" color="grey">
							<text>不允许</text>
						</TouchBox>
					</view>
					<view class="confirmBtn" @click="permissionBtn(true)">
						<TouchBox renderType="btn" color="purple">
							<text>前往设置</text>
						</TouchBox>
					</view>
				</view>
			</view>
		</view>
	</view>
	<ModalConfirm ref="confirmModal" title="离开服务器" :content="confirmContent" @onConfirm="onModalConfirmed"></ModalConfirm>
</template>

<script setup>
import { computed, ref, onMounted, defineExpose, getCurrentInstance } from 'vue';
import variable from '@/styles/variable.js';
import { useSystemInfo } from '@/utils/hooks/useSystemInfo.js';
import { useSafeAreaBottomStyle } from '@/utils/hooks/useStatusBarHeightStyle.js';
import api from '@/services/request.js';
import { useStore } from 'vuex';
import { throttle, debounce } from 'lodash';
import { asyncUserProfile } from '@/utils/hooks/useAsyncUserProfile.js';
import permision from '@/js_sdk/wa-permission/permission.js';

const store = useStore();
const instance = getCurrentInstance();

const safeAreaBottom = useSystemInfo('safeAreaInsets').value.bottom;
const searchBoxStyle = {
	paddingBottom: safeAreaBottom == 0 ? '30rpx' : `${safeAreaBottom + 50}rpx`
};

const touchStartStyle = {
	backgroundColor: variable.ThemeDark3Color,
	borderRadius: '12rpx'
};
const touchEndStyle = {
	backgroundColor: variable.ThemeDarkPop,
	borderRadius: '12rpx'
};

const profile = computed(() => {
	return store.state.user.profile;
});
const myPopupRef = computed(() => {
	return store.state.ui.myPopupRef;
});
const currServer = computed(() => {
	// console.log(store.state.chat.currServer);
	return store.state.chat.currServer;
});
const serverUserList = computed(() => {
	return store.state.chat.serverUserList;
});
const onlineCount = computed(() => {
	let count = 0;
	serverUserList.value.forEach((item) => {
		if (item.activeServer == currServer.value._id) {
			count++;
		}
	});
	return count;
});

const safeAreaBottomStyle = useSafeAreaBottomStyle().value;
const saefAreaBottom = useSystemInfo('safeAreaInsets').value.bottom;

// 设置打开的不同区域的高度
const openAareName = ref('targetArea');
const contentStyle = computed(() => {
	let style = null;
	// 多出来30rpx是为了预留弹起动画时过度的高度
	if (openAareName.value == 'inviteArea') {
		style = `--contentHeight: 830rpx`;
	}
	if (openAareName.value == 'serverArea') {
		style = `--contentHeight: 930rpx`;
	}
	if (openAareName.value == 'targetArea') {
		style = `--contentHeight: 550rpx; transitionDuration: .4s`;
	}
	if (openAareName.value == 'permissionArea') {
		style = `--contentHeight: ${saefAreaBottom + 460}rpx; transitionDuration: .4s`;
	}
	return style;
});

// 模态框中开关操作
const params = ref(null);
const showState = ref(false);
function openBottomModal(areaName, data) {
	// console.log(areaName);
	// 如果有传参
	if (data) {
		params.value = data;
	}
	openAareName.value = areaName;
	showState.value = true;
}
function closeBottomModal() {
	showState.value = false;
	switch (openAareName.value) {
		case 'inviteArea': {
			instance.refs.inviteInput.clear();
			setTimeout(() => {
				targetData.value = null;
				params.value = null;
			}, 500);
			break;
		}
		case 'serverArea': {
			break;
		}
		case 'targetArea': {
			setTimeout(() => {
				params.value = null;
			}, 300);
			break;
		}
	}

	instance.refs.confirmModal.closeConfirmModal();
}

function onMaskClick() {
	closeBottomModal();
}

// 搜索用户
const customStyle = {
	width: '200rpx'
};
const inviteInput = ref(null);
const query = ref('');
const loadingState = ref('init');
const nicknameRegex = /^[\u4e00-\u9fa5A-Za-z0-9]{2,13}$/;
const targetData = ref(null);
function queryChange() {
	if (targetData.value != null) {
		targetData.value = null;
	}
}
async function search() {
	if (query.value == '') {
		return;
	}
	if (!nicknameRegex.test(query.value)) {
		myPopupRef.value.showPop('输入的昵称不合法!');
		return;
	}
	// console.log(query.value);
	loadingState.value = 'loading';
	const findRes = await api.searchUser({
		query: query.value
	});

	if (findRes.statusCode == 200) {
		if (findRes.data.length !== 0) {
			targetData.value = findRes.data[0];
			loadingState.value = 'init';
		} else {
			loadingState.value = 'void';
		}
	}
	// console.log(findRes.data);
}

// 处理用户申请按钮
// const profile = uni.getStorageSync('profile');
const handleBtnClick = throttle(async (type) => {
	// console.log(type);
	if (type == 'invite') {
		// console.log(targetData.value);
		if (targetData.value.serverList.includes(currServer.value._id)) {
			myPopupRef.value.showPop('对方已在该服务器', 3000);
			return;
		}
		// if (targetData.value)
		const tmpData = {
			targetId: targetData.value._id,
			uid: profile.value._id,
			serverId: profile.value.activeServer
		};
		const pushRes = await api.pushNotice(tmpData);
		// console.log(pushRes);
		if (pushRes.statusCode == 400) {
			myPopupRef.value.showPop('您已发送过邀请，请耐心等待对方接收~', 3000);
		} else {
			myPopupRef.value.showPop('已将您的邀请送出!', 3000);
			uni.$emit('invite', tmpData);
		}
	}
	if (type == 'share') {
		uni.setClipboardData({
			data: currServer.value.inviteId,
			success() {
				uni.hideToast();
				myPopupRef.value.showPop('已将服务器分享码复制至剪贴板', 1800);
			}
		});
	}
}, 3000);

// 服务器配置区域
const hideMuntedChannel = ref(false);
const allowDirect = ref(true);

// 各条配置项的数据
const serverConflistArr = [
	{
		title: '编辑服务器资料',
		onClick: editServerProfile
	},
	{
		title: '隐藏已静音的频道',
		model: hideMuntedChannel.value
	},
	{
		title: '允许私信',
		subTitle: '该服务器内所有人都可以私信您',
		model: allowDirect.value
	},
	{
		title: '离开服务器',
		onClick: leaveServer,
		color: variable.red
	}
];

function editServerProfile() {
	console.log('编辑服务器信息');
}
const confirmTitle = ref('');
const confirmContent = ref('');
const confirmModal = ref(null);
function leaveServer() {
	console.log('离开服务器');
	confirmTitle.value = '离开服务器';
	confirmContent.value = `您确定要退出 "${currServer.value.serverName}" 吗?`;
	// closeBottomModal();
	instance.refs.confirmModal.openConfirmModal();
}
async function onModalConfirmed(state) {
	// console.log(state);
	if (state == true) {
		// 退出服务器
		const leaveRes = await api.leaveServer({
			serverId: currServer.value._id,
			uid: profile.value._id
		});
		if (leaveRes.statusCode == 200) {
			// await asyncUserProfile('updateLocal', leaveRes.data);
			// console.log(leaveRes);
			uni.$emit('refreshServerList');
			closeBottomModal();
		}
	} else {
		// 关闭模态框
		instance.refs.confirmModal.closeConfirmModal();
	}
}
function toServerDataPage() {
	closeBottomModal();
	uni.navigateTo({
		url: '/pages/ServerData/ServerData',
		animationType: 'zoom-fade-out',
		animationDuration: 300
	});
}
function toInviteArea() {
	openAareName.value = 'inviteArea';
}

// 目标用户信息区域
const targetAvatarStyle = {
	width: '158rpx',
	height: '158rpx',
	fontSize: '70rpx',
	border: `10rpx solid ${variable.ThemeDark4Color}`
};
const targetStateStyle = {
	width: '50rpx',
	height: '50rpx',
	fontSize: '38rpx'
};
const targetBtnStartStyle = {
	backgroundColor: variable.ThemeDark4Color
};
const targetBtnEndStyle = {
	backgroundColor: '#1e1e26'
};
const msgPagingRef = computed(() => {
	return store.state.ui.msgPagingRef;
});
async function handleTargetAreaBtnClick(actionType, targetId) {
	switch (actionType) {
		case 'sendMsg': {
			// 点击发送消息给目标,则创建一个room聊天室
			const createRes = await api.createRoom({
				uid: profile.value._id,
				targetId
			});
			if (createRes != null) {
				const room = createRes.data;
				// if (!profile.roomList.include(room._id)) {
				// 	profile.roomList.unshift(room._id);
				// 	asyncUserProfile('updateLocal', {
				// 		roomList: profile.roomList
				// 	});
				// }

				profile.value.roomList.unshift(room._id);
				await asyncUserProfile('updateLocal', {
					roomList: profile.value.roomList
				});
				// console.log(profile.value);
				// return;
				// 往列表添加私聊房间
				uni.$emit('updateRoomList', room);

				store.commit('chat/changeCurrRoom', room);
				// console.log(room);
				uni.navigateTo({
					url: `/pages/MsgDetail/MsgDetail?room=${JSON.stringify(room)}`
				});
			}
			break;
		}
		case 'addFriend': {
			break;
		}
	}
}

// 权限申请区域
function permissionBtn(bool) {
	if (bool) {
		// 同意
		permision.gotoAppPermissionSetting();
		closeBottomModal();
	} else {
		closeBottomModal();
	}
}

defineExpose({ openBottomModal });
</script>

<style lang="scss">
.modalContainer {
	touch-action: none;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99999;
	// opacity: 0.1;
	// @include centering;
	// flex-direction: column;
	// justify-content: flex-end;
	&.show {
		animation: modalShow 0.3s ease forwards;
	}
	&.hide {
		animation: modalHide 0.3s ease forwards;
	}
	@keyframes modalShow {
		0% {
			z-index: 9999;
		}
		100% {
			z-index: 9999;
		}
	}
	@keyframes modalHide {
		0% {
			z-index: 9999;
		}
		99% {
			z-index: 9999;
		}
		100% {
			z-index: -1;
		}
	}
}
.modalContent {
	$contentHeight: var(--contentHeight);
	position: absolute;
	// bottom: calc($contentHeight * -1 - 30rpx);
	bottom: -100vh;
	left: 0;
	z-index: 9999;
	background-color: $ThemeDark3Color;
	width: 100vw;
	height: 100vh;
	padding: 30rpx;
	// padding-bottom: 0;
	// transform: translateY($contentHeight);
	border-top-left-radius: 40rpx;
	border-top-right-radius: 40rpx;
	transition: all cubic-bezier(0.66, -0.29, 0.37, 1.17) 0.46s;
	&.show {
		// opacity: 1;
		transform: translateY(calc($contentHeight * -1));
	}
	&.hide {
		// opacity: 0.3;
		transform: translateY(0);
	}
}
// 搜索添加好友
.inviteArea {
	width: 100%;
	height: 800rpx;
	@include centering;
	flex-direction: column;
	justify-content: flex-start;
	// 搜索列表
	.searchList {
		background-color: $ThemeDarkPop;
		height: calc(800rpx - 80rpx - 60rpx);
		margin-top: 30rpx;
		border-radius: 12rpx;
		overflow: hidden;
		.listItem {
			background-color: cornflowerblue;
			width: 100%;
			height: 88rpx;
			margin-bottom: 10rpx;
		}
	}

	// 搜索个人
	.targetBox {
		background-color: $ThemeDarkPop;
		width: 100%;
		height: calc(800rpx - 80rpx - 90rpx);
		margin-top: 30rpx;
		border-radius: 12rpx;
		overflow: hidden;
		// padding-bottom: 30rpx;
		@include centering;
		flex-direction: column;
		.avatar {
			width: 160rpx;
			height: 160rpx;
			border-radius: 80rpx;
		}
		.nickname {
			font-size: 38rpx;
			margin: 10rpx 0;
			margin-top: 30rpx;
		}
		.uid {
			font-size: 28rpx;
		}
		.searchBtnBox {
			width: 100%;
			padding: 0 60rpx;
			margin-top: 60rpx;
			@include centering;
			justify-content: space-evenly;
		}
		.h1 {
			margin-top: 40rpx;
		}
	}
}

// 服务器配置项
.serverArea {
	width: 100%;
	height: 900rpx;
	@include centering;
	flex-direction: column;
	justify-content: flex-start;
	text-align: left;
	.serverAvatar {
		width: 130rpx;
		height: 130rpx;
		border-radius: 12rpx;
		align-self: flex-start;
	}
	.serverName {
		display: block;
		width: 100%;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		font-size: 52rpx;
		text-align: left;
	}

	.counter {
		@include centering;
		justify-content: flex-start;
		.counterItem {
			color: $FontGrey;
			margin-right: 30rpx;
			@include centering;
			.icon {
				display: inline-block;
				width: 16rpx;
				height: 16rpx;
				margin-right: 8rpx;
				border-radius: 50%;
			}
			text {
				font-size: 22rpx;
			}
			.green {
				background-color: $IconGreen;
			}
			.grey {
				background-color: $FontGrey;
			}
		}
	}

	.btnIconBox {
		@include centering;
		margin: 20rpx 0;
		.iconBox {
			flex: 1;
			margin: 20rpx 0;
			@include centering;
			flex-direction: column;
			.iconfont {
				font-size: 38rpx;
			}

			text {
				font-size: 24rpx;
				margin-top: 10rpx;
			}
		}
	}

	.confList {
		border-radius: 22rpx;
		border: 1rpx solid $ThemeDarkPop;
		overflow: hidden;
		-webkit-backface-visibility: hidden;
		-webkit-transform: translate3d(0, 0, 0);
	}
}

// 目标用户信息区域
.targetArea {
	.targetAbout {
		background-color: $ThemeDark4Color;
		// padding: 12rpx 20rpx;
		margin-top: 26rpx;
		border-radius: 12rpx;
		overflow: hidden;
		.nickname {
			padding: 22rpx 20rpx 22rpx 20rpx;
			font-size: 42rpx;
			// margin: 10rpx 0;
		}
		.profileStr {
			padding: 0 20rpx;
			margin-bottom: 18rpx;
			font-size: 20rpx;
			color: $FontGrey;
		}
		.btnIconBox {
			@include centering;
			// margin: 20rpx 0;
			.iconBox {
				flex: 1;
				margin: 30rpx 0;
				@include centering;
				flex-direction: column;
				.iconfont {
					font-size: 38rpx;
				}

				text {
					font-size: 24rpx;
					margin-top: 10rpx;
				}
			}
		}
	}
}

// 权限申请区域
.permissionArea {
	width: 100%;
	@include centering;
	flex-direction: column;
	// justify-content: flex-start;
	align-items: flex-start;
	// background-color: coral;
	height: 400rpx;
	.h1 {
		margin: 20rpx 0;
	}
	.h3 {
		margin: 20rpx 0;
	}
	.permissionBtnBox {
		width: 100%;
		height: 100rpx;
		margin-top: 50rpx;
		@include centering;

		.confirmBtn {
			width: 240rpx;
			margin: 0 20rpx;
		}
	}
}

.modalMask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
	background-color: black;
	&.show {
		animation: modalMaskShow 0.4s ease forwards;
	}
	&.hide {
		animation: modalMaskHide 0.4s ease forwards;
	}
	@keyframes modalMaskShow {
		0% {
			opacity: 0;
			z-index: 99;
		}
		100% {
			opacity: 0.6;
			z-index: 99;
		}
	}
	@keyframes modalMaskHide {
		0% {
			opacity: 0.6;
			z-index: 99;
		}
		99% {
			opacity: 0;
			z-index: 99;
		}
		100% {
			z-index: -1;
		}
	}
}
</style>
