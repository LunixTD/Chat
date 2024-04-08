<template>
	<TouchBox renderType="listItem">
		<view class="modalListItem" @click="onItemClick" :style="icon ? 'paddingLeft: 0' : ''">
			<view class="leftBox">
				<view class="iconBox" v-if="icon">
					<i class="iconfont" :class="`icon-${icon}`"></i>
				</view>
				<view class="itemTitleBox">
					<text class="title" :style="`color: ${color}`">{{ title }}</text>
					<text class="subTitle" v-if="subTitle">{{ subTitle }}</text>
				</view>
			</view>
			<view class="switchBox" :style="switchScaleRate" v-if="modelValue !== undefined">
				<!-- style="transform: scale(1.6)" -->
				<switch :color="variable.BtnPrimaryColor" :checked="switchState" @change="onSwitchChange"></switch>
			</view>
			<i class="divider" v-if="divider">
				<i class="content"></i>
			</i>
		</view>
	</TouchBox>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue';
import variable from '@/styles/variable.js';
import { useSystemInfo } from '@/utils/hooks/useSystemInfo.js';
import { transform } from 'lodash';

const { modelValue, title, subTitle, onClick, color, icon, divider } = defineProps(['modelValue', 'title', 'subTitle', 'onClick', 'color', 'icon', 'divider']);
const emit = defineEmits(['update:modelValue']);

const switchScaleRate = computed(() => {
	const rate = 88 / 820;
	const realWidth = useSystemInfo('screenWidth').value * rate;
	const realRate = realWidth / 50;
	// console.log(realWidth);
	return {
		transform: `scale(${realRate})`,
		marginRight: `${(realWidth - 50) / 2}px`
	};
});

const switchState = ref(false);
function onItemClick() {
	if (modelValue != undefined) {
		switchState.value = !switchState.value;
		emit('update:modelValue', switchState.value);
	}
	if (onClick != undefined) {
		onClick();
	}
}

function onSwitchChange(e) {
	emit('update:modelValue', e.detail.value);
}
watch(
	() => modelValue,
	(newVal) => {
		switchState.value = newVal;
	},
	{ immediate: true }
);
</script>

<style lang="scss">
.modalListItem {
	position: relative;
	width: 100%;
	height: 100rpx;
	// background-color: $ThemeDarkPop;
	// border: 1rpx solid $ThemeDarkPop;
	@include centering;
	justify-content: space-between;
	padding: 0 20rpx;
	&.hover {
		background-color: rgba($ThemeDark4Color, 0.1);
	}

	.leftBox {
		@include centering;
		.iconBox {
			@include centering;
			width: 100rpx;
			height: 100rpx;
			.iconfont {
				font-size: 45rpx;
			}
		}
		.itemTitleBox {
			flex: 1;
			@include centering;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			.title {
				font-size: 30rpx;
				margin: 2rpx 0;
			}
			.subTitle {
				font-size: 24rpx;
				color: $FontGrey;
				margin: 2rpx 0;
			}
		}
	}

	.switchBox {
		@include centering;
		// justify-content: flex-end;
		align-items: flex-end;
		// width: 100rpx;
		// transform: scale(1.37);
		// padding-right: 8rpx;
	}

	// 分隔线
	.divider {
		display: block;
		position: absolute;
		bottom: -0.5rpx;
		right: 0;
		width: calc(100% - 16rpx);
		height: 1rpx;
		// padding-left: 16rpx;
		.content {
			display: block;
			width: 100%;
			height: 100%;
			background-color: rgba($FontGrey, 0.1);
		}
	}
}
</style>
