<template>
	<view class="tabbarPlaced" :style="placedStyle"></view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSafeAreaBottomStyle } from '@/utils/hooks/useStatusBarHeightStyle.js';
import variable from '@/styles/variable.js';
const placedStyle = useSafeAreaBottomStyle(variable.TabbarHeight);
</script>

<style lang="scss">
.tabbarPlaced {
	width: 100vw;
	// height: calc(#{$TabbarHeight} + constant(safe-area-inset-bottom));
	// height: calc(#{$TabbarHeight} + env(safe-area-inset-bottom));
	// background-color: red;
}
</style>
