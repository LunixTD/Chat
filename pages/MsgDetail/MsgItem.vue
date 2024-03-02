<template>
	<view class="msg" v-if="type === 'text'">
		<rich-text class="content" :nodes="getContentHtml(content)"></rich-text>
	</view>
	<view class="msg" v-if="type === 'voice'">
		<view class="voice" :class="playState == 'play' ? 'start' : ''" @click="voiceHandler">
			<view class="iconBox">
				<i class="iconfont icon-voice-pause" :class="playState == 'play' ? 'show' : 'hide'"></i>
				<i class="iconfont icon-voice-play" :class="playState == 'pause' ? 'show' : 'hide'"></i>
			</view>
			<view class="voiceWave">
				<i ref="cursorRef" class="waveCursor" :class="cursorMoveState" :style="waveCursorStyle"></i>
				<i class="waveItem" :class="['item' + index, cursorIndex >= index ? 'active' : '']" v-for="(i, index) in waveNum" :key="index"></i>
			</view>
			<view class="duration">{{ getDuration }}"</view>
		</view>
	</view>
	<view class="msg" v-if="type === 'image'">
		<image :src="src" :style="msgImgStyle" :mode="imgMode" class="msgImg" @click="previewImage(src)"></image>
	</view>
</template>

<script setup>
import { defineProps, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { emojiList } from '@/static/map/sourceUri.js';
import api from '../../services/request.js';
const store = useStore();

const { item } = defineProps(['item']);
const { msg, id } = item;
const { type, voiceData, imgData, content } = msg;

// #ifndef H5
const src = imgData.url;
// #endif
// #ifdef H5
const src = api.targetUrl + imgData.url;
// #endif
// console.log(api.targetUrl + imgData.url);

// 文本消息(处理文本)
function getContentHtml(content) {
	let reg = /(?<=\[)[^\]]*(?=\])/g;
	const matchList = content.match(reg);
	if (matchList !== null) {
		let emojiArr = [];
		for (let i = 0; i < matchList.length; i++) {
			let emojiKey = matchList[i];
			if (emojiList[emojiKey] != undefined) {
				emojiArr.push(emojiKey);
			}
		}
		emojiArr = [...new Set(emojiArr)];
		for (let j = 0; j < emojiArr.length; j++) {
			let emojiName = emojiArr[j];
			const regStr = '\\[' + emojiName + '\\]';
			const emojiReg = new RegExp(regStr, 'g');
			// console.log(emojiReg);
			content = content.replace(emojiReg, getImgTagStr(emojiList[emojiName]));
		}
	}
	return content;
}

// 获取emoji的html文本
function getImgTagStr(src) {
	const pxNum = uni.upx2px(52);
	const lineHNum = uni.upx2px(40);
	const margin = uni.upx2px(12);
	return `<img style="display: inline-block;width: ${pxNum}px;height: ${pxNum}px;margin-bottom: -${margin}px; " class="emojiImg"  src="${src}" mode="widthFix"></img>`;
}

// 计算图片样式
const imgMode = ref('widthFix');
const msgImgStyle = computed(() => {
	if (type == 'image') {
		const { size } = msg.imgData;
		let width = 0;
		let height = 0;
		let rate = size.width / size.height;
		if (size.width > size.height) {
			imgMode.value = 'widthFix';
			if (size.width < uni.upx2px(400)) {
				width = size.width + 'rpx';
				height = 'auto';
			} else {
				width = '400rpx';
				height = 400 / rate + 'rpx';
			}
		} else if (size.width < size.height) {
			imgMode.value = 'heightFix';
			if (size.height <= uni.upx2px(400)) {
				height = size.height + 'rpx';
				width = 'auto';
			} else {
				height = '400rpx';
				width = 400 * rate + 'rpx';
			}
		} else {
			if (size.width <= uni.upx2px(400)) {
				width = size.width + 'rpx';
				height = size.height + 'rpx';
			} else {
				width = '400rpx';
				height = '400rpx';
			}
		}
		return {
			width: width,
			height: height
		};
	}
});

function previewImage(src) {
	// 预览图片
	uni.previewImage({
		urls: [src],
		longPressActions: {
			itemList: ['发送给朋友', '保存图片', '收藏'],
			success: function (data) {
				console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
			},
			fail: function (err) {
				console.log(err.errMsg);
			}
		}
	});
}

// 语音消息
const waveNum = ref(50);
const cursorMoveState = ref('');
const cursorRef = ref(null);

const playState = ref('pause');
const voiceDuration = ref(0);
// const voiceCurrTime = ref(0);
const waveItemActiveMaxNum = ref(0);
const voiceMsg = getAudioContext();

// #ifdef APP
voiceMsg.onPlay(() => {
	cursorMoveState.value = 'move';
});
voiceMsg.onEnded(() => {
	playState.value = 'pause';
	// 指针位置初始化
	cursorMoveState.value = '';
	clearInterval(interval.value);
	cursorIndex.value = -1;
	// voiceStop();
});
// #endif

const dotTime = computed(() => {
	return voiceDuration.value / waveNum.value;
});

const waveCursorStyle = computed(() => {
	const style = {
		// animationName: 'cursorMove',
		animationDuration: voiceDuration.value + 's',
		animationPlayState: playState.value == 'pause' ? 'paused' : 'running'
	};
	return style;
});

// 根据语音长度计算盒子宽度，最大语音时长60s（搁置）
const voiceBoxWidth = computed(() => {
	let width = (voiceDuration.value / 60) * 400 + 200;
	// return width;
	return 600;
});

