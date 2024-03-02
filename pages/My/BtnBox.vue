<template>
	<view class="btnBox" :class="touch" @touchstart="touchStart" @touchend="touchEnd">
		<slot></slot>
	</view>
</template>

<script setup>
import { ref } from 'vue';
const touch = ref('');
const timer = ref(null);
const touching = ref(false);
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
}
</script>

<style lang="scss">
.btnBox {
	height: 80rpx;
	line-height: 40rpx;
	border-radius: 40rpx;
	font-size: 26rpx;
	background-color: rgb(56, 58, 67, 1);
	padding: 20rpx 30rpx;
	margin-top: 30rpx;
	text-align: center;
	transition: all ease 0.2s;
	&.touch {
		transform: scale(0.97);
		background-color: rgba(87, 90, 99, 1);
	}
}
</style>
