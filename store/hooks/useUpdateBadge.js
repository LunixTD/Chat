import {
	computed
} from 'vue'
import {
	useStore
} from 'vuex'


export function useUpdateBadge(tabName, num) {
	const store = useStore();
	switch (tabName) {
		case 'server':
			store.commit('ui/updateBadgeNum', num)
			break;
		case 'msg':
			store.commit('ui/updateMsgNum', num)
			break;
		case 'notice':
			store.commit('ui/updateNoticeNum', num)
			break;
	}
}