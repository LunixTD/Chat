<template>
	<view class="chat-container" :style="containerStyle" scroll-y>
		<view class="leftContent" @touchmove.stop.prevent="ontouchstart">
			<!-- 服务器列表 -->
			<scroll-view scroll-y="true" enable-flex class="serverBox" @touchstart="ontouchstart" @click="aaaa">
				<view
					v-for="(item, index) in serverList"
					:class="item._id == currServer._id ? 'active' : ''"
					class="serverItem"
					:key="index"
					@touchend=""
					@click="changeServer(item)"
				>
					<view class="itemBox">
						<image :src="api.target_url + item.avatar.thumb" mode="widthFix" class="itemImg"></image>
						<text class="itemTitle" v-if="false">info</text>
					</view>
				</view>
				<view class="addServerBtn" @click="addServer">
					<i class="iconfont icon-add"></i>
				</view>
			</scroll-view>
			<!-- 频道列表 -->
			<view class="channelBox" :style="channelBoxStyle" :class="noServerTag ? 'noServer' : ''">
				<view class="channelWrapper">
					<!-- 空服务器时的占位符 -->
					<view class="noServerView" v-if="noServerTag">
						<text class="text">您还没有属于自己的服务器哦</text>
						<text class="text h5">请按左侧的"+"号按钮添加一个服务器吧~</text>
						<image class="img" src="@/static/bg/noServer-bg.png" mode="widthFix"></image>
					</view>
					<!-- 有服务器显示频道列表 -->
					<view v-if="!noServerTag">
						<view class="serverTitleBox" hover-class="hover" hover-stay-time="60" @click="openBottomModel('serverArea')">
							<text class="serverName">{{ currServer.serverName }}</text>
							<i class="iconfont icon-more"></i>
						</view>
						<view class="channalSearchBox">
							<view class="inputBox">
								<input type="text" class="searchInput" placeholder="搜索" disabled />
								<i class="iconfont icon-search"></i>
							</view>
							<view @click="openBottomModel('inviteArea')">
								<i class="iconfont icon-chatroom-addfriend"></i>
							</view>
						</view>
						<scroll-view scroll-y="true" enable-flex class="channelSort">
							<MyCollapse
								v-for="(sortItem, typeIndex) in currServer.channelSortList"
								:key="sortItem._id"
								:initState="activeInfo != undefined ? activeInfo[currServer._id][sortItem._id] : true"
								:sortId="sortItem._id"
							>
								<template #title>
									<view class="customTitle">{{ sortItem.channelSortName }}</view>
								</template>
								<template #content="{ showCollapse }">
									<view class="channelContent">
										<view
											class="channelItem"
											v-for="(item, index) in sortItem.channelList"
											:key="item._id"
											:class="[currChannel._id == item._id ? 'active' : '', showCollapse || currChannel._id == item._id ? 'show' : 'hide']"
											@touchend=""
											@click="changeChannel(item)"
										>
											<i class="iconfont" :class="'icon-chatroom-' + item.type"></i>
											<text class="itemTitle">{{ item.channelName }}</text>
										</view>
									</view>
								</template>
							</MyCollapse>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>

		<!-- 聊天界面防滚动遮罩 -->
		<view class="roomMask" @touchend.prevent="changeChatroomState('show')" :style="{ zIndex: chatroomState == 'show' ? 0 : 102 }"></view>

		<!-- 防透底部遮罩，因为原理是右侧界面滑动到左侧，要给个底面，防止过度滑动的时候显示到底部UI界面 -->
		<view class="leftContentMask" :class="chatroomState == 'show' ? 'show' : 'hide'"></view>

		<!-- 聊天房间 -->
		<Room v-if="serverList.length != 0"></Room>
	</view>
</template>

