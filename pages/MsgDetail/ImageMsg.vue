<template>
	<view class="msg">
		<image
			:src="api.target_url + imgInfo.thumb"
			:style="msgImgStyle"
			:mode="imgMode"
			class="msgImg"
			@load="onImgLoaded"
			@click="previewImage(api.target_url + imgInfo.url)"
		></image>
	</view>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import api from '../../services/request.js';
import { useStore } from 'vuex';
const { item, msgIndex } = defineProps(['item', 'msgIndex']);
const { imgInfo } = item;

// console.log(item);
const store = useStore();
// const imgSrc = computed(() => {

// })
// // #ifndef H5
// const src = imgInfo.thumb;
// // #endif
// // #ifdef H5
// const src = api.target_url + imgInfo.thumb;
// // #endif

// console.log(src);

// 计算图片样式
const imgMode = ref('widthFix');
const msgImgStyle = computed(() => {
	const { width, height } = imgInfo;
	let retWidth = 0;
	let retHeight = 0;
	let rate = width / height;
	if (width > height) {
		imgMode.value = 'widthFix';
		if (width < uni.upx2px(400)) {
			retWidth = width + 'rpx';
			retHeight = 'auto';
		} else {
			retWidth = '400rpx';
			retHeight = 400 / rate + 'rpx';
		}
	} else if (width < height) {
		imgMode.value = 'heightFix';
		if (height <= uni.upx2px(400)) {
			retHeight = height + 'rpx';
			retWidth = 'auto';
		} else {
			retHeight = '400rpx';
			retWidth = 400 * rate + 'rpx';
		}
	} else {
		if (width <= uni.upx2px(400)) {
			retWidth = width + 'rpx';
			retHeight = height + 'rpx';
		} else {
			retWidth = '400rpx';
			retHeight = '400rpx';
		}
	}
	return {
		width: retWidth,
		height: retHeight
	};
});

function previewImage(src) {
	// 预览图片
	uni.previewImage({
		urls: [src],
		longPressActions: {
			itemList: ['发送给朋友', '保存图片', '收藏'],
			success: function (data) {
				console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
			},
			fail: function (err) {
				console.log(err.errMsg);
			}
		}
	});
}

function onImgLoaded() {
	uni.$emit('updateVirtualListHeight', msgIndex);
}
</script>

<style lang="scss">
.msg {
	width: 100%;
	min-height: 40rpx;
	line-height: 40rpx;
	vertical-align: middle;
	font-size: 0;
	.content {
		font-size: 30rpx;
		line-height: 42rpx;
		display: block;
		word-break: break-all;
		white-space: pre-line;
	}

	// 图片
	.msgImg {
		// max-width: 580rpx;
		// max-height: 300rpx;
		vertical-align: middle;
	}
}
</style>