function voiceHandler() {
	store.dispatch('chat/changeCurrActiveMsg', id);
	if (playState.value == 'pause' && voiceMsg !== null) {
		console.log('播放');
		voiceStart();
	} else if (playState.value == 'play' && voiceMsg !== null) {
		console.log('暂停');
		voicePause();
	}
}
function getAudioContext() {
	// #ifdef APP
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.src = voiceData.url;
	innerAudioContext.onCanplay(() => {
		voiceDuration.value = innerAudioContext.duration;
	});
	return innerAudioContext;
	// #endif
	return null;
}

const getDuration = computed(() => {
	// console.log(voiceDuration.value);
	return Math.floor(voiceDuration.value);
});

const interval = ref(null);
const cursorIndex = ref(-1);
function voicePause() {
	playState.value = 'pause';
	voiceMsg.pause();
	clearInterval(interval.value);
}

function voiceStart() {
	playState.value = 'play';
	voiceMsg.play();
	interval.value = setInterval(() => {
		cursorIndex.value += 1;
	}, dotTime.value * 1000);
}

function voiceStop() {
	// 指针位置初始化
	cursorMoveState.value = '';
	clearInterval(interval.value);
	cursorIndex.value = -1;
	playState.value = 'pause';
	// voicePause();
	voiceMsg.stop();
}

const currActiveMsg = computed(() => {
	return store.state.chat.currActiveMsg;
});

// 监听当前播放的消息id,以便停止其他正在播放的语音
watch(currActiveMsg, () => {
	if (currActiveMsg.value !== id) {
		voiceStop();
		console.log(111);
	}
});
</script>

<style lang="scss">
.msg {
	width: 100%;
	min-height: 40rpx;
	line-height: 40rpx;
	vertical-align: middle;
	font-size: 0;
	.content {
		font-size: 30rpx;
		line-height: 42rpx;
		display: block;
		word-break: break-all;
		white-space: pre-line;
	}

	// 语音消息
	.voice {
		display: inline-block;
		// min-width: 200rpx;
		// max-width: 600rpx;
		// width: 600rpx;
		width: 170rpx;
		height: 100rpx;
		line-height: 100rpx;
		background-color: rgba($ThemeLightColor, 0.9);
		border-radius: 50rpx;
		margin-top: 10rpx;
		padding: 0 23rpx;
		text-align: center;
		@include centering;
		justify-content: space-between;
		transition: all ease 0.3s;
		box-shadow: 1rpx 1rpx 3rpx $ThemeDark4Color;
		&.start {
			width: calc(100% - 30rpx);
		}

		.iconBox {
			position: relative;
			width: 60rpx;
			height: 60rpx;
			border-radius: 40rpx;
			background-color: $FontWhite;
			box-shadow: 3rpx 3rpx 3rpx $ThemeDark1Color;
			& .iconfont {
				transition: all ease 0.2s;
			}

			& .hide {
				opacity: 0;
				z-index: -10;
				// display: none;
			}
			& .show {
				opacity: 1;
				z-index: 10;
				// display: block;
			}
			.iconfont {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				font-size: 42rpx;
				// color: $ThemePrimaryColor;
				color: red;
				z-index: 10;
			}
		}
		&.start .voiceWave {
			opacity: 1;
			flex: 1;
			@for $i from 0 through 49 {
				.item#{$i} {
					height: $i * 1.6 + 4rpx;
					animation-delay: $i * 0.05s;
					@if $i > 24 {
						height: 52rpx * 1.6 - $i * 1.6;
					}
				}
			}
		}
		&.start .voiceWave .waveCursor {
			opacity: 1;
		}
		.voiceWave {
			// flex: 1;
			position: relative;
			width: 0;
			opacity: 0;
			transition: opacity ease 0.3s;
			@include centering;
			.waveCursor {
				content: '';
				position: absolute;
				// 20rpx-454rpx
				left: 14rpx;
				// left: 405rpx;
				width: 4rpx;
				border-radius: 2rpx;
				height: 70rpx;
				background: linear-gradient(white 0%, transparent 6%, $FontWhite 10%, $FontWhite 90%, transparent 94%, white 100%);
				// transition: transform linear 0.3s;
				z-index: 10;
				opacity: 0;
				&.move {
					animation-name: waveCursorMove;
					animation-timing-function: linear;
				}
			}
			@keyframes waveCursorMove {
				0% {
					transform: translateX(0rpx);
				}
				100% {
					transform: translateX(402rpx);
				}
			}
			.waveItem {
				display: inline-block;
				width: 4rpx;
				height: 3rpx;
				margin: 0 2rpx;
				border-radius: 2rpx;
				background-color: $FontGrey;
				animation: waveAnime linear 0.3s infinite alternate;
				transition: height ease 1s, background ease 0s;
				&.active {
					background-color: white;
				}
			}

			@keyframes waveAnime {
				0% {
					transform: scaleY(1);
				}
				100% {
					@for $i from 0 through 49 {
						transform: scaleY(math.div(0.2, 24) * (24 - $i) + 1);
						@if $i > 24 {
							transform: scaleY(1 - math.div(0.2, 24) * (24 - $i));
						}
					}
				}
			}
		}
		.duration {
			width: 50rpx;
			line-height: 100rpx;
			font-size: 28rpx;
		}
	}

	// 图片
	.msgImg {
		// max-width: 580rpx;
		// max-height: 300rpx;
		vertical-align: middle;
	}
}
</style>
