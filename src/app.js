import Vue from 'vue';
import store from './vuex/store';
import router from './router/';
import App from './App.vue';
import Mint from 'mint-ui';

Vue.use(Mint);

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App)
})