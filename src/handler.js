const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading
	} = request.payload;

	const id = nanoid(16);

	let finished = null;
	if (pageCount === readPage) {
		finished = true;
	} else {
		finished = false;
	};

	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt
	};
	console.log(name);
	if (!name) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku'
		});
		response.code(400);
		return response;
	}
	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
		});
		response.code(400);
		return response;
	}

	books.push(newBook);
	console.log(books);
	const isSuccess = books.filter((b) => b.id === id).length > 0;
	if (isSuccess) {
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil ditambahkan',
			data: {
				bookId: id
			}
		});
		response.header('Access-Control-Allow-Origin', '*');
		response.code(201);
		return response;
	} else {

		const response = h.response({

			status: 'fail',

			message: 'Buku gagal ditambahkan',

		});

		response.header('Access-Control-Allow-Origin', '*');

		response.code(500);

		return response;
	}
}

const getAllBookHandler = (request, h) => {
	const {
		reading,
		finished,
		name
	} = request.query;

	let filter = books;
	if (name !== undefined) {
		filter = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
	}
	if (reading !== undefined) {
		filter = books.filter((book) => book.reading === (reading === '1'));
	}

	if (finished !== undefined) {
		filter = books.filter((book) => book.finished === (finished === '1'));
	}
	const response = h.response({
		status: 'success',
		data: {
			books: filter.map((book) => ({
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			})),
		},
	});
	response.code(200);
	return response;
};

const getBooksByIdHandler = (request, h) => {
	const { bookId } = request.params;

	const book = books.filter(book => book.id == bookId)[0];

	if (book) {
		return {
			status: 'success',
			data: {
				book,
			},
		};
	} else {
		const response = h.response({
			status: 'fail',
			message: 'Buku tidak ditemukan',
		});
		response.code(404);
		return response;
	}
}

const editBooksByIdHandler = (request, h) => {
	const { bookId } = request.params;

	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading
	} = request.payload;

	const book = books.filter(b => b.id === bookId)[0];

	if (!name) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	} else if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
		})
		response.code(400);
		return response;
	} else if (book == undefined) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Id tidak ditemukan'
		})
		response.code(404);
		return response;
	} else {
		const updatedAt = new Date().toString();
		const index = books.findIndex((book) => book.id === bookId)
		books[index] = {
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			updatedAt
		};
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil diperbarui'
		});
		response.code(200);
		return response;
	}
};

const deleteBookbyIdHandler = (request, h) => {
	const { bookId } = request.params;

	const index = books.findIndex((book) => book.id == bookId);
	const book = books.filter(book => book.id == bookId)[0];
	if (!book) {
		const response = h.response({
			status: 'fail',
			message: 'Buku gagal dihapus. Id tidak ditemukan'
		})
		response.code(404);
		return response;
	} else {
		if (index !== -1) {
			books.splice(index, 1);
			const response = h.response({
				status: 'success',
				message: 'Buku berhasil dihapus'
			})
			response.code(200);
			return response;
		}
	}
};

module.exports = {
	addBookHandler,
	getAllBookHandler,
	getBooksByIdHandler,
	editBooksByIdHandler,
	deleteBookbyIdHandler
};