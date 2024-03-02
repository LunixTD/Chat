<template></template>

<script></script>

<style></style>
<template>
	<view class="room-container">
		<StatusBarBox></StatusBarBox>
		<view class="Header" :class="chatroomState == 'show' ? 'show' : 'hide'">
			<view class="back">
				<i class="iconfont icon-back2" @click="headerBack"></i>
			</view>
		</view>
		<scroll-view class="roomMsgDetail" scroll-y="true">
			<view class="roomInfo">
				<image class="roomAvatar" src="../../static/Index-bg.png" mode="widthFix"></image>
				<text class="text1">欢迎来到 XXXX !</text>
				<text class="text2">这是 XXXX 频道的起点。</text>
			</view>
		</scroll-view>
		<view class="msgInputBox" :class="chatroomState == 'show' ? 'show' : 'hide'">
			<MsgBottomBox></MsgBottomBox>
		</view>
	</view>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import MsgListItem from '../MsgDetail/MsgListItem.vue';
import MsgBottomBox from '../MsgDetail/MsgBottomBox.vue';

// 消息页面动画相关
const store = useStore();
function headerBack() {
	store.dispatch('ui/changeChatroomState', 'hide');
}
const chatroomState = computed(() => {
	return store.state.ui.chatroomState;
});
</script>

<style lang="scss">
.room-container {
	position: relative;
	width: 100vw;
	// height: 100%;
	height: 1000vh;
	background-color: $ThemeDark3Color;
	@include centering;
	flex-direction: column;
	justify-content: space-between;
	// 底部输入框显示隐藏
	& .show {
		transform: translateX(0);
	}
	& .hide {
		transform: translateX(100vw);
	}
	.Header {
		width: 100vw;
		height: 88rpx;
		position: fixed;
		top: var(--status-bar-height);
		left: 0;
		border-bottom: 1px solid rgba(white, 0.05);
		background-color: $ThemeDark3Color;
		transition: all ease 0.3s;
		z-index: 10;

		.back {
			float: left;
		}
		.iconfont {
			color: white;
			font-size: 48rpx;
			width: 88rpx;
			height: 88rpx;
			line-height: 88rpx;
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
		background-color: red;
		transition: all ease 0.3s;
		// 底部输入框显示隐藏
		// &.show {
		// 	transform: translateX(0);
		// }
		// &.hide {
		// 	transform: translateX(100px);
		// }
	}
}
</style>
