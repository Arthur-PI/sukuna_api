const {is_blank} = require("../utils");
const db = require("../database");

const add_collection = (req, res) => {
	const collection = {
		name: req.body.name,
		summary: req.body.summary,
		author: req.body.author,
		editor: req.body.editor,
		category: req.body.category
	};
	for (const el of Object.values(collection)) {
		if (is_blank(el)) return res.status(402).send("Error: invalid props");
	}
	db.create_collection(collection).then((data) => {
		return res.status(200).json(data);
	}).catch((err) => {
		console.log(err);
		return res.status(400).send("Error: can't create a new collection");
	});
};

const get_collections = (req, res) => {
	db.fetch_collections().then((data) => {
		return res.status(200).json(data);
	}).catch((err) => {
		console.log(err);
		return res.status(400).send("Error: could not fetch the collections from database");
	});
};

const get_collection_by_id = (req, res) => {
	const id = req.params.collectionId;
	db.fetch_collection_by_id(id).then((data) => {
		return res.status(200).json(data);
	}).catch((err) => {
		console.log(err);
		return res.status(400).send("Error: couldn't fetch collection informations from database");
	});
};

module.exports = {add_collection, get_collections, get_collection_by_id};
