<template>
	<view class="Header" :style="[customStyle, headerStyle]">
		<view class="left">
			<view class="back">
				<i class="iconfont icon-back2" @click="back"></i>
			</view>
			<slot name="left"></slot>
		</view>
		<view class="middle" :style="headerStyle">
			<slot name="middle"></slot>
		</view>
		<view class="right">
			<slot name="right" class="right"></slot>
		</view>
	</view>
</template>

<script setup>
import { defineProps } from 'vue';
import { useStatusBarHeightStyle } from '@/utils/hooks/useStatusBarHeightStyle.js';
const { backto, backBehavior, customStyle } = defineProps(['backto', 'backBehavior', 'customStyle']);
function back() {
	// uni.navigateTo({
	// 	url: `/pages/Main/Main`,
	// 	animationType: 'pop-out',
	// 	animationDuration: 200
	// });
	// backBehavior.value();
	if (backBehavior !== undefined) {
		backBehavior();
	} else {
		// uni.navigateBack({
		// 	delta: 2,
		// 	animationType: 'pop-out',
		// 	animationDuration: 200
		// });
		uni.navigateBack();
	}
}

const headerStyle = useStatusBarHeightStyle(88);
</script>

<style lang="scss">
.Header {
	width: 100vw;
	position: fixed;
	top: 0;
	left: 0;
	@include centering;
	justify-content: space-between;
	font-size: 32rpx;
	z-index: 99;

	.back {
		float: left;
	}
	.middle {
		position: absolute;
		left: 50%;
		top: 0;
		transform: translateX(-50%);
	}
	.iconfont {
		color: white;
		font-size: 48rpx;
		width: 88rpx;
		height: 88rpx;
		line-height: 88rpx;
	}
}
</style>
