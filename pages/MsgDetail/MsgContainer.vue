<template>
	<view class="scrollContainer" @touchstart="msgContainerFocus" :style="{ transition: 'transform ease 0.3s', transform: 'translateY(-' + raiseHeight + 'rpx)' }">
		<z-paging
			ref="paging"
			v-model="dataList"
			use-chat-record-mode
			use-virtual-list
			use-compatibility-mode
			:auto-adjust-position-when-chat="false"
			cell-height-mode="dynamic"
			safe-area-inset-bottom
			bottom-bg-color="#f8f8f8"
			:refresher-end-bounce-enabled="false"
			@loadingStatusChange="loadingStatusChange"
			@query="getHistoryMsg"
		>
			<!-- <template #empty>
				<view></view>
			</template> -->
			<!-- 顶部提示文字 -->
			<template #top>
				<view class="headerBox" :style="headerStyle"></view>
			</template>

			<view class="marginBox"></view>
			<view id="lastBox" :style="lastBoxStyle"></view>
			<!-- 底部聊天输入框 -->
			<template #bottom>
				<view class="bottomBox" :style="lastBoxStyle"></view>
			</template>
		</z-paging>
	</view>
</template>

<script setup>
// import UserInfo from './UserInfo.vue';
import MsgListItem from './MsgListItem.vue';
import { ref, defineProps, reactive, computed, watch, nextTick, toRaw, getCurrentInstance, onBeforeMount, onMounted } from 'vue';
import { useStore } from 'vuex';
import { onReady, onLoad } from '@dcloudio/uni-app';
import { useSystemInfo } from '@/utils/hooks/useSystemInfo.js';
import { debounce, throttle } from 'lodash';
import { useStatusBarHeightStyle } from '@/utils/hooks/useStatusBarHeightStyle.js';
import api from '@/services/request.js';
import MsgBottomBox from '@/pages/MsgDetail/MsgBottomBox.vue';

const { origin, sendToId } = defineProps(['origin', 'sendToId']);
const store = useStore();
const dataList = ref([]);
const currChannel = computed(() => {
	return store.state.chat.currChannel;
});
const headerStyle = useStatusBarHeightStyle(88);
const canUsePushAnime = computed(() => {
	return store.state.ui.canUsePushAnime;
});

// 输入框高度变化后抬起界面
const raiseHeight = computed(() => {
	const { msgPageRaiseHeight, raiseForInputHeight } = store.state.ui;
	return raiseForInputHeight + msgPageRaiseHeight;
});

const scrollTop = computed(() => {
	return store.state.ui.scrollTop;
});
const scrollIntoView = ref('');
const canloadHistory = computed(() => {
	return store.state.message.canloadHistory;
});

const safeAreaBottom = useSystemInfo('safeAreaInsets').value.bottom;
const lastBoxStyle = computed(() => {
	return {
		height: `${safeAreaBottom + 88}rpx`
	};
});

const instance = getCurrentInstance();
uni.$on('updateVirtualListHeight', (index) => {
	// console.log(index);
	instance.refs.paging.didUpdateVirtualListCell(index);
});
uni.$on('reloadData', () => {
	// dataList.value = [];
	console.log('reload');
	instance.refs.paging.reload(true);
});

// 在每次新页面准备完毕后关闭消息推送动画，防止页面数据初始化时最后一条消息产生动画
onReady(() => {
	store.dispatch('ui/changeCanUsePushAnime', false);
});

onMounted(() => {
	if (origin == 'channel') {
		store.commit('ui/setzPagingRef', instance.refs.paging);
	} else {
		store.commit('ui/setDetailPagingRef', instance.refs.paging);
	}
});

function getMsgStyle(msgIndex) {
	// if (typeof msgIndex !== 'number') return;
	if (msgIndex === 0) return 'newMsgWithDateLine';
	return 'newMsg';
}

function msgContainerFocus() {
	// 底部输入盒子在失焦后改变状态让其回缩
	store.dispatch('ui/changeShowContentBox', false);
}

// zPaging的引用
const firstView = ref(false);
const paging = ref(null);
const screenHeight = useSystemInfo('screenHeight');
const pageNum = ref(0);

// 向上获取历史消息
function getHistoryMsg(pageNo, pageSize) {
	// console.log(pageNo, pageSize);
	pageNum.value = pageNum.value++;
	const profile = uni.getStorageSync('profile');
	let tmpObj = {};
	if (dataList.value.length != 0 && pageNo !== 1) {
		tmpObj.fromId = dataList.value.slice(-1)[0]._id;
		// console.log(tmpObj.fromId, pageNo);
	}
	const num = 10;
	let tmpId = sendToId ? sendToId : profile.activeChannel;
	api.getMsgList({
		origin: origin,
		id: tmpId,
		...tmpObj,
		num: num
	}).then((msgListRes) => {
		const dataArr = msgListRes.data;
		const lastMsg = dataList.value.length != 0 ? dataList.value[dataList.value.length - 1] : null;
		const oneDayMs = 1000 * 60 * 60 * 24;
		const newDataArr = dataArr.map((item, index) => {
			if (index == 0 && lastMsg !== null) {
				if (lastMsg.createTime - item.createTime >= oneDayMs) {
					item.showDateLine = true;
				}
			} else if (index !== 0) {
				const preMsg = dataArr[index - 1];
				if (preMsg.createTime - item.createTime >= oneDayMs) {
					item.showDateLine = true;
				}
			} else {
				item.showDateLine = false;
			}
			return item;
		});
		store.dispatch('message/updateChannelMsgList', newDataArr);
		// console.log(newDataArr);
		instance.refs.paging.complete(newDataArr);
		// if (newDataArr.length == 0 || newDataArr.length < num) {
		// 	firstView.value = true;
		// }
	});
}

function loadingStatusChange() {
	firstView.value = true;
}
</script>

<style lang="scss">
.header {
	background-color: red;
	font-size: 24rpx;
	text-align: center;
	padding: 20rpx 0rpx;
	color: white;
}
.listItem {
	transform: scaleY(-1);
}
.scrollContainer {
	width: 100vw;
	// transform: scaleY(-1);
	// transform: translateY(-400rpx);
	height: 100vh;
	background-color: $ThemeDark3Color;
	// padding-top: 100rpx;
	.userInfo {
		transform: scaleY(-1);
	}
	.headerBox {
		position: relative;
		width: 100%;
		font-size: 32rpx;
		// height: 88rpx;
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
	.bottomBox {
		background-color: $ThemeDark3Color;
	}
}
.msg-container {
	flex: 1;
	// box-sizing: border-box;
	width: 100vw;
	height: calc(100vh - 88rpx);
	// padding-bottom: 88rpx;
	// padding-top: 88rpx;
	// padding: 0 20rpx;
	// height: 100vh;
	background-color: $ThemeDark3Color;
	// background-color: red;
	font-size: 32rpx;
	z-index: 9;

	.listItem {
		transform: scaleY(-1);
	}

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