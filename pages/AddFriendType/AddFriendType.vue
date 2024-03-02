<template>
	<view class="container">
		<view class="addType">
			<view class="typeItem" v-for="{ icon, text } in addType">
				<i class="iconfont" :class="'icon-addfriend-' + icon"></i>
				<text class="type-text">{{ text }}</text>
			</view>
		</view>
		<view class="byname">
			<input class="name-input" type="text" placeholder="通过用户名添加" />
			<TouchBox class="name-btn" :customStyle="btnStyle" :touchStyle="touchStyle">
				<text>发送请求</text>
			</TouchBox>
		</view>
		<ListBox class="byaddressList">
			<image class="byaddressList-img" src="../../static/bg/addfriend-bg.png" mode="widthFix"></image>
			<text class="text1">发现您的好友</text>
			<text class="text2">同步联系人，找到更多认识的好友~</text>
			<TouchBox class="btnBox" :customStyle="btnStyle" :touchStyle="touchStyle">
				<text class="addFriend-text">发现好友</text>
			</TouchBox>
		</ListBox>
	</view>
</template>

<script setup>
import { onNavigationBarButtonTap } from '@dcloudio/uni-app';
import variable from '@/styles/variable.js';
import ListBox from '@/pages/My/ListBox.vue';

onNavigationBarButtonTap(() => {
	uni.navigateBack();
});

const { BtnPrimaryColor, BtnPrimaryPressColor } = variable;

const addType = [
	{
		icon: 'share',
		text: '分享邀请'
	},
	{
		icon: 'link',
		text: '复制链接'
	},
	{
		icon: 'message',
		text: '消息'
	},
	{
		icon: 'email',
		text: '电子邮件'
	}
];

const btnStyle = {
	backgroundColor: BtnPrimaryColor
};
const touchStyle = {
	backgroundColor: BtnPrimaryPressColor,
	transform: 'scale(.97)'
};
</script>

<style lang="scss">
.container {
	width: 100vw;
	height: 100%;
	padding: 0 30rpx;
	background-color: $ThemeDark3Color;

	// 添加类型
	.addType {
		@include centering;
		padding-top: 30rpx;
		justify-content: flex-start;
		.typeItem {
			@include centering;
			flex-direction: column;
			margin-right: 30rpx;
			.iconfont {
				display: block;
				width: 100rpx;
				height: 100rpx;
				background-color: $ThemeLightColor;
				border-radius: 50%;
				font-size: 46rpx;
				line-height: 100rpx;
				text-align: center;
			}
			.type-text {
				font-size: 24rpx;
				margin: 12rpx 0;
			}
		}
	}

	// 通过用户名添加好友
	.byname {
		position: relative;
		margin: 30rpx 0;
		height: 80rpx;
		.name-input {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 20rpx;
			background-color: $ThemeDark5Color;
			padding-left: 30rpx;
			font-size: 27rpx;
		}
		.name-btn {
			position: absolute;
			right: 0;
			top: 0;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 24rpx;
			padding: 0 20rpx;
			border-top-right-radius: 20rpx;
			border-bottom-right-radius: 20rpx;
			background-color: $ThemePrimaryColor;
		}
	}

	// 通过通讯录添加好友
	.byaddressList {
		@include centering;
		flex-direction: column;
		.byaddressList-img {
			width: 60%;
		}
		.text1 {
			font-size: 36rpx;
			margin: 20rpx;
		}
		.text2 {
			font-size: 26rpx;
		}
		.btnBox {
			width: 100%;
			height: 80rpx;
			line-height: 40rpx;
			border-radius: 40rpx;
			margin-top: 50rpx;
			padding: 20rpx 30rpx;
			text-align: center;
		}
	}
}
</style>
