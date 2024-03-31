<template>
	<view class="loaderContainer">
		<view class="iconBox" v-if="loadingState == 'loading'">
			<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 400 400">
				<circle cx="200" cy="200" r="120" class="loadIcon" stroke="#dddee1" stroke-width="30" stroke-dasharray="100" stroke-dashoffset="10" fill="none" />
			</svg>
		</view>
		<view class="placed" v-if="loadingState == 'void'">
			<i class="iconfont icon-search"></i>
			<text class="h5">暂无搜索结果</text>
		</view>
		<view class="placed" v-if="loadingState == 'init'">
			<i class="iconfont icon-kongshuju"></i>
			<text class="h5">请输入搜索信息</text>
		</view>
	</view>
</template>

<script setup>
import { ref, defineProps } from 'vue';
const { loadingState } = defineProps(['loadingState']);
</script>
<script>
export default {
	options: {
		virtualHost: true
	}
};
</script>
<style lang="scss">
.loaderContainer {
	flex: 1;
	// background-color: lightskyblue;
	@include centering;
	.iconBox {
		width: 120rpx;
		height: 120rpx;
		.loadIcon {
			stroke-dasharray: 750px, 760px;
			stroke-dashoffset: 750px;
			animation: loadAnime 5s ease infinite forwards, round 4s linear infinite;
			transform-origin: center;
			stroke-linecap: round;
			@keyframes loadAnime {
				0% {
					stroke-dashoffset: 750px;
				}
				100% {
					stroke-dashoffset: -750px;
				}
			}
			@keyframes round {
				0% {
					transform: rotate(0deg);
				}
				100% {
					transform: rotate(360deg);
				}
			}
		}
	}
	.placed {
		text-align: center;
		color: $FontGrey;
		margin-top: -100rpx;
		.iconfont {
			display: block;
			margin-bottom: 10rpx;
			font-size: 160rpx;
		}
	}
}
</style>
