<template>
	<view class="collapseBox">
		<TouchBox :touchStartStyle="customStyle" :touchEndStyle="touchStyle">
			<view class="title" @click="toggleCollapse">
				<slot name="title"></slot>
				<i class="iconfont icon-back" :class="showCollapse ? 'open' : 'close'"></i>
			</view>
		</TouchBox>

		<view class="collapseContent">
			<slot name="content" :showCollapse="showCollapse"></slot>
		</view>
	</view>
</template>

<script setup>
import { computed, defineProps, ref, onUpdated } from 'vue';
import { asyncUserProfile } from '@/utils/hooks/useAsyncUserProfile.js';
import { useStore } from 'vuex';
import { throttle } from 'lodash';

const { initState, sortId } = defineProps(['initState', 'sortId']);
const store = useStore();
const showCollapse = ref(initState);
const serverList = computed(() => {
	return store.state.chat.serverList;
});
const currServer = computed(() => {
	return store.state.chat.currServer;
});
const channelTypeStateChangeCounter = computed(() => {
	return store.state.ui.channelTypeStateChangeCounter;
});

const customStyle = {
	backgroundColor: 'rgb(28,29,35)'
};
const touchStyle = {
	transform: 'scale(0.97)',
	backgroundColor: 'rgba(28,29,35, 1)'
};

function toggleCollapse() {
	showCollapse.value = !showCollapse.value;
	updateActiveInfo();
}

// 整理本地的sort项活动记录
const updateActiveInfo = throttle(() => {
	// store.commit('ui/runTypeChangeCounter');
	let profile = uni.getStorageSync('profile');

	// if ((channelTypeStateChangeCounter.value / 10) % 1 == 0) {
	// 	profile.activeInfo[currServer.value._id][sortId] = showCollapse.value;
	// 	asyncUserProfile('updateProfile', {
	// 		activeInfo: profile.activeInfo
	// 	});
	// } else {
	// 	profile.activeInfo[sortId] = showCollapse.value;
	// 	asyncUserProfile('updateLocal', {
	// 		activeInfo: profile.activeInfo
	// 	});
	// }
	profile.activeInfo[currServer.value._id][sortId] = showCollapse.value;
	asyncUserProfile('updateProfile', {
		activeInfo: profile.activeInfo
	});
}, 1000);
</script>

<style lang="scss">
.collapseBox {
	position: relative;
	width: 100%;
	color: $FontGrey;
	.title {
		padding: 0 30rpx;
		line-height: 40rpx;
		@include centering;
		.iconfont {
			font-size: 24rpx;
			transform: rotate(180deg);
			transition: transform ease 0.3s;
			&.open {
				transform: rotate(270deg);
			}
			&.close {
				transform: rotate(180deg);
			}
		}
	}
}
</style>
