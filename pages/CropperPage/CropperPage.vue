<template>
	<view class="container">
		<bt-cropper ref="cropper" :imageSrc="imageSrc"></bt-cropper>
		<button @click="crop" class="btn">裁切</button>
	</view>
</template>

<script setup>
import { ref, toRaw } from 'vue';
import { onNavigationBarButtonTap } from '@dcloudio/uni-app';

onNavigationBarButtonTap(() => {
	uni.navigateBack();
});
const imageSrc = '../../static/avatar/05.jpg';
const cropper = ref(null);

function crop() {
	// 通过组件定义的ref调用cropper方法，返回一个promise对象
	cropper.value.crop().then((res) => {
		console.log(res);
	});
}
</script>

<style lang="scss">
.container {
	height: calc(100vh - 92rpx - 88rpx);
	// height: 100%;
	width: 100vw;
	background-color: $ThemeDark3Color;
	.btn {
		// color: $FontWhite;
		// background-color: $ThemePrimaryColor;
		border-top-right-radius: 10rpx;
		border-top-left-radius: 10rpx;
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
	}
}
/* #ifdef APP */
.container {
	height: calc(100vh - 88rpx);
	// height: 100%;
	width: 100vw;
	background-color: $ThemeDark3Color;
}
/* #endif */
</style>
