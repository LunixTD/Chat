<template>
	<view class="msgDetail-container" ref="msgPage">
		<Header class="header" backto="Msg">
			<template #left>
				<view class="content-left">
					<view class="avatarBox flex">
						<image src="../../static/avatar/1.jpg" mode="widthFix" class="avatar"></image>
						<text class="nickname">tudou</text>
					</view>
				</view>
			</template>
			<template #right>
				<view class="content-right">
					<view class="rightBox flex">
						<view class="btnBox"><i class="iconfont icon-dianhua"></i></view>
						<view class="btnBox"><i class="iconfont icon-shipin"></i></view>
					</view>
				</view>
			</template>
		</Header>
		<HeaderBox></HeaderBox>
		<!-- <view class="msg-container" @touchstart="msgContainerFocus" :style="{ transition: 'transform ease 0.3s', transform: 'translateY(-' + raiseHeight + 'rpx)' }">
			<UserInfo></UserInfo>
			<MsgListItem
				v-for="(item, index) in msgList"
				:class="index == msgList.length - 1 && canUsePushAnime ? 'lastItemAnime' : ''"
				:key="index"
				:item="item"
				:msgStyle="getMsgStyle(index)"
			></MsgListItem>
			<view id="lastBox"></view>
			<view class="marginBox"></view>
		</view> -->
		<MsgContainer></MsgContainer>
		<!-- <scroll-view scroll-y="true" class="msg-container">
			<UserInfo></UserInfo>
			<MsgTimeline></MsgTimeline>
			<MsgListItem v-for="item in msgList" :key="item" :item="item"></MsgListItem>
		</scroll-view> -->

		<MsgBottomBox :text="text" @updateText="updateText"></MsgBottomBox>
	</view>
</template>

<script setup>
import MsgBottomBox from './MsgBottomBox.vue';
import MsgContainer from './MsgContainer.vue';
import { ref } from 'vue';

// 接收emit自定义事件
const text = ref('');
function updateText(val) {
	text.value = val;
}

// const msgPage = ref(null);
// const { msgList } = store.state.chat.msgList;
// const msgList = computed(() => {
// 	return store.state.chat.msgList;
// });
// const canUsePushAnime = computed(() => {
// 	return store.state.ui.canUsePushAnime;
// });
</script>

<style lang="scss">
.emoji {
	width: 50rpx;
	height: 50rpx;
}
.msgDetail-container {
	position: relative;
	width: 100vw;
	height: auto !important;
	// overflow: hidden;
	@include centering;
	flex-direction: column;
	background-color: $ThemeDark3Color;
	// padding-bottom: 90rpx;
}
.flex {
	height: 100%;
	@include centering;
	justify-content: space-between;
}

.btnBox {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background-color: $ThemeDark1Color;
	@include centering;

	& .iconfont {
		transition: all ease 0.3s;
	}

	& .hide {
		opacity: 0;
		// display: none;
	}
	& .show {
		opacity: 1;
		// display: block;
	}
}

.iconfont {
	color: $IconWhite;
	text-align: center;
}

.header {
	background-color: $ThemeDark3Color;
	z-index: 99;

	.content-left {
		height: 100%;

		.avatarBox {
			.avatar {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			.nickname {
				color: $FontWhite;
				font-size: 32rpx;
			}
		}
	}
	.content-right {
		height: 100%;
		margin-left: auto;

		.btnBox {
			margin-right: 20rpx;
		}
	}
}
</style>
