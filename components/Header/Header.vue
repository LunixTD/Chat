<template>
	<view class="Header">
		<view class="back">
			<i class="iconfont icon-back2" @click="back"></i>
		</view>
		<slot name="left"></slot>
		<slot name="right"></slot>
	</view>
</template>

<script setup>
import { defineProps } from 'vue';
const { backto, backBehavior } = defineProps(['backto', 'backBehavior']);
function back() {
	// uni.navigateTo({
	// 	url: `/pages/Main/Main`,
	// 	animationType: 'pop-out',
	// 	animationDuration: 200
	// });
	// backBehavior.value();
	uni.navigateBack({
		delta: 2,
		animationType: 'pop-out',
		animationDuration: 200
	});
}
</script>

<style lang="scss">
.Header {
	width: 100vw;
	height: calc(88rpx + var(--status-bar-height));
	position: fixed;
	top: 0;
	left: 0;
	padding-top: var(--status-bar-height);
	border-bottom: 1px solid rgba(white, 0.05);
	@include centering;
	justify-content: space-between;
	background-color: $ThemeDark3Color;

	.back {
		float: left;
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
