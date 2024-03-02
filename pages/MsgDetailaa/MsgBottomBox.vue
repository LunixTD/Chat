<template>
	<view class="bottom-box">
		<view class="main-box">
			<view class="btnBox" @click="chooseImage"><i class="iconfont icon-add1"></i></view>
			<view class="inputBox">
				<!-- 抖音小程序不支持linechange -->
				<textarea
					v-model="inputText"
					class="textarea"
					:style="{ height: textareaheight + 'rpx' }"
					maxlength="1000"
					cursor-spacing="52"
					@input="handleInput"
					@linechange="linechange"
				/>
				<i class="iconfont icon-xiaolian" :style="{ top: iconTop + 'rpx' }"></i>
			</view>
			<view class="btnBox" :class="msgType == 'text' ? 'textBg' : ''">
				<i class="iconfont icon-yuyin" :class="msgType == 'text' ? 'hide' : 'show'"></i>
				<i class="iconfont icon-fasong" :class="msgType == 'text' ? 'show' : 'hide'" @click="sendMsg"></i>
			</view>
		</view>
		<view class="content-box"></view>
	</view>
</template>

<script setup>
import { computed, ref, defineProps, watch, defineEmits } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const msgType = ref('voice');

function handleInput(e) {
	if (e.detail.value !== '') {
		msgType.value = 'text';
	}
	if (e.detail.value === '') {
		msgType.value = 'voice';
	}
}
const textareaheight = ref(0);

const iconTop = computed(() => {
	let top = 0;
	if (textareaheight.value < 324) {
		top = textareaheight.value / 2 - 18;
	} else {
		top = 162 - 18;
	}
	if (top < 0) {
		top = 0;
	}
	return top;
});

function linechange(e) {
	textareaheight.value = e.detail.heightRpx;
}

function chooseImage() {
	console.log('选择本地图片');
	uni.chooseImage({
		count: 1,
		sizeType: ['original'],
		sourceType: ['album'],
		success: function (res) {
			console.log(JSON.stringify(res.tempFilePaths));
		}
	});
}

// 处理输入内容
const { text } = defineProps(['text']);
const emit = defineEmits(['updateText']);
const inputText = ref(text);
watch(
	inputText,
	(val) => {
		emit('updateText', val);
	},
	{ deep: true }
);

// 发送消息
function sendMsg() {
	store.dispatch('chat/addMsgToList', {
		id: '00001',
		uid: '11111',
		user: 'tudou',
		date: new Date().getTime(),
		content: '土豆的第二条信息'
	});
}
</script>

<style lang="scss">
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

.bottom-box {
	// position: fixed;
	// left: 0;
	// bottom: 0;
	width: 100vw;
	// height: 88rpx;
	height: auto;
	background-color: $ThemeDark3Color;
	// background-color: red;
	border-top: 1px solid rgba(0, 0, 0, 0.03);
	padding: 9rpx 16rpx;
	// margin-bottom: env(safe-area-inset-bottom);
	// margin-bottom: var(--window-bottom);
	@include centering;
	flex-direction: column;

	.main-box {
		width: 100vw;
		@include centering;
		justify-content: space-evenly;

		.btnBox {
			position: relative;
			width: 70rpx;
			height: 70rpx;
			transition: background ease 0.3s;
			&.textBg {
				background-color: $ThemePrimaryColor;
			}

			.iconfont {
				width: 70rpx;
				heigth: 70rpx;
				line-height: 70rpx;
				position: absolute;
				top: 0;
				left: 0;
			}
		}

		.inputBox {
			position: relative;
			@include centering;
			.textarea {
				box-sizing: content-box;
				background-color: $ThemeLightColor;
				width: calc(100vw - 64rpx - 140rpx - 114rpx);
				min-height: 36rpx;
				// height: 32rpx;
				max-height: 324rpx;
				line-height: 36rpx;
				padding-left: 28rpx;
				padding-right: 86rpx;
				padding-top: 17rpx;
				padding-bottom: 15rpx;
				border-radius: 35rpx;
				// text-indent: 28rpx;
				color: $FontWhite;
				font-size: 28rpx;
				// white-space: pre-wrap;
				transition: height ease 0.3s;
				::-webkit-scrollbar {
					width: 6rpx;
				}
				::-webkit-scrollbar-thumb {
					border-radius: 6rpx;
					background-color: $ThemeDark1Color;
				}
			}
			.iconfont {
				width: 70rpx;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				vertical-align: middle;
				font-size: 52rpx;
				position: absolute;
				right: 8rpx;
				top: 8rpx;
				transition: top ease 0.3s;
			}
		}
	}

	.content-box {
		width: 100vw;
		height: 400rpx;
		background-color: lightblue;
		display: none;
	}
}
</style>
