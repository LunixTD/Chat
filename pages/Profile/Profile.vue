<template>
	<view class="profile-container">
		<view class="my-bg">
			<view class="cfgBtn">
				<i class="iconfont icon-bianji"></i>
			</view>
			<view class="bg">
				<!-- <image src="" mode=""></image> -->
			</view>
			<view class="avatarBox">
				<image class="my-avatar" src="../../static/avatar/05.jpg" mode="widthFix"></image>
				<view class="iconBox">
					<i class="iconfont" :class="'icon-ustate-' + uState"></i>
				</view>
				<view class="iconBox edit" @click="editorAvatar">
					<i class="iconfont icon-bianji"></i>
				</view>
			</view>
		</view>
		<view class="uinfoBox">
			<view class="uinfo-editor">
				<view class="uname">
					<text class="text">tudou</text>
				</view>
				<view class="editItem">
					<text class="iteminfo">昵称</text>
					<view class="inputBox">
						<input class="iteminput" type="text" v-model="nickname" placeholder="写个昵称?" maxlength="40" />
						<i class="iconfont icon-error" v-if="nickname" @click="clearNickname"></i>
					</view>
				</view>
				<view class="editItem">
					<text class="iteminfo">个人介绍</text>
					<view class="inputBox">
						<textarea class="itemtextarea" placeholder="在这里写下自我介绍~" maxlength="180" @input="textareaInput" />
						<text class="lastletter">{{ lastNum }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onNavigationBarButtonTap } from '@dcloudio/uni-app';
import ListBox from '../My/ListBox.vue';
onNavigationBarButtonTap((e) => {
	switch (e.tag) {
		case 'back':
			uni.navigateBack();
			break;
		case 'save':
			// 保存
			break;
	}
});
const uState = ref('stealth');
const nickname = ref('tudou');
const lastNum = ref(180);

function editorAvatar() {
	uni.navigateTo({
		url: '/pages/CropperPage/CropperPage'
	});
}

function clearNickname() {
	nickname.value = '';
}

function textareaInput(e) {
	lastNum.value = 180 - e.detail.value.length;
}
</script>

<style lang="scss">
.profile-container {
	width: 100vw;
	height: 100%;
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
			.edit {
				top: 0;
				width: 50rpx;
				height: 50rpx;
				line-height: 50rpx;
				margin-right: -4rpx;
				margin-top: -4rpx;
				.iconfont {
					// font-size: 24rpx;
				}
			}
		}
	}

	// 个人资料编辑
	.uinfoBox {
		width: 100%;
		padding: 0 30rpx;
		padding-top: 30rpx;
		.uinfo-editor {
			padding: 20rpx;
			border-radius: 14rpx;
			background-color: rgba(38, 39, 47, 1);

			.uname {
				margin-bottom: 30rpx;
				.text {
					font-size: 40rpx;
					font-weight: 600;
				}
			}
			.editItem {
				width: 100%;
				padding: 0 10rpx;
				margin-bottom: 40rpx;
				.iteminfo {
					display: block;
					font-size: 24rpx;
					margin-bottom: 20rpx;
				}
				.inputBox {
					position: relative;
					.iteminput {
						width: 100%;
						height: 80rpx;
						border-radius: 10rpx;
						padding-left: 30rpx;
						padding-right: 80rpx;
						font-size: 26rpx;
						background-color: $ThemeDark3Color;
					}
					.iconfont {
						position: absolute;
						top: 0;
						right: 0;
						width: 80rpx;
						height: 80rpx;
						line-height: 80rpx;
					}
					.itemtextarea {
						width: 100%;
						height: 360rpx;
						border-radius: 10rpx;
						padding: 20rpx 30rpx;
						font-size: 26rpx;
						background-color: $ThemeDark3Color;
					}
					.lastletter {
						position: absolute;
						bottom: 20rpx;
						right: 30rpx;
						font-size: 26rpx;
					}
				}
			}
		}
	}
}
</style>
