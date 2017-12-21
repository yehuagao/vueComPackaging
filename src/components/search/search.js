
const state = {
	searchData:'6666'
}

const mutations = {
	login: (data, formData) => {
		console.log('测试轮子')
	}
}

const actions = {
	login: (events, formData) => {
		events.commit('login', formData)
	}
}

export default {
	state,
	mutations,
	actions
}