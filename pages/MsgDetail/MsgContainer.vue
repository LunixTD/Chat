<template>
	<view class="msg-container" @touchstart="msgContainerFocus" :style="{ transition: 'transform ease 0.3s', transform: 'translateY(-' + raiseHeight + 'rpx)' }">
		<!-- <UserInfo></UserInfo> -->
		<!-- <MsgTimeline></MsgTimeline> -->
		<view v-if="msgList.length !== 0" v-for="(item, index) in msgList" :key="item._id" :class="index == msgList.length - 1 && canUsePushAnime ? 'lastItemAnime' : ''">
			<MsgListItem :item="item" :msgStyle="getMsgStyle(index)"></MsgListItem>
		</view>
		<view id="lastBox" :style="lastBoxStyle"></view>
		<view class="marginBox"></view>
	</view>
</template>

<script setup>
import UserInfo from './UserInfo.vue';
import MsgListItem from './MsgListItem.vue';
import { ref, defineProps, reactive, computed, watch, nextTick, toRaw, getCurrentInstance, onMounted } from 'vue';
import { useStore } from 'vuex';
import { onReady, onLoad } from '@dcloudio/uni-app';
import { useSystemInfo } from '@/utils/hooks/useSystemInfo.js';

const { origin } = defineProps(['origin']);
const store = useStore();

const msgList = computed(() => {
	if (origin == 'channel') {
		return store.state.message.channelMsgList;
	}
	if (origin == 'direct') {
		return store.state.message.directMsgList;
	}
});

const canUsePushAnime = computed(() => {
	return store.state.ui.canUsePushAnime;
});

// 输入框高度变化后抬起界面
const raiseHeight = computed(() => {
	const { msgPageRaiseHeight, inputHeight } = store.state.ui;
	return inputHeight + msgPageRaiseHeight - 36;
});

const safeAreaBottom = useSystemInfo('safeAreaInsets').value.bottom;
const lastBoxStyle = computed(() => {
	return {
		height: `${safeAreaBottom + 88}rpx`
	};
});

const instance = getCurrentInstance();
watch(
	msgList,
	() => {
		// nextTick(() => {
		// 	uni.pageScrollTo({
		// 		// 注意，有坑，微信小程序无法根据id定位，必须用数字
		// 		scrollTop: 99999999,
		// 		// selector: '#lastBox',
		// 		duration: 200
		// 	});
		// });
	},
	{ deep: true }
);

// 在每次新页面准备完毕后关闭消息推送动画，防止页面数据初始化时最后一条消息产生动画
onReady(() => {
	store.dispatch('ui/changeCanUsePushAnime', false);
});

function getMsgStyle(msgIndex) {
	// if (typeof msgIndex !== 'number') return;
	if (msgIndex === 0) return 'newMsgWithDateLine';
	// const list = store.state.chat.msgList;
	// const preMsg = toRaw(list[msgIndex - 1]);
	// const currMsg = toRaw(list[msgIndex]);
	const currMsg = msgList.value[msgIndex];
	const preMsg = msgList.value[msgIndex - 1];
	// console.log(toRaw(preMsg));
	const oneDayMs = 1000 * 60 * 60 * 24;
	if (currMsg.createTime - preMsg.createTime >= oneDayMs) {
		return 'newMsgWithDateLine';
	} else {
		if (currMsg.creator._id === preMsg.creator._id) {
			return 'additionMsg';
		} else {
			return 'newMsg';
		}
	}
}

function msgContainerFocus() {
	// 底部输入盒子在失焦后改变状态让其回缩
	store.dispatch('ui/changeShowContentBox', false);
}
</script>

<style lang="scss">
.msg-container {
	flex: 1;
	// box-sizing: border-box;
	width: 100vw;
	min-height: calc(100vh - 88rpx);
	// padding-bottom: 88rpx;
	// padding-top: 88rpx;
	// padding: 0 20rpx;
	// height: 100vh;
	background-color: $ThemeDark3Color;
	// background-color: red;
	font-size: 32rpx;
	z-index: 9;

	.lastItemAnime {
		animation: lastItemAnim forwards ease 0.3s;
	}
	@keyframes lastItemAnim {
		0% {
			opacity: 0;
			transform: translateY(20rpx) scale(0.9);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
}
#lastBox {
	width: 100vw;
	height: 88rpx;
	// height: 100rpx;
	// background-color: red;
}
.marginBox {
	margin-top: auto;
	height: 36rpx;
	/* #ifdef MP-WEIXIN */
	// height: 96rpx;
	/* #endif */
}
</style>
