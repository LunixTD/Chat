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
const { initState, sortId } = defineProps(['initState', 'sortId']);
import { useStore } from 'vuex';
const store = useStore();
const showCollapse = ref(initState);
const serverList = computed(() => {
	return store.state.chat.serverList;
});
const currServer = computed(() => {
	return store.state.chat.currServer;
});

const customStyle = {
	// backgroundColor: 'rgb(56, 58, 67, 1)'
};
const touchStyle = {
	transform: 'scale(0.97)'
	// backgroundColor: 'rgba(87, 90, 99, 1)'
};

function toggleCollapse() {
	showCollapse.value = !showCollapse.value;
	updateActiveInfo();
}

// 整理本地的sort项活动记录
function updateActiveInfo() {
	store.commit('ui/runTypeChangeCounter');
	let profile = uni.getStorageSync('profile');
	// if (profile.activeInfo == undefined) {
	// 	let activeInfo = {};
	// 	serverList.value.forEach((server) => {
	// 		server.channelSortList.forEach((sortItem) => {
	// 			if (sortItem._id == sortId) {
	// 				activeInfo[sortItem._id] = showCollapse.value;
	// 			} else {
	// 				activeInfo[sortItem._id] = true;
	// 			}
	// 		});
	// 	});
	// 	profile.activeInfo = activeInfo;
	// } else {
	// 	profile.activeInfo[sortId] = showCollapse.value;
	// }

	profile.activeInfo[currServer.value._id][sortId] = showCollapse.value;
	uni.setStorageSync('profile', profile);
	store.dispatch('user/changeProfile', profile);
}
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
