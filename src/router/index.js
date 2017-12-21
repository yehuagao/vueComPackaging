import Vue from 'vue'
import VueRouter from 'vue-router'

import homeComponent from '../components/home/home.vue'
import searchComponent from '../components/search/search.vue'

Vue.use(VueRouter)

const router = new VueRouter({
	routes: [{
		path: '/',
		name: 'home',
		component: homeComponent
	},
	{
		path: '/search',
		name: 'search',
		component: searchComponent
	},
	]
})

export default router