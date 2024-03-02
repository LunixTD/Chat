<template>
	<view class="touchBox" :style="touch == '' ? customStyle : touchStyle" @touchstart="touchStart" @touchend="touchEnd">
		<slot></slot>
	</view>
</template>

<script setup>
import { ref, defineProps } from 'vue';
const touch = ref('');
const timer = ref(null);
const touching = ref(false);
const { customStyle, touchStyle, goto } = defineProps(['customStyle', 'touchStyle', 'goto']);
function touchStart() {
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
function touchEnd() {
	touching.value = false;
	if (timer.value === null) {
		touch.value = '';
	}
	if (goto !== undefined) {
		// uni.navigateTo({
		// 	url: '/pages/SearchFriend/SearchFriend',
		// 	animationType: 'zoom-fade-out'
		// });
	}
}
</script>
<style lang="scss">
.touchBox {
	// height: 80rpx;
	// line-height: 40rpx;
	// border-radius: 40rpx;
	font-size: 26rpx;
	// background-color: rgb(56, 58, 67, 1);
	// padding: 20rpx 30rpx;
	// text-align: center;
	transition: all ease 0.2s;
	overflow: hidden;
}
</style>
