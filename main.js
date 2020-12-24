import Vue from 'vue'
import App from './App'
import uniRequest from 'uni-request';
import api from './plugins/api.js'
import store from './stroe/index.js'
uniRequest.defaults.baseURL = 'https://smart.sctsjkj.com'; //正式地址
// uniRequest.defaults.baseURL = 'http://fd.sctsjkj.com:5080'; //正式地址
uniRequest.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
uniRequest.defaults.headers.put['Content-Type'] = 'application/json; charset=UTF-8';
// 响应拦截
uniRequest.interceptors.response.use(function(response) {

	return Promise.resolve(response.data);
}, function(error) {
	return Promise.reject(error);
});

Vue.prototype.$api = api;
Vue.prototype.$http = uniRequest;
Vue.prototype.$store = store;
Vue.prototype.$url = 'https://smart.sctsjkj.com'; // 全局服务器地址


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
