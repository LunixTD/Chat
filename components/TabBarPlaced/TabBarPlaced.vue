<template>
	<view class="tabbarPlaced"></view>
</template>

<script setup></script>

<style lang="scss">
.tabbarPlaced {
	width: 100vw;
	height: calc(#{$TabbarHeight} + constant(safe-area-inset-bottom));
	height: calc(#{$TabbarHeight} + env(safe-area-inset-bottom));
	// background-color: red;
}
</style>
