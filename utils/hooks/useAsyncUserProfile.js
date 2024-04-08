import {
	ref
} from 'vue'
import api from '@/services/request.js'
import store from '@/store/index.js'

export async function asyncUserProfile(actionName, data) {
	switch (actionName) {
		case 'changeServer':
			break;
		case 'changeChannel':
			break;
		case 'updateStorage':
			asyncUserProfileStorage(data)
			break;
		case 'updateLocal':
			asyncUserProfileLocal(data)
			break;
		case 'updateProfile':
			asyncUserProfileLocal(data)
			return await asyncUserProfileServer(data)
			break;
	}
}

function asyncUserProfileStorage(data) {
	const profile = uni.getStorageSync('profile');
	uni.setStorageSync('profile', {
		...profile,
		...data
	})
}

function asyncUserProfileLocal(data) {
	const profile = uni.getStorageSync('profile');
	uni.setStorageSync('profile', {
		...profile,
		...data
	})
	store.commit('user/changeProfile', {
		...profile,
		...data
	})
}

async function asyncUserProfileServer(data) {
	const profile = uni.getStorageSync('profile');
	const updateRes = await api.asyncUserProfile({
		id: profile._id,
		data: data
	});
	return updateRes
}