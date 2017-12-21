import Vue from 'vue';
import router from '../../router/index';
import axios from 'axios';
import http from '../../utils/HttpClient.js';

const state = {
	data:'test'
}

const mutations = {
	login: (data, formData) => {
		console.log('测试脚手架')
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