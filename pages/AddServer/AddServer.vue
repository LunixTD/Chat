<template>
	<page-meta page-style="backgroundColor: #1c1d23"></page-meta>
	<view class="container">
		<Header :backBehavior="backBehavior"></Header>
		<HeaderPlaced></HeaderPlaced>
		<text class="h1">{{ getTitle }}</text>
		<view class="listWrapper" :class="pageState == '' ? 'show' : 'hide'">
			<TouchBox v-for="(item, index) in dataArr" :key="index" :touchStartStyle="listItemStyle" :touchEndStyle="listItemPressStyle">
				<view class="listItem" @click="switchPage(item.page)">
					<view class="itemLeft">
						<image class="itemAvatar" :src="item.src" mode="widthFix"></image>
					</view>
					<view class="itemRight">
						<text class="itemUname">{{ item.title }}</text>
					</view>
					<i class="iconfont icon-back"></i>
					<i class="border-line height-1px" v-if="index !== dataArr.length - 1"></i>
				</view>
			</TouchBox>
		</view>

		<view class="wrapper" :class="pageState == '' ? 'hide' : 'show'">
			<view class="itemBox" v-show="pageState == 'create'">
				<view class="uploadBox" @click="chooseImage" :class="serverAvatar ? 'hideBorder' : ''">
					<view class="avatarBox">
						<image class="serverAvatar" :src="serverAvatar" mode="widthFix"></image>
					</view>
					<i class="iconfont icon-xiangji2"></i>
					<text class="text">封面</text>
				</view>
				<text class="title">服务器名称</text>
				<MyInput v-model:modelValue="serverName" type="text" placeholder="输入服务器名称" :inputStyle="inputStyle" :clearIconStyle="clearIconStyle"></MyInput>
				<view class="infoBox">
					<text class="title sm">您创建服务器即代表您同意了&nbsp;</text>
					<text class="title hl sm">相关守则</text>
				</view>
				<view class="btnBoxWrapper">
					<view class="btnMask" v-show="serverName == '' || serverAvatar == ''"></view>
					<TouchBox :touchStartStyle="btnStyle" :touchEndStyle="touchStyle">
						<view class="btnBox" @click="createServer">
							<text class="addFriend-text">创建服务器</text>
						</view>
					</TouchBox>
				</view>
			</view>
			<view class="itemBox" v-show="pageState == 'join'">
				<text class="title">邀请链接</text>
				<MyInput v-model:modelValue="joinCode" type="text" placeholder="输入邀请码或邀请链接" :inputStyle="inputStyle" :clearIconStyle="clearIconStyle"></MyInput>
				<view class="infoBox">
					<text class="title sm">邀请码为8位英文字母和数字的随机组合,例&nbsp;</text>
					<text class="title hl sm">JkVmzmks</text>
				</view>
				<view class="btnBoxWrapper">
					<view class="btnMask" v-show="joinCode == ''"></view>
					<TouchBox :touchStartStyle="btnStyle" :touchEndStyle="touchStyle">
						<view class="btnBox">
							<text class="addFriend-text">加入服务器</text>
						</view>
					</TouchBox>
				</view>
			</view>
		</view>

		<view class="cropper" :class="cropperState ? 'show' : 'hide'">
			<ksp-cropper mode="fixed" :width="200" :height="200" :maxWidth="1024" :maxHeight="1024" :url="url" @cancel="cancelCrop" @ok="imgCropEnd"></ksp-cropper>
		</view>
	</view>
</template>

<script setup>
import { join } from 'lodash';
import { computed, ref, watch, getCurrentInstance } from 'vue';
import varible from '@/styles/variable.js';
import api from '@/services/request.js';
import { useStore } from 'vuex';
import { useCopper } from '@/utils/hooks/useCropper.js';

const { ThemeDark1Color, ThemeDark3Color, ThemeDark5Color, ThemeDarkPop, BtnPrimaryColor, BtnPrimaryPressColor } = varible;
const listItemStyle = {
	backgroundColor: ThemeDarkPop
};
const listItemPressStyle = {
	backgroundColor: ThemeDark3Color
};
const btnStyle = {
	backgroundColor: BtnPrimaryColor,
	borderRadius: '40rpx'
};
const touchStyle = {
	backgroundColor: BtnPrimaryPressColor,
	borderRadius: '40rpx',
	transform: 'scale(.97)'
};
const dataArr = ref([
	{
		page: 'create',
		title: '创建服务器',
		src: '../../static/bg/addServer-bg1.png'
	},
	{
		page: 'join',
		title: '加入服务器',
		src: '../../static/bg/addServer-bg2.png'
	}
]);

const store = useStore();

function backBehavior() {
	if (pageState.value !== '') {
		pageState.value = '';
	} else {
		uni.navigateBack();
	}
}

const getTitle = computed(() => {
	let title = '';
	if (pageState.value == '') {
		title = '创建或加入服务器';
	}
	if (pageState.value == 'create') {
		title = '创建您的服务器';
	}
	if (pageState.value == 'join') {
		title = '加入现有的服务器';
	}
	return title;
});

const pageState = ref('');
function switchPage(page) {
	pageState.value = page;
}

// 输入框样式
const inputStyle = {
	backgroundColor: ThemeDark5Color,
	borderRadius: '30rpx',
	height: '110rpx',
	fontSize: '30rpx',
	margin: '20rpx 0'
};

