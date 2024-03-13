<template>
	<view class="msg">
		<rich-text class="content" :nodes="getContentHtml(content)"></rich-text>
	</view>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { useStore } from 'vuex';
import api from '@/services/request.js';

const store = useStore();

const { item } = defineProps(['item']);
const { content } = item;

const emojiList = computed(() => {
	return store.state.chat.emojiList;
});

// 文本消息(处理文本)
function getContentHtml(content) {
	let reg = /(?<=\[)[^\]]*(?=\])/g;
	const matchList = content.match(reg);
	if (matchList !== null) {
		let emojiArr = [];
		for (let i = 0; i < matchList.length; i++) {
			let emojiKey = matchList[i];
			if (emojiList.value[emojiKey] != undefined) {
				emojiArr.push(emojiKey);
			}
		}
		emojiArr = [...new Set(emojiArr)];
		for (let j = 0; j < emojiArr.length; j++) {
			let emojiName = emojiArr[j];
			const regStr = '\\[' + emojiName + '\\]';
			const emojiReg = new RegExp(regStr, 'g');
			// console.log(emojiList.value[emojiName]);
			content = content.replace(emojiReg, getImgTagStr(api.target_url + emojiList.value[emojiName]));
		}
	}
	return content;
}

// 获取emoji的html文本
function getImgTagStr(src) {
	const pxNum = uni.upx2px(52);
	const lineHNum = uni.upx2px(40);
	const margin = uni.upx2px(12);
	return `<img style="display: inline-block;width: ${pxNum}px;height: ${pxNum}px;margin-bottom: -${margin}px; " class="emojiImg"  src="${src}" mode="widthFix"></img>`;
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
}
</style>
