<template>
	<view class="room-container">
		<view class="header" :style="headerStyle" :class="chatroomState == 'show' ? 'show' : 'hide'">
			<view class="headerBox">
				<view class="back">
					<i class="iconfont icon-back2" @click="headerBack"></i>
				</view>
				{{ currChannel.channelName ? currChannel.channelName : '' }}
			</view>
		</view>
		<!-- <HeaderPlaced></HeaderPlaced> -->
		<!-- <scroll-view class="roomMsgDetail" scroll-y="true">
			<view class="roomInfo">
				<image class="roomAvatar" src="../../static/Index-bg.png" mode="widthFix"></image>
				<text class="text1">欢迎来到 XXXX !</text>
				<text class="text2">这是 XXXX 频道的起点。</text>
			</view>
		</scroll-view> -->
		<view class="msgContainerBox" :class="chatroomState == 'show' ? 'show' : 'hide'">
			<MsgContainer origin="channel"></MsgContainer>
		</view>
		<view class="msgInputBox" :class="chatroomState == 'show' ? 'show' : 'hide'">
			<!-- origin为底部输入框的归属位置，当前服务于频道页面 -->
			<MsgBottomBox origin="channel" v-if="chatroomState == 'show' ? true : false"></MsgBottomBox>
		</view>
	</view>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { useStore } from 'vuex';
import MsgListItem from '@/pages/MsgDetail/MsgListItem.vue';
import MsgBottomBox from '@/pages/MsgDetail/MsgBottomBox.vue';
import MsgContainer from '@/pages/MsgDetail/MsgContainer.vue';
import { useStatusBarHeightStyle } from '@/utils/hooks/useStatusBarHeightStyle.js';

const headerStyle = useStatusBarHeightStyle(88);

// 消息页面动画相关
const store = useStore();
// const { scrollTop } = defineProps(['scrollTop']);

const chatroomState = computed(() => {
	return store.state.ui.chatroomState;
});
const currChannel = computed(() => {
	return store.state.chat.currChannel;
});

function headerBack() {
	store.dispatch('ui/changeChatroomState', 'hide');
}
</script>

<style lang="scss">
.room-container {
	position: relative;
	width: 100vw;
	height: 100vh;
	@include centering;
	flex-direction: column;
	justify-content: space-between;
	background-color: $ThemeDark3Color;
	transition: all ease 0.3s;

	&.show {
		transform: translateX(calc(120rpx - 20rpx - 100vw));
	}
	&.hide {
		transform: translateX(0);
	}
	// overflow: hidden;

	// &.show {
	// 	transform: translateX(0);
	// }
	// &.hide {
	// 	transform: translateX(calc(100vw - 120rpx + 20rpx));
	// }
	// 底部输入框显示隐藏
	// & .show {
	// 	transform: translateX(0);
	// }
	// & .hide {
	// 	transform: translateX(100vw);
	// }

	.msgContainerBox {
		transition: all ease 0.3s;
		z-index: 100;
		// background-color: red;
		&.show {
			transform: translateX(calc(120rpx - 20rpx - 100vw));
		}
		&.hide {
			transform: translateX(0);
		}
	}
	.header {
		width: 100vw;
		height: calc(88rpx + var(--status-bar-height));
		// line-height: calc(88rpx + var(--status-bar-height));
		position: fixed;
		top: 0;
		left: 0;
		border-bottom: 1px solid rgba(white, 0.05);
		background-color: $ThemeDark3Color;
		transition: all ease 0.3s;
		text-align: center;
		font-size: 34rpx;
		z-index: 101;
		&.show {
			transform: translateX(0);
		}
		&.hide {
			transform: translateX(calc(100vw - 120rpx + 20rpx));
		}

		.headerBox {
			position: relative;
			width: 100%;
			height: 100%;
			// background-color: red;
			@include centering;
			justify-content: center;
			.back {
				// float: left;
				position: absolute;
				top: 0;
				left: 0;
			}
			.iconfont {
				color: white;
				font-size: 48rpx;
				width: 88rpx;
				height: 88rpx;
				line-height: 88rpx;
			}
		}
	}

	.roomMsgDetail {
		flex: 1;
		width: 100%;
		height: calc(100vh - 88rpx - $TabbarHeight);
		.roomInfo {
			padding: 30rpx;
			padding-top: 200rpx;
			// padding-top: calc(100vh - 88rpx - $TabbarHeight - 56rpx - 26rpx - 140rpx - 32rpx - 60rpx - 80rpx);
			.roomAvatar {
				width: 140rpx;
				height: 140rpx;
				border-radius: 70rpx;
			}
			.text1 {
				display: block;
				font-size: 56rpx;
				line-height: 56rpx;
				margin: 16rpx 0;
			}
			.text2 {
				display: block;
				font-size: 26rpx;
				line-height: 26rpx;
				color: $FontGrey;
			}
		}
	}

	.msgInputBox {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100vw;
		height: 88rpx;
		// background-color: red;
		transition: all ease 0.3s;
		z-index: 101;
		// 底部输入框显示隐藏
		&.show {
			transform: translateX(0);
		}
		&.hide {
			transform: translateX(calc(100vw - 120rpx + 20rpx));
		}
	}
}
</style>
