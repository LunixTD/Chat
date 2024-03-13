<template>
	<view class="touchBox" :style="[touch == '' ? touchStartStyle : touchEndStyle, customStyle]" @touchstart="touchStart" @touchend="touchEnd">
		<slot></slot>
	</view>
</template>

<script setup>
import { defaults } from 'lodash';
import { ref, defineProps } from 'vue';
const touch = ref('');
const timer = ref(null);
const touching = ref(false);
const { customStyle, touchStartStyle, touchEndStyle, goto } = defineProps(['customStyle', 'touchStartStyle', 'touchEndStyle', 'goto']);
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
<script>
export default {
	options: {
		virtualHost: true
	}
};
</script>
<style lang="scss">
.touchBox {
	width: 100%;
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
