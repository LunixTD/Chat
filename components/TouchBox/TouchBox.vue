<template>
	<view class="touchBox" :class="renderType == 'btn' ? 'btn' : ''" :style="[touch == '' ? startStyle : endStyle, customStyle]" @touchstart="touchStart" @touchend="touchEnd">
		<slot></slot>
	</view>
</template>

<script setup>
import { defaults } from 'lodash';
import { ref, defineProps, computed, render, nextTick } from 'vue';
import variable from '@/styles/variable.js';
const touch = ref('');
const timer = ref(null);
const touching = ref(false);
const { customStyle, touchStartStyle, touchEndStyle, renderType, color } = defineProps(['customStyle', 'touchStartStyle', 'touchEndStyle', 'renderType', 'color']);
const { BtnPrimaryColor, BtnPrimaryPressColor } = variable;

let tmpColor = '';
let tmpPressColor = '';
switch (color) {
	case 'red':
		tmpColor = variable.red;
		tmpPressColor = variable.redDark;
		break;
	case 'grey':
		tmpColor = variable.grey;
		tmpPressColor = variable.greyLight;
		break;
	default:
		tmpColor = BtnPrimaryColor;
		tmpPressColor = BtnPrimaryPressColor;
		break;
}
const initStartStyle = computed(() => {
	let tmpBgColor = null;
	if (renderType == 'btn') {
		tmpBgColor = tmpColor;
	} else if (renderType == 'listItem') {
		tmpBgColor = variable.ThemeDarkPop;
	}
	return {
		backgroundColor: tmpBgColor
	};
});
const initEndStyle = computed(() => {
	let tmpBgPressColor = null;
	let scaleNum = 1;
	if (renderType == 'btn') {
		scaleNum = 0.97;
		tmpBgPressColor = tmpPressColor;
	} else if (renderType == 'listItem') {
		tmpBgPressColor = variable.listItemPressBg;
	}
	return {
		backgroundColor: tmpBgPressColor,
		transform: `scale(${scaleNum})`
	};
});
const startStyle = computed(() => {
	return touchStartStyle != undefined ? touchStartStyle : initStartStyle.value;
});
const endStyle = computed(() => {
	return touchEndStyle != undefined ? touchEndStyle : initEndStyle.value;
});

function touchStart() {
	if (timer.value !== null) {
		return;
	}
	touching.value = true;
	touch.value = 'touch';
	timer.value = setTimeout(() => {
		timer.value = null;
		if (touching.value == false) {
			touch.value = '';
		}
	}, 300);
}
function touchEnd() {
	nextTick(() => {
		touching.value = false;
		if (timer.value === null) {
			touch.value = '';
		}
	});
}
</script>
<script>
export default {
	options: {
		virtualHost: true
	}
};
</script>
<style lang="scss">
.touchBox {
	width: 100%;
	transition: all ease 0.2s;
}
.btn {
	height: 80rpx;
	// line-height: 40rpx;
	border-radius: 40rpx;
	font-size: 26rpx;
	background-color: $ThemePrimaryColor;
	padding: 0 30rpx;
	// text-align: center;
	overflow: hidden;
	@include centering;
}
</style>
