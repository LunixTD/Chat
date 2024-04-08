const state = {
	activeIndex: null
}

const mutations = {
	changeActiveIndex(state, index) {
		state.activeIndex = index
	},
}

const actions = {
	// changeProfile({
	// 	commit
	// }, profile) {
	// 	commit('changeProfile', profile)
	// }
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}