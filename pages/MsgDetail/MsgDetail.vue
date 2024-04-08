<template>
	<view class="msgDetail-container" ref="msgPage">
		<Header class="header" backto="Msg">
			<template #left>
				<view class="content-left" v-if="room">
					<view class="avatarBox flex">
						<!-- <image src="../../static/avatar/1.jpg" mode="widthFix" class="avatar"></image> -->
						<text class="nickname">{{ room.target.nickname }}</text>
					</view>
				</view>
			</template>
			<template #right>
				<view class="content-right">
					<view class="rightBox flex">
						<view class="btnBox" @click="openVoicePage">
							<i class="iconfont icon-dianhua"></i>
						</view>
						<view class="btnBox"><i class="iconfont icon-shipin"></i></view>
					</view>
				</view>
			</template>
		</Header>
		<!-- <HeaderPlaced></HeaderPlaced> -->
		<view class="msgContainerBox" v-if="room" :class="chatroomState == 'show' ? 'show' : 'hide'">
			<MsgContainer origin="room" :sendToId="room._id"></MsgContainer>
		</view>
		<view class="msgInputBox" :class="chatroomState == 'show' ? 'show' : 'hide'">
			<!-- origin为底部输入框的归属位置，当前服务于频道页面 -->
			<MsgBottomBox origin="room"></MsgBottomBox>
		</view>
	</view>
	<ModalBottom ref="modalRef"></ModalBottom>
</template>

<script>
import MsgBottomBox from './MsgBottomBox.vue';
import MsgContainer from './MsgContainer.vue';
import { ref, computed, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import permision from '@/js_sdk/wa-permission/permission.js';

export default {
	components: { MsgBottomBox, MsgContainer },
	data() {
		return {
			room: null
		};
	},
	onLoad(e) {
		this.room = JSON.parse(e.room);
	},
	computed: {
		chatroomState() {
			return this.$store.state.ui.chatroomState;
		}
	},
	methods: {
		async openVoicePage() {
			let params = {
				roomId: this.room._id,
				target: this.room.target,
				userList: this.room.userList
			};
			// #ifdef APP
			let osName = '';
			uni.getSystemInfo({
				success: (res) => {
					osName = res.osName;
				}
			});
			// console.log(osName);
			let hasPermission = false;
			if (osName == 'android') {
				const result = await permision.requestAndroidPermission('android.permission.RECORD_AUDIO');
				if (result == 1) {
					hasPermission = true;
				}
			}
			if (osName == 'ios') {
				const recordManager = uni.getRecorderManager();
				recordManager.start();
				recordManager.stop();
				const result = permision.judgeIosPermission('record');
				if (result == true) {
					hasPermission = true;
				}
			}
			if (!hasPermission) {
				this.$refs.modalRef.openBottomModal('permissionArea');
				return;
			}
			// #endif
			uni.$emit('voice', {
				type: 'request',
				data: params
			});
			uni.navigateTo({
				url: `/pages/VoicePage/VoicePage?type=sender&params=${JSON.stringify(params)}`,
				animationType: 'fade-in'
			});
		}
	}
};
</script>

<style lang="scss">
/* #ifdef H5 */
::-webkit-scrollbar {
	display: none;
}
/* #endif */
page {
	background-color: $ThemeDark3Color;
}
.emoji {
	width: 50rpx;
	height: 50rpx;
}
.msgDetail-container {
	touch-action: none;
	position: relative;
	width: 100vw;
	height: auto !important;
	// overflow: hidden;
	@include centering;
	flex-direction: column;
	background-color: $ThemeDark3Color;
	// padding-bottom: 90rpx;
}
.flex {
	height: 100%;
	@include centering;
	justify-content: space-between;
}

.btnBox {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background-color: $ThemeDark1Color;
	@include centering;

	& .iconfont {
		transition: all ease 0.3s;
	}

	& .hide {
		opacity: 0;
		// display: none;
	}
	& .show {
		opacity: 1;
		// display: block;
	}
}

.iconfont {
	color: $IconWhite;
	text-align: center;
}

.header {
	background-color: $ThemeDark3Color;
	border-bottom: 1px solid rgba(white, 0.05);
	z-index: 99;

	.content-left {
		height: 100%;

		.avatarBox {
			@include centering;
			.avatar {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			.nickname {
				color: $FontWhite;
				font-size: 32rpx;
			}
		}
	}
	.content-right {
		height: 100%;
		margin-left: auto;
		/* #ifdef MP-WEIXIN */
		margin-right: 300rpx;
		/* #endif */

		.btnBox {
			margin-right: 20rpx;
		}
	}
}
</style>
