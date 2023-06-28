const {
	addBookHandler,
	getAllBookHandler,
	getBooksByIdHandler,
	editBooksByIdHandler,
	deleteBookbyIdHandler
} = require('./handler');

const routes = [
	{
		method: 'POST',
		path: '/books',
		handler: addBookHandler,
	},
	{
		method: 'GET',
		path: '/books',
		handler: getAllBookHandler
	},
	{
		method: 'GET',
		path: '/books/{bookId}',
		handler: getBooksByIdHandler
	},
	{
		method: 'PUT',
		path: '/books/{bookId}',
		handler: editBooksByIdHandler
	},
	{
		method: 'DELETE',
		path: '/books/{bookId}',
		handler: deleteBookbyIdHandler
	}
]

module.exports = routes;