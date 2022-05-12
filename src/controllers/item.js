const db = require("../database");
const {is_blank} = require("../utils");

const get_items = (req, res) => {
	db.fetch_items().then((data) => {
		return res.status(200).json(data);
	}).catch((err) => {
		console.log(err);
		return res.status(400).send("Error: can't get items from database");
	});
};

const add_item = (req, res) => {
	const item = {
		title: req.body.title,
		cover: req.body.cover,
		publication_date: new Date(req.body.publication_date),
		summary: req.body.summary,
		collection_id: req.body.collection_id
	};
	for (const el of Object.values(item))
		if (is_blank(el)) return res.status(402).send("Error: invalid props");

	db.create_item(item).then((data) => {
		return res.status(200).json(data);
	}).catch((err) => {
		console.log(err);
		return res.status(400).send("Error: could not add the item to the database");
	});
};

// get_collection
// get_item_by_id
// get_collection_items
// get_collection_info
// add_collection

module.exports = {get_items, add_item}
