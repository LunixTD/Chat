<template>
	<view class="profile-container">
		<MyPopup ref="pop"></MyPopup>
		<Header :customStyle="customStyle">
			<template #middle>
				<view class="headerMiddle">个人资料修改</view>
			</template>
			<template #right>
				<text class="headerRight" @click="saveProfile">保存</text>
			</template>
		</Header>
		<HeaderPlaced></HeaderPlaced>
		<view class="my-bg">
			<view class="cfgBtn" @click="chooseBgImg">
				<i class="iconfont icon-bianji"></i>
			</view>
			<view class="bg">
				<image class="bgImg" :src="bgSrc" mode="widthFix"></image>
			</view>
			<view class="avatarBox" @click="chooseAvatarImg">
				<image class="my-avatar" :src="avatarSrc" mode="widthFix"></image>
				<view class="iconBox">
					<i class="iconfont" :class="'icon-ustate-' + uState"></i>
				</view>
				<view class="iconBox edit">
					<i class="iconfont icon-bianji"></i>
				</view>
			</view>
		</view>
		<view class="uinfoBox">
			<view class="uinfo-editor">
				<view class="uname">
					<text class="text">{{ profile.nickname }}</text>
				</view>
				<view class="editItem">
					<text class="iteminfo">昵称</text>
					<view class="inputBox">
						<MyInput placeholder="写个昵称?" :inputStyle="customStyle" v-model="nickname" :clearIconStyle="true"></MyInput>
					</view>
				</view>
				<view class="editItem">
					<text class="iteminfo">个人介绍</text>
					<view class="inputBox">
						<textarea class="itemtextarea" :value="profileStr" placeholder="在这里写下自我介绍~" maxlength="180" @input="textareaInput" />
						<text class="lastletter">{{ lastNum }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
	<view class="cropper" :class="bgCropperState ? 'show' : 'hide'">
		<ksp-cropper mode="fixed" :width="750" :height="400" :maxWidth="1024" :maxHeight="1024" :url="bgUrl" @cancel="bgCancelCrop" @ok="bgImgCropEnd"></ksp-cropper>
	</view>
	<view class="cropper" :class="avatarCropperState ? 'show' : 'hide'">
		<ksp-cropper mode="fixed" :width="200" :height="200" :maxWidth="1024" :maxHeight="1024" :url="avatarUrl" @cancel="avatarCancelCrop" @ok="avatarImgCropEnd"></ksp-cropper>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance, watch } from 'vue';
import { useStore } from 'vuex';
import { onNavigationBarButtonTap } from '@dcloudio/uni-app';
import { useCopper } from '@/utils/hooks/useCropper.js';
import variable from '@/styles/variable.js';
import api from '@/services/request.js';
import { asyncUserProfile } from '@/utils/hooks/useAsyncUserProfile.js';

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

const customStyle = {
	backgroundColor: variable.ThemeDark3Color
};

const store = useStore();
const uState = ref('stealth');
const nickname = ref('');
const profileStr = ref('');

const profile = computed(() => {
	nickname.value = store.state.user.profile.nickname;
	profileStr.value = store.state.user.profile.profileStr;
	return store.state.user.profile;
});

// 设置背景图
const {
	url: bgUrl,
	imgInfo: bgImgInfo,
	cropedImg: cropedBg,
	cropperState: bgCropperState,
	chooseImage: chooseBgImg,
	cancelCrop: bgCancelCrop,
	imgCropEnd: bgImgCropEnd
} = useCopper();

// 头像裁剪相关变量
const {
	url: avatarUrl,
	imgInfo: avatarImgInfo,
	cropedImg: cropedAvatar,
	cropperState: avatarCropperState,
	chooseImage: chooseAvatarImg,
	cancelCrop: avatarCancelCrop,
	imgCropEnd: avatarImgCropEnd
} = useCopper();

const bgSrc = computed(() => {
	let src = '';
	if (cropedBg.value != '') {
		src = cropedBg.value;
	} else {
		src = profile.value.profileBgInfo !== undefined ? api.target_url + profile.value.profileBgInfo.url : '/static/bg/searchFriend.png';
	}
	return src;
});

const avatarSrc = computed(() => {
	let src = '';
	if (cropedAvatar.value != '') {
		src = cropedAvatar.value;
	} else {
		src = profile.value.avatarInfo !== undefined ? api.target_url + profile.value.avatarInfo.thumb : '/static/avatar/placed.jpeg';
	}
	return src;
});

function textareaInput(e) {
	profileStr.value = e.detail.value;
}

const lastNum = ref(180);
watch(profileStr, (newVal) => {
	if (newVal !== undefined) {
		lastNum.value = 180 - newVal.length;
	}
});

const pop = ref(null);
const instance = getCurrentInstance();

// 保存信息修改
async function saveProfile() {
	const profile = uni.getStorageSync('profile');
	// console.log(nickname.value);
	// console.log(profile);
	if (profile._id !== undefined) {
		let tmpData = {};
		if (bgImgInfo.value != null) {
			tmpData.profileBgInfo = bgImgInfo.value;
		}
		if (avatarImgInfo.value != null) {
			tmpData.avatarInfo = avatarImgInfo.value;
		}
		if (nickname.value != profile.nickname) {
			tmpData.nickname = nickname.value;
		}
		if (profileStr.value != profile.profileStr) {
			tmpData.profileStr = profileStr.value;
		}

		// console.log(tmpData);
		// 注意数据格式是否正确,不然会导致数据格式错乱，后续调用到的地方出错
		const updateRes = await asyncUserProfile('updateProfile', tmpData);
		if (updateRes.statusCode == 200) {
			console.log('个人资料修改成功!');
			instance.refs.pop.showPop('资料修改成功!!');
			setTimeout(() => {
				uni.navigateBack();
			}, 2400);
		}
	} else {
		console.log('没有本地用户数据，无法更新数据！');
	}
}
</script>

<style lang="scss">
page {
	min-height: 100vh;
	background-color: $ThemeDark3Color;
}
.profile-container {
	width: 100vw;
	padding-bottom: 30rpx;
	.headerMiddle {
		@include centering;
		height: 100%;
	}
	.headerRight {
		// width: 88rpx;
		padding: 0 30rpx;
	}

	.my-bg {
		position: relative;
		width: 100vw;
		height: 500rpx;
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
			background-color: $ThemeDark3Color;
			z-index: 20;
			.iconfont {
				display: block;
				font-size: 38rpx;
			}
		}

		.bg {
			width: 100%;
			height: 400rpx;
			// background-color: lightcoral;
			overflow: hidden;
			z-index: 10;
			.bgImg {
				width: 100%;
			}
		}
		.avatarBox {
			position: absolute;
			left: 30rpx;
			bottom: 0;
			width: 180rpx;
			height: 180rpx;
			border: 12rpx solid $ThemeDark3Color;
			border-radius: 50%;
			@include centering;

			.my-avatar {
				width: 100%;
				height: 100%;
				border-radius: 50%;
				background-color: $ThemeDark3Color;
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
