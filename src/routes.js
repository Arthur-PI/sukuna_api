/** source/routes/posts.ts */
const express = require('express');
const router = express.Router();

const user = require('./controllers/user');
const collection = require('./controllers/collection');
const item = require('./controllers/item');
const security = require("./controllers/security");

// router.get('/posts', posts.getPosts);
router.post('/login', user.login);
router.post('/register', user.register);

router.post('/collection', security.verify_token, collection.add_collection);
router.get('/collections', collection.get_collections);
router.get('/collection/:collectionId', collection.get_collection_by_id);

router.post('/item', security.verify_token, item.add_item);
router.get('/item', item.add_item);
router.get('/items', item.get_items);

module.exports = router;
