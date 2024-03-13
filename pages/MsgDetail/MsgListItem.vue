<template>
	<view class="msgListItemContainer" :class="getRenderIf('additionMsg') ? 'margin' : ''">
		<MsgTimeline v-if="getRenderIf('timeline')"></MsgTimeline>
		<view class="msgBox">
			<view class="msg-left" v-if="getRenderIf('fistMsg')">
				<image class="msg-avatar" v-if="creator.avatarInfo" :src="api.target_url + creator.avatarInfo.thumb" mode="widthFix"></image>
				<text class="msg-avatar-text" v-if="!creator.avatarInfo">{{ creator.nickname.substring(0, 1) }}</text>
			</view>
			<view class="msg-right" @longpress="showModal">
				<TouchBox class="first-msg" v-if="getRenderIf('fistMsg')" :touchStartStyle="customStyle" :touchEndStyle="touchStyle">
					<view class="u-info">
						<text class="uname">{{ creator.nickname }}</text>
						<text class="utag">管理员</text>
						<text class="date">{{ formatTime(createTime) }}</text>
					</view>
					<TextMsg :item="item" v-if="type == 'text'"></TextMsg>
					<ImageMsg :item="item" v-if="type == 'image'"></ImageMsg>
					<VoiceMsg :item="item" v-if="type == 'voice'"></VoiceMsg>
				</TouchBox>
				<TouchBox class="addition-msg" v-if="getRenderIf('additionMsg')" :touchStartStyle="customStyle" :touchEndStyle="touchStyle">
					<TextMsg :item="item" v-if="type == 'text'"></TextMsg>
					<ImageMsg :item="item" v-if="type == 'image'"></ImageMsg>
					<VoiceMsg :item="item" v-if="type == 'voice'"></VoiceMsg>
				</TouchBox>
			</view>
		</view>
	</view>
</template>

<script setup>
import MsgTimeline from './MsgTimeline.vue';
import { defineProps, computed, ref, onMounted, watch } from 'vue';
import { touchFeedback, formatTime } from '@/utils/tools.js';
import api from '@/services/request.js';
import TextMsg from './TextMsg.vue';
import ImageMsg from './ImageMsg.vue';
import VoiceMsg from './VoiceMsg.vue';

const { item, msgStyle } = defineProps(['item', 'msgStyle']);
const { uid, creator, createTime, type } = item;

// const

const customStyle = {
	backgroundColor: 'transparent'
};
const touchStyle = {
	// transform: 'scale(0.99)',
	backgroundColor: 'rgba(255, 255, 255, 0.09)'
};

function getRenderIf(name) {
	let renderBool = false;
	switch (name) {
		case 'timeline':
			if (msgStyle == 'newMsgWithDateLine') {
				renderBool = true;
			}
			break;
		case 'fistMsg':
			if (msgStyle == 'newMsgWithDateLine' || msgStyle == 'newMsg') {
				renderBool = true;
			}
			break;
		case 'additionMsg':
			if (msgStyle == 'additionMsg') {
				renderBool = true;
			}
			break;
		default:
			break;
	}
	return renderBool;
}

function showModal() {
	touchFeedback();
}
</script>

<script>
export default {
	options: { styleIsolation: 'shared' }
};
</script>

<style lang="scss">
.msgListItemContainer {
	margin-top: 36rpx;
	&.margin {
		margin: 0;
	}
}
.hoverAnime {
	background-color: rgba(255, 255, 255, 0.05);
}
.msgBox {
	position: relative;
	width: 100%;
	@include centering;
	// background-color: red;
	justify-content: flex-start;

	.msg-left {
		position: absolute;
		left: 20rpx;
		top: 10rpx;
		width: 84rpx;
		height: 84rpx;
		// background-color: red;
		align-self: flex-start;
		@include centering;
		.msg-avatar {
			width: 84rpx;
			height: 84rpx;
			border-radius: 50%;
		}
		.msg-avatar-text {
			display: block;
			width: 84rpx;
			height: 84rpx;
			line-height: 84rpx;
			text-align: center;
			border-radius: 50%;
			background-color: $ThemeLightColor;
		}
	}
	.msg-right {
		box-sizing: border-box;
		flex: 1;
		width: 100%;
		@include centering;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;

		// 新消息的样式
		.first-msg {
			box-sizing: border-box;
			width: 100%;
			transition: background ease 0.2s;
			.u-info {
				@include centering;
				justify-content: flex-start;
				font-size: 24rpx;
				line-height: 44rpx;
				padding-left: 120rpx;

				.uname {
					font-size: 32rpx;
				}
				.utag {
					height: 42rpx;
					line-height: 42rpx;
					font-size: 24rpx;
					padding: 0 12rpx;
					background-color: $ThemePrimaryColor;
					border-radius: 10rpx;
					transform: scale(0.86);
				}
				.date {
					transform: scale(0.95);
					color: $FontGrey;
				}
			}
			::v-deep .msg {
				padding: 8rpx 20rpx;
				padding-left: 120rpx;
				.msgImg {
					margin-top: 2rpx;
					margin-bottom: 2rpx;
				}
			}
		}
		// 追加消息的样式
		.addition-msg {
			box-sizing: border-box;
			width: 100%;
			font-size: 0;
			::v-deep .msg {
				padding: 6rpx 0;
				min-height: 54rpx;
				line-height: 54rpx;
				padding-left: 120rpx;
				.msgImg {
					margin: 2rpx 0;
				}
			}
		}
	}
}
</style>
