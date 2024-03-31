<template>
	<view class="container">
		<MyPopup ref="pop"></MyPopup>
		<Header :touchStartStyle="customStyle"></Header>
		<HeaderPlaced></HeaderPlaced>
		<view class="title">
			<text class="text">请输入电话号码或电子邮件地址</text>
		</view>
		<view class="regType">
			<text @click="changeType('phone')" class="text" :class="type == 'phone' ? 'active' : ''">电话号码</text>
			<text @click="changeType('email')" class="text" :class="type == 'email' ? 'active' : ''">电子邮件</text>
			<view class="choosedBox" :class="choosedBoxPos"></view>
		</view>
		<view class="userinfo">
			<view class="infoText">
				<text>{{ typeStr }}</text>
				<text class="alert" :class="usernameTip !== '' ? 'show' : 'hide'">{{ usernameTip }}</text>
			</view>
			<MyInput v-model="username" model="username" :placeholder="typeStr" type="text" :inputStyle="inputStyle" :clearIconStyle="clearIconStyle" :onInput="onInput"></MyInput>
		</view>
		<view class="userinfo">
			<view class="infoText">
				<text>密码</text>
				<text class="alert" :class="passwordTip !== '' ? 'show' : 'hide'">{{ passwordTip }}</text>
			</view>
			<MyInput v-model="password" model="password" placeholder="密码" type="password" :inputStyle="inputStyle" :clearIconStyle="clearIconStyle" :onInput="onInput"></MyInput>
		</view>
		<view class="userinfo">
			<view class="infoText">
				<text>确认密码</text>
				<text class="alert" :class="repasswordTip !== '' ? 'show' : 'hide'">{{ repasswordTip }}</text>
			</view>
			<MyInput
				v-model="repassword"
				model="repassword"
				placeholder="确认密码"
				type="password"
				:inputStyle="inputStyle"
				:clearIconStyle="clearIconStyle"
				:onInput="onInput"
			></MyInput>
		</view>
		<view class="btn" @click="register">注册</view>
	</view>
</template>

<script setup>
import { ref, getCurrentInstance, computed } from 'vue';
import { onNavigationBarButtonTap } from '@dcloudio/uni-app';
import varible from '@/styles/variable.js';
import api from '@/services/request.js';

const { ThemeDark2Color, ThemeDark3Color, ThemeDark5Color, ThemeDarkPop, BtnPrimaryColor, BtnPrimaryPressColor } = varible;

const customStyle = computed(() => {
	return {
		backgroundColor: 'transparent'
	};
});

const pop = ref(null);
const instance = getCurrentInstance();

const type = ref('phone');
const typeStr = ref('电话号码');
const choosedBoxPos = ref('left');
function changeType(str) {
	username.value = '';
	type.value = str;
	switch (str) {
		case 'phone': {
			typeStr.value = '电话号码';
			choosedBoxPos.value = 'left';
			return;
		}
		case 'email': {
			typeStr.value = '电子邮件';
			choosedBoxPos.value = 'right';
			return;
		}
	}
}

onNavigationBarButtonTap(() => {
	uni.navigateBack();
});

// 输入框样式
const inputStyle = {
	backgroundColor: ThemeDark2Color,
	borderRadius: '6rpx',
	height: '90rpx',
	fontSize: '26rpx',
	marginTop: '20rpx'
};

const clearIconStyle = {
	width: '90rpx',
	height: '90rpx',
	lineHeight: '90rpx',
	fontSize: '36rpx'
};

const username = ref('');
const password = ref('');
const repassword = ref('');
const usernameTip = ref('');
const passwordTip = ref('');
const repasswordTip = ref('');
const canPass = ref(true);

const emailRegex = /^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/;
const phoneRegex = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

