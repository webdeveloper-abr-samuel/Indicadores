import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

//URL base de nuestra API
axios.defaults.baseURL = 'http://localhost:3003/INDICADORES';

createApp(App).use(store).use(router).use(VueAxios, axios).mount('#app')
