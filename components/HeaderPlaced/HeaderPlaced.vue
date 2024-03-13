<template>
	<view class="HeaderBox" :style="headerStyle"></view>
</template>

<script setup>
import { useStatusBarHeightStyle } from '@/utils/hooks/useStatusBarHeightStyle.js';
const headerStyle = useStatusBarHeightStyle(88);
</script>

<style lang="scss">
.HeaderBox {
	width: 100vw;
	// height: calc(88rpx + var(--status-bar-height));
	// background-color: blue;
}
</style>
