<template>
	<scroll-view scroll-y="true" class="my-container">
		<!-- <StatusBarBox></StatusBarBox> -->
		<view class="my-bg">
			<view class="cfgBtn">
				<i class="iconfont icon-shezhi"></i>
			</view>
			<view class="bg">
				<!-- <image src="" mode=""></image> -->
			</view>
			<view class="avatarBox">
				<image class="my-avatar" src="../../static/avatar/05.jpg" mode="widthFix"></image>
				<view class="iconBox">
					<i class="iconfont" :class="'icon-ustate-' + uState"></i>
				</view>
			</view>
		</view>
		<view class="my-box">
			<ListBox>
				<view class="my-curr-state">
					<view class="nickname">
						<text class="nickname">tudou</text>
						<i class="iconfont icon-back"></i>
					</view>
					<view class="curr-state">
						<text class="state-text">目前状态</text>
					</view>
					<view class="curr-state-setter">
						<TouchBox class="btnBox" :customStyle="btnStyle" :touchStyle="btnPressStyle">
							<i class="iconfont icon-zhuangtai"></i>
							<text>添加状态</text>
						</TouchBox>
						<TouchBox class="btnBox" :customStyle="btnStyle" :touchStyle="btnPressStyle" @click="gotoPage('Profile')">
							<i class="iconfont icon-bianji"></i>
							<text>编辑个人资料</text>
						</TouchBox>
					</view>
				</view>
			</ListBox>
			<ListBox>
				<view class="profileBox">
					<view class="profile-info">
						<view class="info-left">
							<text class="info">添加个人简介</text>
							<text class="info">你喜欢什么?游戏、音乐、电视剧还是电影?向大家介绍一下自己吧!</text>
						</view>
						<view class="info-right">
							<image class="none-img" src="../../static/bg/profile-img.png" mode="widthFix"></image>
						</view>
					</view>
					<TouchBox class="btnBox" :customStyle="btnStyle" :touchStyle="btnPressStyle"><text>开始</text></TouchBox>
				</view>
			</ListBox>
			<ListBox>
				<view class="create-date">
					<text class="info">成员注册时间</text>
					<text class="date">2018年6月13号</text>
				</view>
			</ListBox>
			<ListBox goto="SearchFriend" @click="gotoPage('SearchFriend')">
				<view class="my-friends">
					<text>您的好友</text>
				</view>
			</ListBox>
		</view>
		<TabBarPlaced></TabBarPlaced>
	</scroll-view>
</template>

<script setup>
import { ref } from 'vue';
import BtnBox from './BtnBox.vue';
import ListBox from './ListBox.vue';
const uState = ref('stealth');

const btnStyle = {
	backgroundColor: 'rgb(56, 58, 67, 1)'
};
const btnPressStyle = {
	transform: 'scale(0.97)',
	backgroundColor: 'rgba(87, 90, 99, 1)'
};

function gotoPage(page) {
	uni.navigateTo({
		url: `/pages/${page}/${page}`,
		animationType: 'pop-in'
	});
}
</script>

<style lang="scss">
.my-container {
	width: 100vw;
	height: 100vh;
	background-color: $ThemeDark3Color;

	.my-bg {
		position: relative;
		width: 100vw;
		height: 400rpx;
		// background-color: lightblue;

		.cfgBtn {
			position: absolute;
			right: 30rpx;
			top: calc(var(--status-bar-height) + 10rpx);
			width: 70rpx;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
			border-radius: 50%;
			background-color: rgba(0, 0, 0, 0.7);
			.iconfont {
				display: block;
				font-size: 38rpx;
			}
		}

		.bg {
			width: 100%;
			height: 300rpx;
			background-color: lightcoral;
		}
		.avatarBox {
			position: absolute;
			left: 30rpx;
			bottom: 0;
			width: 180rpx;
			height: 180rpx;
			border: 12rpx solid $ThemeDark3Color;
			border-radius: 50%;

			.my-avatar {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}

			.iconBox {
				position: absolute;
				bottom: 0;
				right: 0;
				width: 40rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				vertical-align: middle;
				border-radius: 50%;
				background-color: $ThemeDark3Color;
				.iconfont {
					display: block;
					width: 100%;
					height: 100%;
					font-size: 30rpx;
					&.icon-ustate-stealth {
						color: #7d73e3;
					}
					&.icon-ustate-busy {
						color: rgba(241, 63, 67, 1);
					}
					&.icon-ustate-idle {
						color: rgba(240, 178, 50, 1);
					}
					&.icon-ustate-online {
						color: rgba(35, 164, 89, 1);
					}
				}
			}
		}
	}

	.my-box {
		padding: 30rpx 30rpx;
		padding-bottom: 0;
		font-size: 24rpx;
		.btnBox {
			height: 80rpx;
			line-height: 40rpx;
			border-radius: 40rpx;
			margin-top: 30rpx;
			padding: 20rpx 30rpx;
			text-align: center;
		}
		// .listBox {
		// 	background-color: rgba(38, 39, 47, 1);
		// 	border-radius: 20rpx;
		// 	padding: 30rpx 30rpx;
		// 	margin-bottom: 40rpx;
		// }

		// 您的好友
		.my-friends {
			@include centering;
			font-size: 26rpx;
			justify-content: space-between;
		}

		// 个人信息编辑
		.my-curr-state {
			width: 100%;
			.nickname {
				font-size: 40rpx;
				font-weight: 700;
				& .iconfont {
					font-size: 24rpx;
					transform: rotate(-90deg);
					margin: 0 6rpx;
				}
			}
			.curr-state {
			}
			.curr-state-setter {
				@include centering;
				justify-content: space-between;
				.btnBox {
					width: calc(50% - 15rpx);
					.iconfont {
						font-size: 30rpx;
						margin-right: 10rpx;
					}
				}
			}
		}

		// 自我介绍
		.profileBox {
			.profile-info {
				@include centering;
				align-items: flex-start;

				.info-left {
					.info {
						display: block;
						font-size: 26rpx;
						color: $FontGrey;
						margin-bottom: 20rpx;
					}
				}
				.info-right {
					.none-img {
						width: 140rpx;
						height: 140rpx;
					}
				}
			}
			.btnBox {
				width: 100%;
			}
		}

		// 注册时间
		.create-date {
			font-size: 26rpx;
			.info {
				display: block;
				color: $FontGrey;
				margin-bottom: 12rpx;
			}
		}
	}
}
</style>
