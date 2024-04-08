<template>
	<view class="listItem">
		<view :class="lastMsg._id == item._id && canUsePushAnime ? 'lastItemAnime' : ''">
			<MsgListItem :item="item" :msgIndex="index" :msgStyle="getMsgStyle(index)"></MsgListItem>
		</view>
	</view>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { useStore } from 'vuex';
import MsgListItem from '@/pages/MsgDetail/MsgListItem.vue';

const store = useStore();
const { item, index } = defineProps(['item', 'index']);
const canUsePushAnime = computed(() => {
	return store.state.ui.canUsePushAnime;
});
const lastMsg = computed(() => {
	return store.state.message.lastMsg;
});

function getMsgStyle(msgIndex) {
	// if (typeof msgIndex !== 'number') return;
	if (msgIndex === 0) return 'newMsgWithDateLine';
	return 'newMsg';
}
</script>

<style lang="scss">
.listItem {
	transform: scaleY(-1);
}
.lastItemAnime {
	animation: lastItemAnim forwards ease 0.3s;
}
@keyframes lastItemAnim {
	0% {
		opacity: 0;
		transform: translateY(20rpx) scale(0.9);
	}
	100% {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}
</style>
