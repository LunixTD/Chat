<template>
	<view class="statusBarBox" :style="statusBarBoxStyle"></view>
</template>

<script setup>
import { useStatusBarHeightStyle } from '@/utils/hooks/useStatusBarHeightStyle.js';
const statusBarBoxStyle = useStatusBarHeightStyle();
// console.log(statusBarBoxStyle.value);
</script>

<style lang="scss">
.statusBarBox {
	width: 100vw;
	background-color: red;
}
</style>