<script setup>
import { onBackPress, onPageScroll, onLoad, onHide } from '@dcloudio/uni-app';
import { ref, computed, onUpdated, watch, watchEffect, nextTick, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import api from '@/services/request.js';
import { useSystemInfo } from '@/utils/hooks/useSystemInfo.js';
import { asyncUserProfile } from '@/utils/hooks/useAsyncUserProfile.js';
import Room from './Room.vue';

// 禁止默认返回
// 处理返回
onBackPress(() => {
	if (chatroomState.value == 'show') {
		changeChatroomState('hide');
	}
	return true;
});

const statusBarHeight = useSystemInfo('statusBarHeight');
const channelBoxStyle = computed(() => {
	return {
		paddingTop: `${uni.upx2px(10) + statusBarHeight.value}px`
	};
});

const instance = getCurrentInstance();
const store = useStore();
const chatState = useState('chat', ['serverList', 'currServer', 'currChannel']);
const { serverList, currServer, currChannel } = chatState;
const uiState = useState('ui', ['chatroomState', 'bottomModalRef']);
const { chatroomState, bottomModalRef } = uiState;
const activeInfo = computed(() => {
	return store.state.user.profile.activeInfo;
});
const noServerTag = computed(() => {
	// console.log(serverList.value.length);
	return serverList.value.length == 0 ? true : false;
});

const containerStyle = computed(() => {
	let style = chatroomState.value === 'show' ? { overflow: 'visible' } : { overflow: 'hidden' };
	return style;
});

const myCollapseState = (sortItem) => {
	if (activeInfo.value !== undefined) {
		// console.log(sortItem);
		// 如果是激活频道下的分类,则默认展开
		sortItem.channelList.forEach((channel) => {
			if (channel._id == currChannel.value._id) {
				return true;
			}
		});
		return activeInfo.value[currServer.value._id][sortItem._id];
	} else {
		return true;
	}
};

// 初始化请求数据
onLoad(() => {
	// 清空缓存数据
	// uni.clearStorage();
	// 创建服务器后返回该页面刷新服务器列表
	uni.$on('refreshServerList', function () {
		getServerList();
	});
	getServerList();
});

// 每次更新时把最后消息数据清空,防止切换tab时反复触发最后消息插入动画
onUpdated(() => {
	store.dispatch('message/changeLastMsg', {});
});

// 获取最新用户数据，从数据中剥取服务器列表
async function getServerList() {
	const profile = uni.getStorageSync('profile');
	// 获取服务器列表
	const { data } = await api.getServerList({
		uid: profile._id
	});
	const serverIdArr = data.serverList.map((item) => {
		return item._id;
	});

	await asyncUserProfile('updateLocal', {
		activeServer: data.activeServer,
		activeChannel: data.activeChannel,
		activeInfo: data.activeInfo,
		serverList: serverIdArr
	});

	// console.log(serverListRes);
	// 初始化数据
	if (data.length !== 0) {
		store.dispatch('chat/updateServerList', data.serverList);
	}
}

// 更换服务器
function changeServer(server) {
	const profile = uni.getStorageSync('profile');
	if (profile.activeServer != server._id) {
		console.log('切换服务器');
		store.dispatch('chat/changeCurrServer', server);
	}
}
// 添加服务器
function addServer() {
	uni.navigateTo({
		url: '/pages/AddServer/AddServer',
		animationType: 'slide-in-bottom',
		animationDuration: 300
	});
}
// 更换频道
function changeChannel(channel) {
	const profile = uni.getStorageSync('profile');
	// console.log(profile.activeChannel, channel._id);
	if (profile.activeChannel != channel._id) {
		console.log('切换频道');
		store.dispatch('chat/changeCurrChannel', channel);
	}
	changeChatroomState('show');
}
function changeChatroomState(state) {
	store.dispatch('ui/changeChatroomState', state);
}

// 邀请其他人加入服务器
function openBottomModel(areaName) {
	// console.log(bottomModalRef.value);
	bottomModalRef.value.openBottomModal(areaName);
}

// 测试用
function aaaa() {}
function ontouchstart() {
	// console.log('点击');
}
</script>

<style lang="scss">
.chat-container {
	touch-action: none;
	position: relative;
	width: 100vw;
	height: auto !important;
	background-color: $ThemeDark4Color;
	@include centering;
	justify-content: flex-start;
	padding-left: calc(100vw - 120rpx + 20rpx);
	overflow: hidden;
	.leftContent {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		@include centering;
		justify-content: flex-start;
		align-items: flex-start;
		height: 100vh;
		background-color: $ThemeDark4Color;
	}

	// 服务器列表
	.serverBox {
		width: 146rpx;
		height: 100%;
		// background-color: coral;
		padding: 20rpx 0;
		padding-top: calc(50rpx + var(--status-bar-height));
		padding-bottom: 120rpx;
		.serverItem {
			position: relative;
			width: 146rpx;
			height: 116rpx;
			padding: 0 10rpx;
			@include centering;
			&::before {
				content: '';
				width: 16rpx;
				height: 16rpx;
				background-color: white;
				border-radius: 8rpx;
				position: absolute;
				left: 0;
				top: 50%;
				transform: translate(-8rpx, -50%);
				transition: height ease 0.3s;
			}
			.itemBox {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50rpx;
				overflow: hidden;
				transition: all ease 0.3s;
				.itemImg {
					width: 100%;
					height: 100%;
				}
			}
			&.active .itemBox {
				border-radius: 30rpx;
			}
			&.active::before {
				height: 88rpx;
			}
		}
		// 添加按钮
		.addServerBtn {
			width: 146rpx;
			height: 116rpx;
			padding: 0 10rpx;
			@include centering;
			.iconfont {
				width: 100rpx;
				height: 100rpx;
				line-height: 100rpx;
				font-size: 40rpx;
				border-radius: 50%;
				background-color: $ThemeDark2Color;
			}
		}
	}
	// 频道列表
	.channelBox {
		width: calc(100vw - 146rpx - 120rpx);
		height: 100%;
		padding: 30rpx 0;
		&.noServer {
			width: calc(100vw - 146rpx - 30rpx);
		}
		.channelWrapper {
			width: 100%;
			height: 100%;
			border-top-left-radius: 50rpx;
			border-top-right-radius: 10rpx;
			background-color: $ThemeDark3Color;
			@include centering;
			flex-direction: column;
			justify-content: flex-start;
			padding: 30rpx 0;

			.noServerView {
				width: 100%;
				height: 100%;
				padding-bottom: 300rpx;
				text-align: center;
				@include centering;
				flex-direction: column;
				.text {
					justify-self: flex-start;
					display: block;
					font-size: 36rpx;
					color: $FontGrey;
					margin: 10rpx 0;
				}
				.h5 {
					font-size: 26rpx;
				}
				.img {
					width: 88%;
					margin: 10rpx 0;
				}
			}

			.serverTitleBox {
				@include centering;
				width: 100%;
				justify-content: space-between;
				padding: 0 40rpx;
				margin-bottom: 20rpx;
				&.hover {
					color: $FontGrey;
				}
				.serverName {
					font-size: 36rpx;
					font-weight: 600;
				}
				.iconfont {
					font-size: 32rpx;
					/* #ifdef MP-WEIXIN */
					margin-right: 70rpx;
					/* #endif */
				}
			}
			.channalSearchBox {
				width: 100%;
				padding: 0 30rpx;
				padding-top: 10rpx;
				padding-bottom: 20rpx;
				@include centering;
				justify-content: space-between;
				.inputBox {
					flex: 1;
					position: relative;
					.searchInput {
						height: 80rpx;
						border-radius: 40rpx;
						background-color: $ThemeDark4Color;
						padding-left: 80rpx;
						line-height: 80rpx;
						font-size: 26rpx;
						margin-right: 20rpx;
					}
					.iconfont {
						display: inline-block;
						width: 80rpx;
						height: 80rpx;
						line-height: 80rpx;
						text-align: center;
						position: absolute;
						left: 0;
						top: 0;
					}
				}
				.iconfont {
					display: inline-block;
					width: 80rpx;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					background-color: $ThemeDark4Color;
					border-radius: 40rpx;
				}
			}

			// 频道
			.channelSort {
				background-color: $ThemeDark3Color;
				.customTitle {
					width: 100%;
					height: 60rpx;
					background-color: $ThemeDark3Color;
					font-size: 30rpx;
					line-height: 60rpx;
					color: $FontGrey;
					// padding: 0 20rpx;
				}
				.uni-icons {
					font-size: 26rpx;
				}
				.channel-content {
					background-color: $ThemeDark3Color;
				}
				.channelContent {
					.channelItem {
						background-color: $ThemeDark3Color;
						color: $FontGrey;
						height: 80rpx;
						width: 100%;
						font-size: 0;
						line-height: 80rpx;
						padding: 0 20rpx;
						@include centering;
						justify-content: flex-start;
						transition: all ease 0.3s;
						.itemTitle {
							font-size: 30rpx;
							line-height: 80rpx;
						}
						.iconfont {
							font-size: 42rpx;
							margin-right: 20rpx;
							line-height: 80rpx;
						}
						// 这里的顺序一定不能修改!一定是active样式最优先！！
						&.show {
							display: flex;
						}
						&.hide {
							display: none;
						}
						&.active {
							background-color: $ThemeDarkPop;
							color: white;
						}
					}
				}
			}
		}
	}
	.wrapper {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		// @include centering;
		// justify-content: flex-start;
	}

	// 防触控遮罩层
	.roomMask {
		position: fixed;
		top: 0;
		left: calc(100vw - 120rpx + 20rpx);
		width: 100vw;
		height: 100vh;
		// background-color: rgba(0, 0, 0, 0.4);
		// background-color: red;
		z-index: 102;
	}

	// 防透底色遮罩层
	.leftContentMask {
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		opacity: 0;
		background-color: $ThemeDark3Color;
		&.show {
			// opacity: 0.4;
			// z-index: 99;
			animation: leftContentMaskShow 0.3s ease forwards;
		}
		&.hide {
			animation: leftContentMaskHide 0.3s ease forwards;
			// opacity: 0;
			// z-index: -1;
		}
		@keyframes leftContentMaskShow {
			0% {
				opacity: 0;
				z-index: 99;
			}
			100% {
				opacity: 1;
				z-index: 99;
			}
		}
		@keyframes leftContentMaskHide {
			0% {
				opacity: 1;
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

	// 聊天房间
	.roomBox {
		z-index: 99;
		// margin-left: 300px;
		// position: absolute;
		// top: 0;
		// left: calc(100vw - 120rpx + 20rpx);
		// margin-left: 100vw;
		// transition: margin ease 0.3s;
		// &.show {
		// 	margin-left: 0;
		// }
		// &.hide {
		// 	margin-left: 100vw;
		// }
	}
}
</style>
