const state = {
	profile: {},
	token: ''
}

const mutations = {
	changeProfile(state, profile) {
		// console.log(profile);
		state.profile = profile
	},
	setToken(state, token) {
		state.token = token
	}
}

const actions = {
	changeProfile({
		commit
	}, profile) {
		commit('changeProfile', profile)
	},
	setToken({
		commit
	}, token) {
		commit('setToken', token)
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}