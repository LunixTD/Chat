<template>
	<page-meta :page-style="pageStyle"></page-meta>
	<view class="container" :style="containerStyle">
		<ChatRoom v-show="tabPage == 'ChatRoom'"></ChatRoom>
		<Msg v-show="tabPage == 'Msg'"></Msg>
		<Notification v-show="tabPage == 'Notification'"></Notification>
		<My v-show="tabPage == 'My'"></My>
		<TabBar></TabBar>
	</view>
</template>

<script setup>
import MsgDetail from '@/pages/MsgDetail/MsgDetail.vue';
import ChatRoom from '@/pages/ChatRoom/ChatRoom.vue';
import Msg from '@/pages/Msg/Msg.vue';
import Notification from '@/pages/Notification/Notification.vue';
import My from '@/pages/My/My.vue';

import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
import { onPageScroll } from '@dcloudio/uni-app';
const store = useStore();

const tabPage = computed(() => {
	return store.state.ui.currTabPage;
});

// onPageScroll(() => null);
const scrollTopTmp = ref(0);
onPageScroll((e) => {
	// console.log(e.scrollTop);
	// scrollTop.value = e.scrollTop;
	scrollTopTmp.value = e.scrollTop;
});

const chatroomState = computed(() => {
	return store.state.ui.chatroomState;
});
const pageStyle = computed(() => {
	let style = chatroomState.value === 'show' ? 'overflow: visible' : 'overflow: hidden';
	return style;
});
const containerStyle = computed(() => {
	let style = chatroomState.value === 'show' ? { overflow: 'visible' } : { overflow: 'hidden' };
	return style;
});

watch(chatroomState, (val) => {
	if (val == 'hide') {
		// nextTick(() => {
		// 	setTimeout(() => {
		// 		uni.pageScrollTo({
		// 			scrollTop: scrollTopTmp.value,
		// 			duration: 0
		// 		});
		// 		console.log(1);
		// 	}, 1000);
		// });
	}
});
</script>

<style lang="scss">
/* #ifdef H5 */
::-webkit-scrollbar {
	display: none;
}
/* #endif */
.container {
	position: relative;
	width: 100vw;
	// height: auto !important;
	// overflow: hidden;
	background-color: $ThemeDark3Color;
	// z-index: 0;
}
</style>