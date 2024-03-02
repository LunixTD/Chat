<template>
	<view class="listBox" :class="touch" @touchstart="onTouchStart" @touchend="onTouchEnd">
		<slot></slot>
		<i class="iconfont icon-back" v-if="goto"></i>
	</view>
</template>

<script setup>
import { defineProps, ref } from 'vue';
const { goto } = defineProps(['goto']);
const touch = ref('');
const timer = ref(null);
const touching = ref(false);
function onTouchStart() {
	if (goto == undefined) return;
	if (timer.value !== null) {
		return;
	}
	touching.value = true;
	touch.value = 'touch';
	timer.value = setTimeout(() => {
		timer.value = null;
		if (touching.value == false) {
			touch.value = '';
		}
	}, 300);
}
function onTouchEnd() {
	if (goto == undefined) return;
	touching.value = false;
	if (timer.value === null) {
		touch.value = '';
	}
	// uni.navigateTo({
	// 	url: '/pages/SearchFriend/SearchFriend',
	// 	animationType: 'zoom-fade-out'
	// });
}
</script>

<style lang="scss">
.listBox {
	background-color: rgba(38, 39, 47, 1);
	border-radius: 20rpx;
	padding: 30rpx 30rpx;
	margin-bottom: 40rpx;
	border: 1px solid rgba(38, 39, 47, 1);
	@include centering;
	justify-content: space-between;
	transition: background ease 0.3s;

	.iconfont {
		margin-right: -10rpx;
		font-size: 24rpx;
		transform: rotate(180deg);
	}
	// &:hover {
	// 	background-color: rgba(33, 34, 41, 1);
	// }
	// &:blur {
	// 	background-color: rgba(38, 39, 47, 1);
	// }
	&.touch {
		background-color: rgba(33, 34, 41, 1);
	}
}
</style>
