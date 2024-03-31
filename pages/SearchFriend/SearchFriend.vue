<template>
	<view class="container">
		<view class="inputBox">
			<input type="text" class="searchInput" placeholder="搜索" />
			<text class="placeholder">收件人:</text>
		</view>
		<view class="searchList">
			<text class="title">服务器成员</text>
			<scroll-view scroll-y="true" class="listBox">
				<TouchBox v-for="i in 2" :touchStartStyle="listItemStyle" :touchEndStyle="listItemPressStyle">
					<view class="listItem" @click="gotoPage">
						<view class="itemLeft">
							<image class="itemAvatar" src="../../static/avatar/03.jpg" mode="widthFix"></image>
						</view>
						<view class="itemRight">
							<text class="itemUname">tudou</text>
						</view>
						<i class="iconfont icon-back"></i>
						<i class="border-line height-1px" v-if="i !== 2"></i>
					</view>
				</TouchBox>
			</scroll-view>
		</view>
		<!-- <view class="no-friendBox">
			<image class="searchFriend-bg" src="../../static/bg/searchFriend.png" mode="widthFix"></image>
			<text class="searchFriend-info">您还未添加任何好友哦~</text>
			<text class="searchFriend-info line">添加好友，开始聊天、玩游戏，共享更多功能！</text>
		</view>
		<TouchBox class="btnBox" :touchStartStyle="btnStyle" :touchEndStyle="touchStyle">
			<text class="addFriend-text">添加好友</text>
		</TouchBox> -->
	</view>
</template>

<script setup>
import { onNavigationBarButtonTap } from '@dcloudio/uni-app';
import varible from '@/styles/variable.js';
onNavigationBarButtonTap(() => {
	uni.navigateBack();
});

const { BtnPrimaryColor, BtnPrimaryPressColor, ThemeDarkPop, ThemeDark3Color } = varible;
const btnStyle = {
	backgroundColor: BtnPrimaryColor
};
const touchStyle = {
	backgroundColor: BtnPrimaryPressColor,
	transform: 'scale(0.97)'
};

const listItemStyle = {
	backgroundColor: ThemeDarkPop
};
const listItemPressStyle = {
	backgroundColor: ThemeDark3Color
};

function gotoPage() {
	uni.navigateTo({
		url: '/pages/MsgDetail/MsgDetail'
	});
}
</script>

<style lang="scss">
.container {
	background-color: $ThemeDark3Color;
	width: 100vw;
	height: 100vh;
	padding: 0 30rpx;
	color: $FontGrey;
	font-size: 27rpx;

	// 搜索框
	.inputBox {
		position: relative;
		width: 100%;
		.placeholder {
			line-height: 80rpx;
			position: absolute;
			left: 30rpx;
			top: 0;
		}
		.searchInput {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 40rpx;
			background-color: $ThemeDark5Color;
			padding-left: 130rpx;
			font-size: 27rpx;
			color: $FontWhite;
		}
	}

	// 搜索结果页面
	.searchList {
		width: 100%;
		height: calc(100% - 88rpx);
		padding-top: 40rpx;

		.title {
			display: block;
			font-size: 28rpx;
			color: $FontWhite;
			margin-bottom: 20rpx;
		}
		.listBox {
			width: 100%;
			// background-color: $ThemeDark1Color;
			border: 1px solid $ThemeDarkPop;
			border-radius: 20rpx;
			overflow: hidden;

			.listItem {
				position: relative;
				width: 100%;
				height: 120rpx;
				@include centering;
				justify-content: flex-start;
				// border-bottom: 1;
				// background-color: $ThemeDarkPop;
				.icon-back {
					margin-right: 30rpx;
					justify-self: flex-start;
					font-size: 24rpx;
					transform: rotate(180deg);
				}

				.itemLeft {
					width: 120rpx;
					height: 120rpx;
					.itemAvatar {
						width: 60rpx;
						height: 60rpx;
						margin-left: 30rpx;
						margin-top: 30rpx;
						border-radius: 50%;
					}
				}
				.itemRight {
					flex: 1;
					color: $FontWhite;
					height: 120rpx;
					line-height: 120rpx;
					font-size: 28rpx;
					font-weight: 600;
					// background-color: red;
				}

				// 分割线
				.border-line {
					display: block;
					position: absolute;
					bottom: 0;
					right: 0;
					width: calc(100% - 100rpx);
					height: 1px;
					background-color: rgba($FontGrey, 0.2);
				}
			}
		}
	}

	// 好友为空时列表界面
	.no-friendBox {
		width: 100%;
		height: calc(100% - 88rpx - 80rpx - 80rpx);
		@include centering;
		flex-direction: column;
		color: $FontWhite;
		.searchFriend-bg {
			width: 80%;
			margin-bottom: 20rpx;
		}
		.searchFriend-info {
			font-size: 28rpx;
			font-weight: 700;
		}
		.line {
			font-size: 24rpx;
			font-weight: 200;
			margin-top: 10rpx;
		}
	}

	// 添加按钮
	.btnBox {
		height: 80rpx;
		line-height: 40rpx;
		border-radius: 40rpx;
		margin-top: 30rpx;
		padding: 20rpx 30rpx;
		text-align: center;
	}
	.addFriend-text {
		color: $FontWhite;
		font-size: 26rpx;
	}
}
</style>
