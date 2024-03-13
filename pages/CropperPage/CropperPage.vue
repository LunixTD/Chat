<template>
	<view class="container">
		<!-- <bt-cropper ref="cropper" :imageSrc="imageSrc"></bt-cropper>
		<view class="bottomBox">
			<TouchBox class="btnBox" @click="crop" :touchStartStyle="btnStyle" :touchEndStyle="touchStyle">
				<text class="addFriend-text">裁剪</text>
			</TouchBox>
		</view> -->
		<button @click="select">选择图片</button>
		<image mode="widthFix" :src="path" />
		<ksp-cropper mode="free" :width="200" :height="200" :maxWidth="1024" :maxHeight="1024" :url="url" @cancel="oncancel" @ok="onok"></ksp-cropper>
	</view>
</template>

<script setup>
import { ref, toRaw } from 'vue';
import { onNavigationBarButtonTap } from '@dcloudio/uni-app';
import varible from '@/styles/variable.js';
const { BtnPrimaryColor, BtnPrimaryPressColor } = varible;

onNavigationBarButtonTap(() => {
	uni.navigateBack();
});
const imageSrc = '../../static/avatar/05.jpg';
const cropper = ref(null);

const btnStyle = {
	backgroundColor: BtnPrimaryColor
};
const touchStyle = {
	backgroundColor: BtnPrimaryPressColor,
	transform: 'scale(.97)'
};

function crop() {
	// 通过组件定义的ref调用cropper方法，返回一个promise对象
	cropper.value.crop().then((res) => {
		console.log(res);
	});
}

const url = ref('');
const path = ref('');
function onok(ev) {
	url.value = '';
	path.value = ev.path;
	console.log(path.value);
}
function oncancel() {
	url.value = '';
}
function select() {
	uni.chooseImage({
		count: 1,
		success: (rst) => {
			// 设置url的值，显示控件
			url.value = rst.tempFilePaths[0];
		}
	});
}
</script>

<style lang="scss">
page {
	overflow: hidden;
}
.container {
	height: calc(100vh - 90rpx - 388rpx);
	// height: 100%;
	width: 100vw;
	background-color: rgba($ThemeDark1Color, 0.01);
	.btn {
		// color: $FontWhite;
		// background-color: $ThemePrimaryColor;
		border-top-right-radius: 10rpx;
		border-top-left-radius: 10rpx;
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
	}
}
.bottomBox {
	width: 100vw;
	height: 500rpx;
	// 18191c
	background-color: #18191c;
}
.btnBox {
	position: absolute;
	bottom: 100rpx;
	left: 30rpx;
	width: calc(100vw - 60rpx);
	height: 80rpx;
	line-height: 40rpx;
	border-radius: 40rpx;
	padding: 20rpx 30rpx;
	text-align: center;
	font-size: 28rpx;
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
