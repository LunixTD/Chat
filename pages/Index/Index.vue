<template>
	<view class="container font-alimama">
		<!-- <StatusBarBox></StatusBarBox> -->
		<view class="title">
			<text class="text">Mew</text>
		</view>
		<view class="bg">
			<image class="bgImg" src="../../static/Index-bg.png" mode="widthFix"></image>
		</view>
		<view class="info">
			<text class="text1">欢迎来到 Mew</text>
			<text class="text2">加入Mew社区, 与社区和好友畅聊~</text>
		</view>
		<view class="btn_box">
			<view class="btn_login btn" @click="toRegisterPage">注册</view>
			<view class="btn_register btn" @click="toLoginPage">登录</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
const store = useStore();
onLoad(() => {
	// uni.clearStorage();
	const token = uni.getStorageSync('token');
	const profile = uni.getStorageSync('profile');

	if (token) {
		if (profile.nickname == undefined) {
			uni.navigateTo({
				url: `/pages/InitUserInfo/InitUserInfo`,
				animationType: 'slide-in-bottom'
			});
			console.log('昵称没有初始化，跳转到初始化页面');
		} else {
			uni.reLaunch({
				url: '/pages/Main/Main'
			});
			console.log('存在token，直接跳转主页面');
		}
	} else {
		console.log('本地缓存无token，重新登录');
	}
});

function toLoginPage() {
	uni.navigateTo({
		url: '/pages/Login/Login',
		animationType: 'pop-in',
		animationDuration: 240
	});
}
function toRegisterPage() {
	uni.navigateTo({
		url: '/pages/Register/Register',
		animationType: 'pop-in',
		animationDuration: 240
	});
}
</script>

<style lang="scss">
/* #ifdef H5 */
::-webkit-scrollbar {
	display: none;
}
/* #endif */
.container {
	width: 100vw;
	height: 100vh;
	padding-top: 44rpx;
	@include centering;
	flex-direction: column;
	justify-content: space-evenly;
	background-color: $ThemeColor;
}
.title {
	.text {
		font-size: 70rpx;
		color: white;
		font-weight: 700;
		text-align: center;
		color: white;
		letter-spacing: 10rpx;
	}
}
.bg {
	.bgImg {
		width: 80vw;
	}
}
.info {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: white;

	.text1 {
		color: $FontWhite;
		font-size: 50rpx;
		font-weight: 700;
	}
	.text2 {
		font-size: 26rpx;
		font-weight: 100;
		color: $FontGrey;
		margin: 10rpx 0;
	}
}
.btn_box {
	font-size: 26rpx;
	color: white;
	text-align: center;

	.btn {
		width: 90vw;
		height: 72rpx;
		line-height: 72rpx;
		border-radius: 4rpx;
	}

	.btn_login {
		background-color: $ThemePrimaryColor;
		margin-bottom: 20rpx;
	}
	.btn_register {
		background-color: $ThemeLightColor;
		margin-bottom: 20rpx;
	}
}
</style>
