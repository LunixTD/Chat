<template>
	<!-- #ifdef APP-NVUE -->
	<cell></cell>
	<!-- #endif -->
	<!-- #ifndef APP-NVUE -->
	<view class="msgBox">
		<view class="msg-left">
			<image class="msg-avatar" src="../../static/avatar/3.jpg" mode="widthFix"></image>
		</view>
		<view class="msg-right">
			<view class="first-msg">
				<view class="u-info">
					<text class="uname">{{ user }}</text>
					<text class="utag">管理员</text>
					<text class="date">2018/08/09 19:05</text>
				</view>
				<view class="msg">
					<text class="content">{{ content }}</text>
				</view>
			</view>
			<!-- <view class="addition-msg">
				<view class="msg">
					<text class="content">涉及到了附是是的是是的就涉及到了附是是的就涉及到了附是是的就涉及到了附就涉及到了附件是的就</text>
				</view>
			</view> -->
		</view>
	</view>
	<!-- #endif -->
</template>

<script setup>
import { defineProps } from 'vue';
const { item } = defineProps(['item']);
const { uid, user, date, content } = item;
</script>

<style lang="scss">
.msgBox {
	position: relative;
	width: 100%;
	// margin-bottom: 40rpx;
	padding-bottom: 30rpx;
	@include centering;
	justify-content: flex-start;
	// border: 1px solid red;
	// &:before {
	// 	content: "";
	// 	position: absolute;
	// 	width: 4rpx;
	// 	height: 100%;
	// 	background-color: red;
	// }

	.msg-left {
		position: absolute;
		left: 20rpx;
		top: 4rpx;
		width: 80rpx;
		height: 80rpx;
		// background-color: red;
		align-self: flex-start;
		// margin-right: 16rpx;
		.msg-avatar {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}
	.msg-right {
		flex: 1;
		width: 100%;
		@include centering;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;

		.first-msg {
			width: 100%;
			padding: 0 20rpx;
			padding-left: 120rpx;
			&:hover {
				background-color: lightblue;
			}
			.u-info {
				@include centering;
				justify-content: flex-start;
				font-size: 24rpx;

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
					transform: scale(0.9);
					color: $FontGrey;
				}
			}
		}
		.addition-msg {
			width: 100%;
			padding: 0 20rpx;
			padding-left: 120rpx;
			&:hover {
				background-color: lightblue;
			}
		}
		.msg {
			.content {
				font-size: 26rpx;
				line-height: 46rpx;
				display: block;
			}
		}
	}
}
</style>
