import {
	computed
} from 'vue';
import {
	useStore,
	createNamespacedHelpers
} from 'vuex';

export function useState(module, mapper) {
	const {
		mapState
	} = createNamespacedHelpers(module)
	const store = useStore()
	const fns = mapState(mapper)
	const storeState = {}
	Object.keys(fns).forEach(fnkey => {
		const fn = fns[fnkey].bind({
			$store: store
		})
		storeState[fnkey] = computed(fn)
	})
	return storeState
}