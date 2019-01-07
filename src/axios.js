import axios from 'axios'
import router from './router/index'
import store from './store/index'
import * as types from './store/types'

//
axios.default.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/json'

const instance = axios.create();
instance.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use = instance.interceptors.request.use
instance.interceptors.request.use(config => {
	if(localStorage.getItem('token')) {
		config.headers.Authorization = `token ${localStorage.getItem('token')}`
			.replace(/(^\")|(\"$)/g, '')
	}
	return config
}, err => {
	return Promise.reject(err)
})
// axios拦截响应
instance.interceptors.response.use(response => {
	return response
}, err => {
	return Promise.reject(err)
})

export default {
	// 用户注册
	userRegister(data) {
		return instance.post('/api/register', data)
	},
	// 用户登录
	UserLogin(data) {
		return instance.post('/api/login', data)
	},
	// 获取用户
	getUser() {
		return instance.get('/api/user')
	},
	// 删除用户
	delUser(data) {
		return instance.post('/api/delUser', data)
	},
	addBook(data) {
		return instance.post('/api/addBook', data)
	},
	allBooks(data) {
		return instance.post('/api/allBooks', data)
	},
	getBook(data) {
		return instance.post('/api/getBook', data)
	},
	addProblem(data) {
		return instance.post('/api/addProblem', data)
	},
	allProblems(data) {
		return instance.post('/api/allProblems', data)
	},
	getProblem(data) {
		return instance.post('/api/getProblem', data)
	},
	filteredProblems(data) {
		return instance.post('api/filteredProblems', data)
	},
	deleteProblem(data) {
		return instance.post('api/deleteProblem', data)
	},
	deleteBook(data) {
		return instance.post('api/deleteBook', data)
	},
	editProblem(data) {
		return instance.post('api/editProblem', data)
	},
	changeFavourite(data) {
		return instance.post('api/changeFavourite', data)
	},
	getPDF(data) {
		return instance.post('api/getPDF', data)
	}
}
