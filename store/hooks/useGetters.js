import {
	computed
} from 'vue';
import {
	useStore,
	mapGetters
} from 'vuex';

export default function useGetters(mapper) {
	const store = useStore()
	const fns = mapGetters(mapper)

	const storeState = {}
	Object.keys(fns).forEach(fnkey => {
		const fn = fns[fnkey].bind({
			$store: store
		})
		storeState[fnkey] = computed(fn)
	})
	return storeState
}