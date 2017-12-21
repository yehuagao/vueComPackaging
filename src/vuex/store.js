import Vue from 'vue'
import Vuex from 'vuex'
import home from '../components/home/home.js'
import search from '../components/search/search.js'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        home,
        search
    }
})