<template>
	<view class="container">
		<MyPopup ref="pop"></MyPopup>
		<Header :touchStartStyle="customStyle"></Header>
		<HeaderPlaced></HeaderPlaced>
		<view class="title">
			<text class="text1">欢迎回来</text>
			<text class="text2">很高兴再次见到您!</text>
		</view>
		<view class="userinfo">
			<text class="text">账户信息</text>
			<MyInput placeholder="电子邮箱地址或电话号码" maxlength="256" type="text" v-model="username" :inputStyle="inputStyle"></MyInput>
			<MyInput placeholder="密码" v-model="pwd" maxlength="18" type="password" :inputStyle="inputStyle"></MyInput>
			<text class="text findpwd">忘记密码?</text>
		</view>
		<view class="btn_login" @click="handleLogin">登录</view>
	</view>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick, computed } from 'vue';
import { onNavigationBarButtonTap } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
import varible from '@/styles/variable.js';
import api from '@/services/request.js';
import { asyncUserProfile } from '@/utils/hooks/useAsyncUserProfile.js';

const { ThemeDark1Color, ThemeDark3Color, ThemeDark5Color, ThemeDarkPop, BtnPrimaryColor, BtnPrimaryPressColor } = varible;
const store = useStore();

const customStyle = computed(() => {
	return {
		backgroundColor: 'transparent'
	};
});

const username = ref('');
const pwd = ref('');
const pop = ref(null);
const instance = getCurrentInstance();
async function handleLogin() {
	const emailRegex = /^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/;
	const phoneRegex = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
	let usernameState = false;
	let utype = '';
	let alertMsg = '';
	if (username.value.indexOf('@') > -1) {
		usernameState = emailRegex.test(username.value);
		alertMsg = '邮箱格式错误!';
		utype = 'email';
	} else {
		usernameState = phoneRegex.test(username.value);
		alertMsg = '手机号码错误!';
		utype = 'phone';
	}
	if (!usernameState) {
		showAlert(alertMsg);
	} else {
		// 登录请求
		const loginRes = await api.login({
			[utype]: username.value.toLowerCase(),
			password: pwd.value
		});
		const { profile, code, token } = loginRes.data;

		// console.log(loginRes);
		if (code == 400) {
			showAlert('用户名或密码错误!');
		} else {
			// 登录成功进行初始化操作

			// 检查用户是否有初始化用户名,有则直接进入主界面,没有则去到用户初始化设置页面
			await asyncUserProfile('updateLocal', profile);
			uni.setStorageSync('token', token);
			if (profile.nickname == undefined) {
				// store.dispatch('user/setToken', token);
				// 将token保存到state,初始化配置完成后再将token配置到本地缓存中
				// 用户在配置界面中断后可以通过判断token是否有值来决定重新进入应用后是否再次进入配置页面
				uni.navigateTo({
					url: `/pages/InitUserInfo/InitUserInfo`,
					animationType: 'slide-in-bottom'
				});
			} else {
				uni.navigateTo({
					url: '/pages/Main/Main',
					animationType: 'slide-in-bottom'
				});
			}
		}
	}
}

function showAlert(msg) {
	instance.refs.pop.showPop(msg);
}

onNavigationBarButtonTap(() => {
	uni.navigateBack();
});

// 输入框样式
const inputStyle = {
	backgroundColor: ThemeDark3Color,
	borderRadius: '6rpx',
	height: '90rpx',
	fontSize: '26rpx',
	margin: '20rpx 0'
};

// const clearIconStyle = {
// 	width: '90rpx',
// 	height: '90rpx',
// 	lineHeight: '90rpx',
// 	fontSize: '36rpx'
// };
</script>

<style lang="scss">
.container {
	width: 100vw;
	height: 100vh;
	@include centering;
	flex-direction: column;
	justify-content: flex-start;
	background-color: $ThemeColor;
}
.title {
	color: white;
	text-align: center;
	width: 100vw;
	// overflow: hidden;

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
	}
}
.userinfo {
	width: 94vw;
	margin: 0 3vw;

	.text {
		color: $FontGrey;
		font-size: 24rpx;
		align-self: flex-start;
		margin-bottom: 8rpx;
	}
	.input {
		width: 94vw;
		height: 80rpx;
		color: white;
		background-color: $ThemeDark5Color;
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
	height: 84rpx;
	line-height: 84rpx;
	border-radius: 6rpx;
	color: white;
	background-color: $ThemePrimaryColor;
	font-size: 26rpx;
	text-align: center;
	margin: 30rpx 0;
}
</style>
