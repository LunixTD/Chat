<template>
	<view class="timeline">
		<view class="line height-1px"></view>
		<text class="timeline-date">{{ formatTime(date, 'yyyy年MM月dd') }}</text>
	</view>
</template>

<script setup>
import { defineProps } from 'vue';
import { formatTime } from '@/utils/formatTime.js';
const { date } = defineProps(['date']);
// const time = ref('')
</script>

<style lang="scss">
.timeline {
	position: relative;
	@include centering;
	color: $FontGrey;
	font-size: 22rpx;
	// padding: 0 16rpx;
	width: 100%;
	height: 100rpx;
	padding: 0 20rpx;
	margin-top: -40rpx;

	.line {
		width: 100%;
		height: 1rpx;
		background-color: $FontGrey;
	}

	.timeline-date {
		padding: 0 14rpx;
		background-color: $ThemeDark3Color;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}
</style>