function onInput(model) {
	if (model === 'username') {
		usernameTip.value = '';
	}
	if (model === 'password') {
		passwordTip.value = '';
	}
	if (model === 'repassword') {
		repasswordTip.value = '';
	}
}
async function register() {
	canPass.value = true;
	if (username.value == '') {
		canPass.value = false;
		if (type.value == 'email') {
			usernameTip.value = '请填写邮箱地址！';
		}
		if (type.value == 'phone') {
			usernameTip.value = '请填写手机号码！';
		}
	} else {
		if (type.value == 'email') {
			if (!emailRegex.test(username.value)) {
				usernameTip.value = '邮件地址不合法,请检查填写是否有误！';
				canPass.value = false;
			}
		}
		if (type.value == 'phone') {
			if (!phoneRegex.test(username.value)) {
				usernameTip.value = '手机号码不合法,请检查填写是否有误！';
				canPass.value = false;
			}
		}
	}

	if (password.value == '') {
		canPass.value = false;
		passwordTip.value = '请填写密码！';
	} else {
		if (!pwdRegex.test(password.value)) {
			canPass.value = false;
			passwordTip.value = '8-16位至少包含一个大写字母，一个小写字母，一个数字！';
		}
	}

	if (repassword.value == '') {
		canPass.value = false;
		repasswordTip.value = '请再一次填写密码！';
	} else {
		if (repassword.value !== password.value) {
			canPass.value = false;
			repasswordTip.value = '密码和确认密码不一致！';
		}
	}
	if (canPass.value) {
		if (type.value == 'email') {
			username.value = username.value.toLowerCase();
		}
		const regRes = await api.register({
			type: type.value,
			username: username.value,
			password: password.value
		});

		// console.log(regRes);
		if (regRes.data.code == 200) {
			console.log('全部数据正常可以注册');
			instance.refs.pop.showPop(`注册成功，请在主页面登录账号~`);
			setTimeout(() => {
				uni.navigateBack();
			}, 2000);
		} else {
			instance.refs.pop.showPop(`该${typeStr.value}已被注册！`);
		}
	}
}
</script>

<style lang="scss">
.container {
	font-family: 'Alibaba Health Font 2.0 CN 85 B';
	width: 94vw;
	height: 100vh;
	margin: 0 3vw;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	background-color: $ThemeColor;
}
.title {
	color: white;
	text-align: center;

	.text {
		font-size: 48rpx;
		font-weight: 100;
		letter-spacing: 2rpx;
	}
}
.regType {
	position: relative;
	width: 100%;
	height: 70rpx;
	line-height: 70rpx;
	background-color: $ThemeDark2Color;
	color: $FontGrey;
	font-size: 26rpx;
	border-radius: 6rpx;
	z-index: 10;
	margin: 40rpx 0;

	.text {
		display: inline-block;
		width: 50%;
		text-align: center;
		&.active {
			color: white;
		}
	}
	.choosedBox {
		position: absolute;
		width: calc(50% - 10rpx);
		height: 60rpx;
		top: 5rpx;
		background-color: $ThemeDark1Color;
		border-radius: 6rpx;
		border: none;
		z-index: -1;
		transition: all ease 0.18s;
		&.left {
			left: 5rpx;
		}
		&.right {
			left: calc(50% + 5rpx);
		}
	}
}
.userinfo {
	width: 94vw;
	margin: 0 3vw;
	margin-bottom: 30rpx;
	.infoText {
		@include centering;
		justify-content: space-between;
		.alert {
			color: orangered;
			transition: all ease 0.12s;
			&.show {
				opacity: 1;
			}
			&.hide {
				opacity: 0;
			}
		}
	}

	text {
		color: $FontGrey;
		font-size: 24rpx;
		align-self: flex-start;
	}
	.findpwd {
		color: $FontBlue;
		margin: 10rpx 0;
	}
}
.btn {
	width: 100%;
	height: 84rpx;
	line-height: 84rpx;
	border-radius: 6rpx;
	color: white;
	background-color: $ThemePrimaryColor;
	font-size: 26rpx;
	text-align: center;
	margin: 60rpx 0;
}
</style>
