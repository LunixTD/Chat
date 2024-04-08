<template>
	<view class="loadingPlaced" :class="showLoadingPlaced ? 'show' : 'hide'">
		<view :class="['msgBox' + i]" class="msgBox" v-for="i in 10" :key="i">
			<view class="msg-left">
				<view class="msg-avatar"></view>
			</view>
			<view class="msg-right">
				<view class="first-msg">
					<view class="u-info">
						<text class="uname"></text>
						<text class="utag"></text>
						<text class="date"></text>
					</view>
					<view class="content"></view>
				</view>
				<view class="addition-msg">sdasd</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, reactive, defineProps } from 'vue';
import variable from '@/styles/variable.js';

const { showLoadingPlaced } = defineProps(['showLoadingPlaced']);

const safeArea = reactive({
	top: 0,
	bottom: 0
});
const safeAreaInsets = uni.getSystemInfo({
	success(res) {
		safeArea.top = res.statusBarHeight;
		safeArea.bottom = res.safeAreaInsets.bottom;
	}
});
const loaingPlacedStyle = computed(() => {
	return {
		top: safeArea.top + variable.headerHeight,
		// bottom: safeArea.bottom,
		height: `calc(100vh - 100px - ${safeArea.bottom}rpx)`
	};
});
</script>

<style lang="scss">
.loadingPlaced {
	position: absolute;
	width: 100%;
	// height: 100vh;
	// transform: scaleY(-1);
	z-index: 99999;
	overflow: hidden;
	background-color: $ThemeDark3Color;
	&.show {
		animation: loadingMaskShow 0.3s ease forwards;
	}
	&.hide {
		animation: loadingMaskHide 0.3s ease forwards;
	}
	@keyframes loadingMaskShow {
		0% {
			opacity: 0;
			z-index: 99;
		}
		100% {
			opacity: 1;
			z-index: 99;
		}
	}
	@keyframes loadingMaskHide {
		0% {
			opacity: 1;
			z-index: 99;
		}
		99% {
			opacity: 0;
			z-index: 99;
		}
		100% {
			opacity: 0;
			z-index: -999;
		}
	}
}
.msgListItemContainer {
	// transform: scaleY(-1);
	&.margin {
		margin: 0;
	}
}
.hoverAnime {
	background-color: rgba(255, 255, 255, 0.05);
}
@for $i from 0 through 9 {
	.msgBox#{$i} {
		opacity: calc(1 - $i * 0.12);
	}
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
		top: 46rpx;
		width: 84rpx;
		height: 84rpx;
		align-self: flex-start;
		@include centering;
		.msg-avatar {
			width: 84rpx;
			height: 84rpx;
			border-radius: 42rpx;
			background-color: rgba(255, 255, 255, 0.1);
		}
		.msg-avatar-text {
			display: block;
			width: 84rpx;
			height: 84rpx;
			font-size: 32rpx;
			line-height: 84rpx;
			text-align: center;
			border-radius: 42rpx;
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
			margin-top: 36rpx;
			box-sizing: border-box;
			width: 100%;
			transition: background ease 0.2s;
			.content {
				width: calc(100% - 144rpx);
				height: 36rpx;
				background-color: rgba(255, 255, 255, 0.1);
				margin-top: 8rpx;
				margin-left: 124rpx;
				border-radius: 12rpx;
			}
			.u-info {
				@include centering;
				width: 100%;
				justify-content: flex-start;
				font-size: 24rpx;
				line-height: 44rpx;
				padding-left: 120rpx;
				// background-color: $ThemeDarkPop;

				.uname {
					font-size: 32rpx;
					width: 100rpx;
					height: 32rpx;
					background-color: rgba(255, 255, 255, 0.1);
					border-radius: 12rpx;
				}
				.utag {
					width: 80rpx;
					height: 42rpx;
					border-radius: 12rpx;
					line-height: 42rpx;
					font-size: 24rpx;
					padding: 0 12rpx;
					background-color: rgba(255, 255, 255, 0.08);
					border-radius: 10rpx;
					transform: scale(0.86);
				}
				.date {
					width: 120rpx;
					height: 32rpx;
					border-radius: 12rpx;
					transform: scale(0.95);
					background-color: rgba(255, 255, 255, 0.08);
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
		.addition-msg-list {
			box-sizing: border-box;
			width: 100%;
		}
		// 追加消息的样式
		.addition-msg {
			box-sizing: border-box;
			width: calc(100% - 144rpx);
			border-radius: 12rpx;
			margin-left: 124rpx;
			height: 40rpx;
			background-color: rgba(255, 255, 255, 0.07);
			margin-top: 12rpx;
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
