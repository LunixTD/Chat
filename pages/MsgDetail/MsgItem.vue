<template></template>

<script setup>
import { defineProps, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { emojiList } from '@/static/map/sourceUri.js';
import api from '../../services/request.js';
const store = useStore();

const { item } = defineProps(['item']);
const { type, voiceData, imgData, content } = item;

// // #ifndef H5
// const src = imgData.url;
// // #endif
// // #ifdef H5
// const src = api.targetUrl + imgData.url;
// // #endif

// console.log(api.targetUrl + imgData.url);
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