const clearIconStyle = {
	width: '110rpx',
	height: '110rpx',
	lineHeight: '110rpx',
	fontSize: '40rpx'
};

// 输入框邀请码
const joinCode = ref('');
// 输入服务器名称
const serverName = ref('');

// 获取裁剪组件相关变量
const { url, imgInfo, cropedImg: serverAvatar, cropperState, chooseImage, cancelCrop, imgCropEnd } = useCopper();

// 创建服务器
async function createServer() {
	// if (serverName.value == '' || serverAvatar.value == '') return;
	const profile = uni.getStorageSync('profile');
	const createRes = await api.createServer({
		serverName: serverName.value,
		avatar: imgInfo.value,
		creatorId: profile._id
	});

	if (createRes.statusCode == 200) {
		// 创建成功后同步用户数据
		const userRes = await api.asyncUserProfile({
			id: profile._id
		});
		uni.setStorageSync('profile', userRes.data);
		store.dispatch('user/changeProfile', userRes.data);
		// 请求服务器页面刷新服务器列表
		uni.$emit('refreshServerList');
		// uni.navigateTo({
		// 	url: '/pages/Main/Main',
		// 	animationType: 'zoom-fade-out',
		// 	animationDuration: 240
		// });
		uni.navigateBack();
	}
}
</script>

<style lang="scss">
page {
	background-color: $ThemeDark3Color;
}
.container {
	padding: 30rpx;
	@include centering;
	flex-direction: column;

	.h1 {
		display: block;
		font-size: 56rpx;
		text-align: center;
		margin-bottom: 80rpx;
	}
	.wrapper {
		position: absolute;
		top: 240rpx;
		/* #ifdef APP */
		top: 300rpx;
		/* #endif */
		left: 0;
		width: 100vw;
		padding: 0 30rpx;
		background-color: transparent;
		transform: translateX(300rpx);
		opacity: 0;
		transition: all ease 0.3s;
		&.show {
			transform: translateX(0);
			opacity: 1;
			z-index: 10;
		}
		&.hide {
			transform: translateX(300rpx);
			opacity: 0;
			z-index: 0;
		}
	}

	.listWrapper {
		width: 100%;
		background-color: $ThemeDarkPop;
		border-radius: 20rpx;
		overflow: hidden;
		transition: all ease 0.3s;
		&.show {
			transform: translateX(0);
			opacity: 1;
			z-index: 10;
		}
		&.hide {
			transform: translateX(-300rpx);
			opacity: 0;
			z-index: 0;
		}

		.listItem {
			position: relative;
			width: 100%;
			height: 140rpx;
			@include centering;
			justify-content: flex-start;
			border-bottom: 1;
			.icon-back {
				margin-right: 30rpx;
				justify-self: flex-start;
				font-size: 24rpx;
				transform: rotate(180deg);
			}

			.itemLeft {
				width: 140rpx;
				height: 140rpx;
				.itemAvatar {
					width: 100rpx;
					height: 100rpx;
					margin-left: 20rpx;
					margin-top: 20rpx;
					border-radius: 50%;
				}
			}
			.itemRight {
				flex: 1;
				color: $FontWhite;
				height: 140rpx;
				line-height: 140rpx;
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
				background-color: rgba($FontGrey, 0.1);
			}
		}
	}

	// 加入
	.itemBox {
		width: 100%;
		.title {
			font-size: 28rpx;
			color: $FontGrey;
		}
		.sm {
			font-size: 26rpx;
		}
		.hl {
			color: white;
		}
		.infoBox {
			margin-bottom: 100rpx;
		}
		.linkInput {
			height: 110rpx;
			width: 100%;
			background-color: $ThemeDark5Color;
			border-radius: 30rpx;
			padding-left: 30rpx;
			margin: 20rpx 0;
			font-size: 30rpx;
		}
		.btnBoxWrapper {
			position: relative;
			.btnMask {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				border-radius: 40rpx;
				background-color: black;
				opacity: 0.5;
				transition: all ease 0.3s;
				&.hide {
					opacity: 0;
				}
			}
			.btnBox {
				width: 100%;
				height: 80rpx;
				line-height: 40rpx;
				border-radius: 40rpx;
				// margin-top: 100rpx;
				padding: 20rpx 30rpx;
				text-align: center;
				font-size: 28rpx;
			}
		}

		// 创建服务器
		.uploadBox {
			position: relative;
			@include centering;
			flex-direction: column;
			width: 160rpx;
			height: 160rpx;
			margin: 40rpx auto;
			border-radius: 80rpx;
			border: 1.8rpx dashed white;
			&.hideBorder {
				border: none;
			}
			.iconfont {
				font-size: 50rpx;
			}
			.text {
				font-size: 26rpx;
			}
			.avatarBox {
				display: inline-block;
				position: absolute;
				top: -1.8rpx;
				left: -1.8rpx;
				// background-color: red;
				width: 160rpx;
				height: 160rpx;
				.serverAvatar {
					width: 160rpx;
					height: 160rpx;
					border-radius: 80rpx;
				}
			}
		}
	}
}
// 裁剪页面
.cropper {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: -1;
	opacity: 0;
	transition: all ease 0.3s;
	&.show {
		opacity: 1;
		z-index: 100;
	}
	&.hide {
		opacity: 0;
		z-index: -1;
	}
}
</style>