<template>
	<view class="modalConfirmContainer" :class="showState ? 'show' : 'hide'">
		<GlobalMask :class="showState ? 'show' : 'hide'"></GlobalMask>

		<view class="confirmBox" :style="confirmBoxStyle" :class="showState ? 'show' : 'hide'">
			<slot></slot>
			<view class="defaultConfirm" v-if="slot.default == undefined">
				<view class="title" v-if="title">{{ title }}</view>
				<view class="content">{{ content }}</view>
				<view class="confirmBtn" @click="confirm(true)">
					<TouchBox renderType="btn" color="red">
						<text>确定</text>
					</TouchBox>
				</view>
				<view class="confirmBtn" @click="confirm(false)">
					<TouchBox renderType="btn" color="grey">
						<text>返回</text>
					</TouchBox>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, useSlots, defineProps, defineEmits, defineExpose } from 'vue';
import { useSafeAreaBottomStyle } from '@/utils/hooks/useStatusBarHeightStyle.js';
import { throttle } from 'lodash';

const { title, content } = defineProps(['title', 'content']);
const emit = defineEmits(['onConfirm']);

const confirmBoxStyle = useSafeAreaBottomStyle(80);
const showState = ref(false);
const slot = useSlots();

const confirm = throttle((bool) => {
	emit('onConfirm', bool);
}, 1000);

function openConfirmModal() {
	showState.value = true;
}
function closeConfirmModal() {
	showState.value = false;
}

defineExpose({
	openConfirmModal,
	closeConfirmModal
});
</script>

<style lang="scss">
.modalConfirmContainer {
	touch-action: none;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99999;
	&.show {
		animation: modalShow 0.3s ease forwards;
	}
	&.hide {
		animation: modalHide 0.3s ease forwards;
	}
	@keyframes modalShow {
		0% {
			z-index: 9999;
		}
		100% {
			z-index: 9999;
		}
	}
	@keyframes modalHide {
		0% {
			z-index: 9999;
		}
		99% {
			z-index: 9999;
		}
		100% {
			z-index: -1;
		}
	}
	.confirmBox {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
		padding: 30rpx;
		@include centering;
		opacity: 0;
		transition: all ease 0.3s;
		&.show {
			opacity: 1;
			transform: scale(1);
		}
		&.hide {
			opacity: 0;
			transform: scale(0.8);
		}
		.defaultConfirm {
			width: 100%;
			height: auto;
			padding: 30rpx;
			border-radius: 12rpx;
			background-color: $ThemeDark3Color;
			.title {
				font-size: 30rpx;
			}
			.content {
				font-size: 28rpx;
				margin: 30rpx 0;
			}
			.confirmBtn {
				margin-top: 20rpx;
			}
		}
	}
}
</style>
