<template>
	<view class="msg">
		<view class="voice" :class="playState == 'play' ? 'start' : ''" @click="voiceHandler">
			<view class="iconBox">
				<i class="iconfont icon-voice-pause" :class="playState == 'play' ? 'show' : 'hide'"></i>
				<i class="iconfont icon-voice-play" :class="playState == 'pause' ? 'show' : 'hide'"></i>
			</view>
			<view class="voiceWave" v-if="currActiveMsg == _id">
				<i ref="cursorRef" class="waveCursor" :class="cursorMoveState" :style="waveCursorStyle"></i>
				<i class="waveItem" :class="['item' + index, cursorIndex >= index ? 'active' : '']" v-for="(i, index) in waveNum" :key="index"></i>
			</view>
			<view class="duration">{{ getDuration }}"</view>
		</view>
	</view>
</template>

<script setup>
import { defineProps, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import api from '@/services/request.js';
const store = useStore();

const { item } = defineProps(['item']);
const { voiceInfo, _id } = item;

// console.log(item);

// 语音消息
const waveNum = ref(50);
const cursorMoveState = ref('');
const cursorRef = ref(null);

const playState = ref('pause');
const voiceDuration = ref(0);
// const voiceCurrTime = ref(0);
const waveItemActiveMaxNum = ref(0);
const voiceMsg = getAudioContext();

// #ifndef H5
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
voiceMsg.onTimeUpdate((res) => {
	console.log(voiceMsg.currentTime);
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
// const voiceBoxWidth = computed(() => {
// 	let width = (voiceDuration.value / 60) * 400 + 200;
// 	// return width;
// 	return 600;
// });

function voiceHandler() {
	store.dispatch('message/changeCurrActiveMsg', _id);
	if (playState.value == 'pause' && voiceMsg !== null) {
		console.log('播放');
		voiceStart();
	} else if (playState.value == 'play' && voiceMsg !== null) {
		console.log('暂停');
		voicePause();
	}
}
function getAudioContext() {
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.src = api.target_url + voiceInfo.url;
	// console.log(voiceInfo.url);
	innerAudioContext.onCanplay(() => {
		innerAudioContext.duration;
		console.log('可以播放');
		setTimeout(() => {
			voiceDuration.value = innerAudioContext.duration;
		}, 100);
	});
	return innerAudioContext;
	// return null;
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
	return store.state.message.currActiveMsg;
});

// 监听当前播放的消息id,以便停止其他正在播放的语音
watch(currActiveMsg, (newVal, oldVal) => {
	// console.log(oldVal, currActiveMsg.value);
	if (oldVal == _id) {
		voiceStop();
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
}
</style>
