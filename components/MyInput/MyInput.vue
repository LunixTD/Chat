<template>
	<view class="default" :style="inputStyle">
		<i class="iconfont icon-search" :class="`icon-${icon}`" v-if="icon"></i>
		<input
			class="myinput"
			:type="type"
			:placeholder="placeholder"
			:maxlength="maxlength !== undefined ? maxlength : 88"
			:style="{ paddingRight: useClear == undefined ? '30rpx' : '', paddingLeft: icon == undefined ? '30rpx' : '0rpx' }"
			:value="inputValue"
			@input="changeValue"
		/>
		<i class="iconfont icon-error" :style="clearIconStyle" v-if="useClear != undefined && inputValue" @click="clear"></i>
		<view class="btn" v-if="btn && btn != ''" @click="onBtnClick">
			<text>搜索</text>
		</view>
	</view>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, defineExpose } from 'vue';
const { modelValue, type, model, placeholder, btn, btnClick, useClear, inputStyle, icon, clearIconStyle, onInput, maxlength, value } = defineProps([
	'modelValue',
	'type',
	'model',
	'placeholder',
	'btn',
	'btnClick',
	'useClear',
	'inputStyle',
	'icon',
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
	emit('update:modelValue', e.detail.value);
}
watch(
	() => modelValue,
	(newVal) => {
		// console.log(3423);
		inputValue.value = newVal;
	},
	{ deep: true, immediate: true }
);

function clear() {
	inputValue.value = '';
	emit('update:modelValue', inputValue.value);
}

function onBtnClick() {
	btnClick && btnClick();
}

defineExpose({ clear });
</script>
<script>
export default {
	options: {
		virtualHost: true
	}
};
</script>
<style lang="scss">
.default {
	position: relative;
	width: 100%;
	height: auto;
	@include centering;
	align-items: center;
	border-radius: 10rpx;
	background-color: $ThemeDark5Color;
	font-size: 26rpx;
	overflow: hidden;
	// padding: 0 6rpx;
	.myinput {
		// width: 100%;
		flex: 2;
		height: 80rpx;
		// padding: 0 30rpx;
		padding-left: 30rpx;
		font-size: inherit;
		margin: 0 auto;
	}
	.iconfont {
		width: 80rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		color: $FontWhite;
	}
	.btn {
		display: block;
		width: 100rpx;
		// height: 100%;
		font-size: 28rpx;
		text-align: center;
		background-color: $ThemePrimaryColor;
		@include centering;
		align-self: stretch;
		letter-spacing: 10rpx;
		text-indent: 10rpx;
	}
}
</style>
