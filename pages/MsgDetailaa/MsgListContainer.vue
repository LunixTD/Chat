<template>
	<!-- #ifdef APP-NVUE -->
	<list>
		<slot></slot>
	</list>
	<!-- #endif -->
	<!-- #ifndef APP-NVUE -->
	<scroll-view scroll-y="true">
		<slot></slot>
	</scroll-view>
	<!-- #endif -->
</template>

<script setup></script>

<style lang="scss"></style>
