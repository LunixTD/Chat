<template>
	<view class="userinfoBox">
		<view class="info-avatarBox">
			<!-- <image class="info-avatar" src="../../static/avatar/1.jpg" mode="widthFix"></image> -->
			<i class="iconfont icon-taolun" v-if="type == 'text'"></i>
			<i class="iconfont icon-yuyin1" v-if="type == 'voice'"></i>
		</view>
		<text class="info-title">{{ title }}</text>
		<text class="info-about">这里是聊天的起点~</text>
	</view>
</template>

<script setup>
import { defineProps } from 'vue';
const { title, type } = defineProps(['title', 'type']);
</script>

<style lang="scss">
.userinfoBox {
	width: 100%;
	height: 36vh;
	// background-color: lightblue;
	// padding: 0 16rpx;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: flex-start;
	padding: 0 30rpx;

	.info-avatarBox {
		width: 100%;
		// height: 200rpx;
		padding: 20rpx 0;
		padding-top: 180rpx;
		// background-color: red;
		.iconfont {
			font-size: 160rpx;
		}
		.info-avatar {
			width: 160rpx;
			height: 160rpx;
			border-radius: 50%;
		}
	}

	.info-title {
		display: block;
		color: $FontWhite;
		font-size: 56rpx;
	}
	.info-about {
		display: block;
		color: $FontGrey;
		font-size: 28rpx;
		margin-top: 10rpx;
	}
}
</style>
