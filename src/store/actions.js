import api from '../axios'
import Vue from 'vue'
import router from '../router/index'
import vuex from 'vuex'
import * as types from './types'

var getBooks = function(username) {
	var books = [];
	let obj = {user: username};
	api.allBooks(obj).then(({
		data
	}) => {
		if (data.code == 401) {
			console.log('token');
			
		} else {
			data.forEach(book => {
				books.push(book);
			});
		}
		// console.log(books);
	});
	// setTimeout(() => {
	// 	api.allBooks(obj).then(({
	// 		data
	// 	}) => {
	// 		if (data.code == 401) {
	// 			console.log('token');
				
	// 		} else {
	// 			data.forEach(book => {
	// 				books.push(book);
	// 			});
	// 		}
	// 		// console.log(books);
	// 	});
	// }, 200);
	return books;
}

var getProblems = function(collection_id) {
	var problems = []
	let obj = {collections: collection_id};
	api.allProblems(obj).then(({
		data
	}) => {
		if (data.code == 401) {
			console.log('token');
			
		} else {
			data.forEach(problem => {
				problems.push(problem);
				// console.log(data);
			});
		}
	});
	return problems;
}

export default {
	UserLogin({ commit }, data) {
		commit(types.LOGIN, data)
	},

	UserLogout({ commit }) {
		commit(types.LOGOUT)
	},

	UserName({ commit }, data) {
		commit(types.USERNAME, data)
	},

	AddBook({ commit }, book) {
		// api modify data
		let obj = {
			name: book.name,
			user: book.user
		};
		api.addBook(obj).then(({
			data
		}) => {
			if (data.success) {
				let books = getBooks(book.user);
				commit(types.GETBOOKS, books);
			}
		});
	},

	DeleteBook({ commit }, book) {
		// api modify data
		api.deleteBook(book).then(({
			data
		}) => {
			if (data.success) {
				let books = getBooks(book.user);
				commit(types.GETBOOKS, books);
			}
		});
	},

	GetBooks({ commit }, data) {
		//api get data
		let books = getBooks(data);
		commit(types.GETBOOKS, books);
	},

	GetBook({ commit }, data) {
		api.getBook(data).then(({
			data
		}) => {
			if (data.code == 401) {
				console.log('token');
				
			} else {
				commit(types.GETBOOK, data)
			}
		})
	},

	AddProblem({ commit }, data) {
		let problem = {
			title: data.title,
			problem: data.problem,
			answer: data.answer,
			photo: data.photo,
			date: data.date,
			favourite: data.favourite,
			collections: data.collections
		};
		api.addProblem(problem);
		let problems = getProblems(data.collections);
		commit(types.GETPROBLEMS, problems);
	},

	GetProblems({ commit }, data) {
		let problems = getProblems(data);
		commit(types.GETPROBLEMS, problems);
	}
}
