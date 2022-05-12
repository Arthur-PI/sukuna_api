const mysql = require("mysql");
const bcrypt = require("bcrypt");
const {is_blank} = require("./utils");

const con = mysql.createConnection({
	socketPath: "/tmp/mysql.sock",
	host: "localhost",
	user: "sukuna",
	password: "20_fingers",
	database: "sukuna_library"
});
con.connect((err) => {
	if (err) throw err;
	console.log("Connected");
});

const check_user = (email, password) => {
	return new Promise((resolve, reject) => {
		con.query("SELECT * FROM users WHERE email = ?", [email], (err, res) => {
			if (err) reject(err);
			const user = {
				exists: false,
				valid_passwd: false
			};
			if (res.length !== 1)
				return resolve(user);
			user.exists = true;
			user.data = res[0];
			if (bcrypt.compareSync(password, user.data.hash_passwd)) {
				user.valid_passwd = true;
				resolve(user);
			} else resolve(user);
		});
	});
};



const add_user = (email, password, name) => {
	return new Promise((resolve, reject) => {
		if (is_blank(email) || is_blank(password) || is_blank(name))
			reject("Error: no empty props allowed");
		const hash_passwd = bcrypt.hashSync(password, 5);
		const sql = "INSERT INTO users (email, hash_passwd, name) VALUES (?, ?, ?)"
		con.query(sql, [email, hash_passwd, name], (err, res) => {
			if (err) reject(err);
			resolve({email, password, name});
		});
	});
}

const fetch_items = () => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM items i JOIN collections c ON i.collection_id = c.collection_id";
		con.query(sql, (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
	});
};

const create_collection = (collection) => {
	return new Promise((resolve, reject) => {
		const sql = "INSERT INTO collections (name, summary, author, editor, category) VALUES (?, ?, ?, ?, ?)";
		con.query(sql, [collection.name, collection.summary, collection.author, collection.editor, collection.category], (err, res) => {
			if (err) reject(err);
			collection.id = res.insertId;
			resolve(collection);
		});
	});
};

const fetch_collections = () => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM collections";
		con.query(sql, (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
	});
};

const create_item = (item) => {
	return new Promise((resolve, reject) => {
		const sql = "INSERT INTO items (title, cover, publication_date, summary, collection_id) VALUES (?, ?, ?, ?, ?)";
		con.query(sql, [item.title, item.cover, item.publication_date, item.summary, item.collection_id], (err, res) => {
			if (err) return reject(err);
			item.id = res.insertId;
			resolve(item);
		});
	});
};

const fetch_collection_by_id = (id) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM collections c JOIN items i ON c.collection_id = i.collection_id WHERE c.collection_id = ?";
		con.query(sql, [id], (err, res) => {
			if (err) return reject(err);
			resolve(res);
		});
	});
};

module.exports = {check_user, add_user, fetch_items, create_collection, fetch_collections, create_item, fetch_collection_by_id};
