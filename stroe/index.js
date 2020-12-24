import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state:{
		 userInfo:{},//全局用户信息
		 haslogin:false,//是否登录
		 firewaringred:false,
	},
	mutations:{
		login(state,userdata){
			state.haslogin = true;
			state.userInfo = userdata;
			uni.setStorage({//将数据存储在本地缓存中指定的key中，这是异步
				key:'userInfo',
				data:userdata
			})
		},
		isread(state,status){
			state.firewaringred = status
		},
		logout(state){
			state.haslogin = false;
			state.userInfo ={}
			uni.removeStorage({//从本地缓存中异步移除指定key
				key:'userInfo'
			})
		}
	}
})
export default store