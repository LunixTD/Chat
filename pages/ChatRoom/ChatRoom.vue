<template>
	<view class="chat-container" :style="containerStyle">
		<!-- <TabBar></TabBar> -->
		<!-- <view class="wrapper"> -->
		<view class="leftContent" @touchstart.stop="ontouchstart">
			<!-- 服务器列表 -->
			<scroll-view scroll-y="true" class="serverBox">
				<view class="serverItem" v-for="(item, index) in serverList" :key="index" :class="item == currServer ? 'active' : ''" @click="handleChangeServer(item)">
					<view class="itemBox">
						<image src="../../static/avatar/01.jpg" mode="widthFix" class="itemImg"></image>
						<text class="itemTitle" v-if="false">info</text>
					</view>
				</view>
			</scroll-view>
			<!-- 频道列表 -->
			<view class="channelBox">
				<view class="channelWrapper">
					<view class="serverTitleBox">
						<text class="serverName">tudouserver</text>
						<i class="iconfont icon-server-conf"></i>
					</view>
					<view class="channalSearchBox">
						<view class="inputBox">
							<input type="text" class="searchInput" placeholder="搜索" disabled />
							<i class="iconfont icon-search"></i>
						</view>
						<i class="iconfont icon-chatroom-addfriend"></i>
					</view>
					<scroll-view scroll-y="true" class="channelList">
						<uni-collapse class="text-channel channel">
							<uni-collapse-item titleBorder="none" :border="false">
								<template v-slot:title>
									<TouchBox :customStyle="customStyle" :touchStyle="touchStyle">
										<view class="customTitle">文字频道</view>
									</TouchBox>
								</template>
								<view class="channel-content">
									<view class="channelItem" @click="handleChatroom('show')">
										<i class="iconfont icon-chatroom-text"></i>
										<text class="itemTitle">综合</text>
									</view>
									<view class="channelItem">
										<i class="iconfont icon-chatroom-text"></i>
										<text class="itemTitle">高能</text>
									</view>
								</view>
							</uni-collapse-item>
						</uni-collapse>
						<uni-collapse class="voice-channel channel">
							<uni-collapse-item titleBorder="none" :border="false">
								<template v-slot:title>
									<TouchBox :customStyle="customStyle" :touchStyle="touchStyle">
										<view class="customTitle">语音频道</view>
									</TouchBox>
								</template>
								<view class="channel-content">
									<view class="channelItem">
										<i class="iconfont icon-chatroom-voice"></i>
										<text class="itemTitle">综合</text>
									</view>
									<view class="channelItem">
										<i class="iconfont icon-chatroom-voice"></i>
										<text class="itemTitle">高能</text>
									</view>
								</view>
							</uni-collapse-item>
						</uni-collapse>
					</scroll-view>
				</view>
			</view>
		</view>

		<!-- 聊天房间 -->
		<!-- <view ></view> -->
		<Room class="roomBox" :class="chatroomState == 'show' ? 'show' : 'hide'"></Room>
	</view>
</template>

<script setup>
import { onBackPress, onPageScroll, onLoad } from '@dcloudio/uni-app';
import { ref, computed, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
import useGetter from '@/store/hooks/useGetters.js';
import Room from './Room.vue';

const customStyle = {
	// backgroundColor: 'rgb(56, 58, 67, 1)'
};
const touchStyle = {
	transform: 'scale(0.97)'
	// backgroundColor: 'rgba(87, 90, 99, 1)'
};

const store = useStore();
// const { currServer, serverList } = store.state.chat;
const chatroomState = computed(() => {
	return store.state.ui.chatroomState;
});
const currServer = computed(() => {
	return store.state.chat.currServer;
});
const serverList = computed(() => {
	return store.state.chat.serverList;
});

function handleChangeServer(serverId) {
	store.dispatch('chat/changeCurrServer', serverId + '');
	// console.log(serverId);
}

function handleChatroom(state) {
	store.dispatch('ui/changeChatroomState', state + '');
}

// 禁止默认返回
// 处理返回
onBackPress(() => {
	return true;
});

// #ifdef H5
const box = document.getElementsByClassName('chat-container');
console.log(box);
// #endif

// 让左侧窗口跟着右侧聊天窗口滚动，造成只有右侧窗口滚动的假象
const scrollTop = ref(0);
const scrollTopTmp = ref(0);
onPageScroll((e) => {
	// console.log(e.scrollTop);
	// scrollTop.value = e.scrollTop;
	scrollTopTmp.value = e.scrollTop;
});

watch(chatroomState, (val) => {
	if (val == 'hide') {
		scrollTop.value = scrollTopTmp.value;
		nextTick(() => {
			setTimeout(() => {
				uni.pageScrollTo({
					scrollTop: scrollTopTmp.value,
					duration: 0
				});
				console.log(1);
			}, 1000);
		});
	}
});

const containerStyle = computed(() => {
	let style = chatroomState.value === 'show' ? { overflow: 'visible' } : { overflow: 'hidden' };
	return style;
});

// const leftContentStyle = computed(() => {
// 	return {
// 		// top: scrollTop.value + 'px'
// 		transform: `translateY(${scrollTop.value}px)`
// 	};
// });

function ontouchstart() {}
</script>

<style lang="scss">
.chat-container {
	width: auto;
	height: auto !important;
	background-color: $ThemeDark4Color;
	@include centering;
	justify-content: flex-start;
	padding-left: calc(100vw - 120rpx + 20rpx);
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
		overflow: visible;
		.serverItem {
			position: relative;
			width: 146rpx;
			height: 126rpx;
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
	}
	// 频道列表
	.channelBox {
		width: calc(100vw - 146rpx - 120rpx);
		height: 100%;
		padding: 30rpx 0;
		padding-top: calc(30rpx + var(--status-bar-height));
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
			.serverTitleBox {
				@include centering;
				width: 100%;
				justify-content: space-between;
				padding: 0 40rpx;
				margin-bottom: 20rpx;
				.serverName {
					font-size: 36rpx;
					font-weight: 600;
				}
				.iconfont {
					font-size: 32rpx;
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
			.channelList {
				background-color: $ThemeDark3Color;
				.channel {
					background-color: $ThemeDark3Color;

					.customTitle {
						width: 100%;
						height: 60rpx;
						background-color: $ThemeDark3Color;
						font-size: 28rpx;
						line-height: 60rpx;
						color: $FontGrey;
						padding: 0 20rpx;
					}
					.uni-icons {
						font-size: 26rpx;
					}
					.channel-content {
						background-color: $ThemeDark3Color;
					}
				}
				.channelItem {
					background-color: $ThemeDark3Color;
					color: $FontGrey;
					height: 80rpx;
					width: 100%;
					line-height: 80rpx;
					font-size: 28rpx;
					padding: 0 20rpx;
					.iconfont {
						font-size: 42rpx;
						margin-right: 20rpx;
					}
					&.active {
						background-color: $ThemeDarkPop;
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
	// 聊天房间
	.roomBox {
		z-index: 100;
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
