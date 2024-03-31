<template>
	<view class="globalMask" :class="showState"></view>
</template>

<script setup>
import { defineProps } from 'vue';
const { showState } = defineProps(['showState']);
</script>
<script>
export default {
	options: {
		virtualHost: true
	}
};
</script>
<style lang="scss">
.globalMask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
	background-color: black;
	&.show {
		animation: modalMaskShow 0.4s ease forwards;
	}
	&.hide {
		animation: modalMaskHide 0.4s ease forwards;
	}
	@keyframes modalMaskShow {
		0% {
			opacity: 0;
			z-index: 99;
		}
		100% {
			opacity: 0.6;
			z-index: 99;
		}
	}
	@keyframes modalMaskHide {
		0% {
			opacity: 0.6;
			z-index: 99;
		}
		99% {
			opacity: 0;
			z-index: 99;
		}
		100% {
			z-index: -1;
		}
	}
}
</style>
