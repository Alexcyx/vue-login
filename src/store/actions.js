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

	AddBook({ commit }, data) {
		// api modify data
		let book = {
			name: data.name,
			user: data.user
		};
		api.addBook(book);
		let books = getBooks(data.user);
		commit(types.GETBOOKS, books)
	},

	DeleteBook({ commit }, data) {
		// api modify data
		console.log(data);
		api.deleteBook(data);
		let books = getBooks(data.user);
		console.log(books);
		commit(types.GETBOOKS, books)
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
