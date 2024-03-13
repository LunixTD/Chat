<template>
	<view class="initContainer">
		<HeaderPlaced></HeaderPlaced>
		<text class="text">为自己取一个昵称吧~</text>
		<MyInput v-model="nickname" :inputStyle="inputStyle" maxlength="20" :onInput="onInput"></MyInput>
		<text class="alert" :class="showState ? 'show' : 'hide'">{{ altText }}</text>
		<view class="btn" @click="onClick">确认</view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
import api from '@/services/request.js';
const inputStyle = {
	width: '70vw',
	height: '100rpx',
	textAlign: 'center'
};
const store = useStore();

const token = computed(() => {
	return store.state.user.token;
});

const text1 = '该昵称已经被使用!';
const text2 = '昵称不能为空!';
const altText = ref(text1);
const nickname = ref('');
const showState = ref(false);
async function onClick() {
	if (nickname.value == '') {
		altText.value = text2;
		showState.value = true;
	}
	const checkRes = await api.checkUser({
		nickname: nickname.value
	});
	if (checkRes.data.code !== 200) {
		altText.value = text1;
		showState.value = true;
	} else {
		console.log('设置昵称成功');
		const profile = uni.getStorageSync('profile');
		const updateRes = await api.asyncUserProfile({
			id: profile._id,
			data: {
				nickname: nickname.value
			}
		});
		// 确保用户初始化设置后再存入token
		if (updateRes) {
			uni.setStorageSync('token', token.value);
		}
		uni.navigateTo({
			url: '/pages/Main/Main',
			animationType: 'zoom-fade-out',
			animationDuration: 240
		});
		// console.log(updateRes);
	}
}
function onInput() {
	showState.value = false;
}
</script>

<style lang="scss">
.initContainer {
	width: 100vw;
	height: 100vh;
	padding: 0 30rpx;
	@include centering;
	justify-content: flex-start;
	flex-direction: column;
	text-align: center;
	.text {
		display: block;
		font-size: 42rpx;
		margin-top: 140rpx;
		margin-bottom: 50rpx;
	}
	.alert {
		color: orangered;
		font-size: 28rpx;
		margin-top: 12rpx;
		opacity: 0;
		&.show {
			opacity: 1;
		}
		&.hide {
			opacity: 0;
		}
	}
	.btn {
		width: 70vw;
		height: 88rpx;
		line-height: 88rpx;
		background-color: $ThemePrimaryColor;
		margin-top: 20rpx;
		border-radius: 6rpx;
		font-size: 30rpx;
	}
}
</style>
