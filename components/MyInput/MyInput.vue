<template>
	<view class="default">
		<input
			class="myinput"
			:type="type"
			:placeholder="placeholder"
			:maxlength="maxlength !== undefined ? maxlength : 88"
			:style="{ ...inputStyle, paddingRight: clearIconStyle == undefined ? '30rpx' : '' }"
			:value="inputValue"
			@input="changeValue"
		/>
		<i class="iconfont icon-error" :style="clearIconStyle" v-if="clearIconStyle && inputValue" @click="clearInput"></i>
	</view>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
const { modelValue, type, model, placeholder, inputStyle, clearIconStyle, onInput, maxlength, value } = defineProps([
	'modelValue',
	'type',
	'model',
	'placeholder',
	'inputStyle',
	'clearIconStyle',
	'onInput',
	'maxlength',
	'value'
]);
const emit = defineEmits(['update:modelValue']);
const inputValue = ref('');

function changeValue(e) {
	if (onInput !== undefined) {
		onInput(model);
	}
	inputValue.value = e.detail.value;
	emit('update:modelValue', inputValue.value);
}
watch(
	() => modelValue,
	(newVal) => {
		inputValue.value = newVal;
	},
	{ immediate: true }
);

function clearInput() {
	inputValue.value = '';
	emit('update:modelValue', inputValue.value);
}
</script>

<style lang="scss">
.default {
	position: relative;
	width: 100%;
	// @include centering;
	.myinput {
		width: 100%;
		height: 80rpx;
		border-radius: 10rpx;
		padding-left: 30rpx;
		padding-right: 80rpx;
		font-size: 26rpx;
		margin: 0 auto;
		background-color: $ThemeDark3Color;
	}
	.iconfont {
		position: absolute;
		top: 0;
		right: 0;
		width: 80rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: $FontWhite;
	}
	.itemtextarea {
		width: 100%;
		height: 360rpx;
		border-radius: 10rpx;
		padding: 20rpx 30rpx;
		font-size: 26rpx;
		background-color: $ThemeDark3Color;
	}
	.lastletter {
		position: absolute;
		bottom: 20rpx;
		right: 30rpx;
		font-size: 26rpx;
	}
}
</style>
