<template>
	<view class="container">
		<view class="title">
			<text class="text">请输入电话号码或电子邮件地址</text>
		</view>
		<view class="regType">
			<text @click="changeType('phone')" class="text" :class="type == 'phone' ? 'active' : ''">电话号码</text>
			<text @click="changeType('email')" class="text" :class="type == 'email' ? 'active' : ''">电子邮件</text>
			<view class="choosedBox" :class="choosedBoxPos"></view>
		</view>
		<view class="userinfo">
			<text>{{ typeStr }}</text>
			<input class="input" type="text" :placeholder="typeStr" />
		</view>
		<view class="btn">下一步</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onNavigationBarButtonTap } from '@dcloudio/uni-app';
const type = ref('phone');
const typeStr = ref('电话号码');
const choosedBoxPos = ref('left');
function changeType(str) {
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
</script>

<style lang="scss">
.container {
	width: 94vw;
	margin: 0 3vw;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}
.title {
	color: white;
	text-align: center;
	overflow: hidden;

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
	font-size: 13px;
	border-radius: 3px;
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
		border-radius: 3px;
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
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	text {
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
.btn {
	width: 100%;
	height: 74rpx;
	line-height: 74rpx;
	border-radius: 3px;
	color: white;
	background-color: $ThemePrimaryColor;
	font-size: 13px;
	text-align: center;
	margin: 30rpx 0;
}
</style>
