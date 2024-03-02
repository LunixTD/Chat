<template>
	<view class="container">
		<view class="title">
			<text class="text1">欢迎回来！</text>
			<text class="text2">很高兴再次见到您！</text>
		</view>
		<view class="userinfo">
			<text class="text">账户信息</text>
			<input class="input" type="text" placeholder="电子邮箱地址或电话号码" v-model="username" />
			<input class="input" type="text" password placeholder="密码" v-model="pwd" />
			<text class="text findpwd">忘记密码?</text>
		</view>
		<view class="btn_login" @click="handleLogin">登录</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onNavigationBarButtonTap } from '@dcloudio/uni-app';
const username = ref('');
const pwd = ref('');
function handleLogin() {
	// if (username.value == 'admin' && pwd.value == '123') {
	// 	uni.reLaunch({
	// 		url:'/pages/Msg/Msg',
	// 		animationType:'slide-in-bottom'
	// 	})
	// }
	uni.reLaunch({
		url: '/pages/Main/Main',
		animationType: 'slide-in-bottom'
	});
}

onNavigationBarButtonTap(() => {
	uni.navigateBack();
});
</script>

<style lang="scss">
.container {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}
.title {
	color: white;
	text-align: center;
	overflow: hidden;

	.text1 {
		display: block;
		letter-spacing: 1rpx;
		margin: 10rpx 0;
		font-size: 48rpx;
		font-weight: 300;
		display: block;
	}
	.text2 {
		display: block;
		font-size: 25rpx;
		letter-spacing: 1rpx;
		font-weight: 100;
		color: $FontGrey;
		text-align: center;
		margin-left: -14rpx;
	}
}
.userinfo {
	width: 94vw;
	margin: 0 3vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.text {
		color: $FontGrey;
		font-size: 12px;
		align-self: flex-start;
		margin-bottom: 8rpx;
	}
	.input {
		width: 94vw;
		height: 80rpx;
		color: white;
		background-color: $ThemeDark2Color;
		margin: 8rpx 0;
		border-radius: 3px;
		text-indent: 20rpx;
		font-size: 14px;
		line-height: 14px;
	}
	.findpwd {
		color: $FontBlue;
		margin: 10rpx 0;
	}
}
.btn_login {
	width: 94vw;
	height: 74rpx;
	line-height: 74rpx;
	border-radius: 3px;
	color: white;
	background-color: $ThemePrimaryColor;
	font-size: 13px;
	text-align: center;
	margin: 20rpx 0;
}
</style>
