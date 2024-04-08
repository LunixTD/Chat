<template>
	<view class="popupContainer" :class="popState" :style="popupContainerStyle">
		<view class="content">
			<text>{{ popText }}</text>
		</view>
	</view>
</template>

<script setup>
import { ref, defineExpose, computed } from 'vue';
import { useSystemInfo } from '@/utils/hooks/useSystemInfo.js';
const popState = ref('hide');
const popText = ref('');
const timer = ref(null);
function showPop(text, duration) {
	if (timer.value !== null) return;
	popText.value = text;
	popState.value = 'show';
	timer.value = setTimeout(function () {
		popState.value = 'hide';
		timer.value = null;
	}, duration || 3000);
}
defineExpose({ showPop });

const statusBarHeight = useSystemInfo('statusBarHeight');
const popupContainerStyle = computed(() => {
	return {
		height: `${statusBarHeight.value + uni.upx2px(83)}px`
	};
});
</script>

<style lang="scss">
.popupContainer {
	@include centering;
	flex-direction: column;
	justify-content: flex-end;
	width: 100vw;
	// background-color: red;
	// padding: 6rpx 30rpx;
	// background-color: $ThemeDark3Color;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 99999999;
	transform: translateY(-20vh);
	transition: all ease 0.3s;
	&.show {
		opacity: 1;
		transform: translateY(0);
	}
	&.hide {
		opacity: 0.7;
		transform: translateY(-20vh);
	}

	.content {
		// width: 70vw;
		padding: 6rpx 40rpx;
		height: 78rpx;
		border: 4rpx solid $ThemeLightColor;
		box-shadow: 3rpx 3rpx 10rpx $ThemeDark5Color;
		background-color: $ThemeDark3Color;
		border-radius: 24rpx;
		@include centering;
		font-size: 28rpx;
		color: $FontWhite;
	}
}
</style>
