import * as types from './types'

const mutations = {
	[types.LOGIN]: (state, data) => {
		localStorage.setItem('token', data)
		// localStorage.token = data
		state.token = data
	},
	[types.LOGOUT]: (state) => {
		localStorage.removeItem('token');
		state.token = null;
		state.books = [];
		state.problems = [];
		state.book = null;
	},
	[types.USERNAME]: (state, data) => {
		localStorage.setItem('username', data)
		state.username = data
	},
	[types.GETBOOKS]: (state, data) => {
		state.books = data
	},
	[types.GETBOOK]: (state, data) => {
		state.book = data
	},
	[types.GETPROBLEMS]: (state, data) => {
		state.problems = data
	}
}
export default mutations
