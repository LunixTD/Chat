<template>
	<MyPopup ref="pop"></MyPopup>
	<view class="container">
		<Header>
			<template #middle>
				<view class="headerMiddle">添加好友</view>
			</template>
		</Header>
		<HeaderPlaced></HeaderPlaced>
		<view class="addType">
			<view class="typeItem" v-for="({ icon, text }, index) in addType" @click="handleShare(icon)" :key="index">
				<i class="iconfont" :class="'icon-addfriend-' + icon"></i>
				<text class="type-text">{{ text }}</text>
			</view>
		</view>
		<view class="byname">
			<input class="name-input" type="text" placeholder="通过用户名添加" />
			<view class="name-btn">
				<view :touchStartStyle="btnStyle" :touchEndStyle="touchStyle">
					<text>发送请求</text>
				</view>
			</view>
		</view>
		<view class="byaddressList">
			<image class="byaddressList-img" src="../../static/bg/addfriend-bg.png" mode="widthFix"></image>
			<text class="text1">发现您的好友</text>
			<text class="text2">同步联系人，找到更多认识的好友~</text>
			<TouchBox :customStyle="customStyle" :touchStartStyle="btnStyle" :touchEndStyle="touchStyle">
				<text class="addFriend-text">发现好友</text>
			</TouchBox>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onNavigationBarButtonTap } from '@dcloudio/uni-app';
import variable from '@/styles/variable.js';

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
const customStyle = {
	width: 'calc(100vw - 120rpx)',
	height: '80rpx',
	lineHeight: '40rpx',
	borderRadius: '40rpx',
	marginTop: '50rpx',
	padding: '20rpx 30rpx',
	textAlign: 'center'
};
const pop = ref(null);

function handleShare(type) {
	switch (type) {
		case 'share':
			plus.share.sendWithSystem(
				{ type: 'text', content: '分享内容', href: 'http://www.lunixtd.cn' },
				function () {
					console.log('分享成功');
				},
				function (e) {
					console.log('分享失败：' + JSON.stringify(e));
				}
			);
			break;
		case 'link':
			pop.value.showPop('已将分享复制到剪贴板');
			break;
	}
}
</script>

<style lang="scss">
.container {
	width: 100vw;
	height: 100%;
	padding: 0 30rpx;
	background-color: $ThemeDark3Color;

	.headerMiddle {
		@include centering;
		height: 100%;
	}

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
		background-color: rgba(38, 39, 47, 1);
		padding: 30rpx 30rpx;
		border-radius: 18rpx;
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
	}
}
</style>
