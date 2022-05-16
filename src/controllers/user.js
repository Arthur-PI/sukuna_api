const db = require("../database");
const {create_token} = require("./security");


const login = (req, res) => {
	const {email, password} = req.body;
	if (!email || !password)
		return res.status(403).send("Error: login or password props missing");
	db.check_user(email, password).then((data) => {
		if (data.valid_passwd) {
			const token = create_token(data.data.name, email);
			return res.status(200).json({email: email, name: data.data.name, token: token});
		} else
			return res.status(400).send("Error: Connection refused");
	}).catch((err) => {
		console.log(err);
		return res.status(400).send("Error: can't check user in database");
	});
};

const register = (req, res) => {
	const {email, password, name} = req.body;
	if (!email || !password || !name)
		return res.status(400).send("Error: at least one props is missing");
	db.check_user(email, password).then((data) => {
		if (data.exists)
			return res.status(400).send("Error: User already exists");
		db.add_user(email, password, name).then((data) => {
			data.token = create_token(data.name, data.email);
			return res.status(200).json(data);
		});
	}).catch((err) => {
		console.log(err);
		return res.status(400).json({message: "Error: server mysql error"});
	});
};

module.exports = {login, register};
