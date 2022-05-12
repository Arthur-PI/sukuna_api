const is_blank = (str) => {
	return (!str || /^\s*$/.test(str));
};

module.exports = {is_blank};
