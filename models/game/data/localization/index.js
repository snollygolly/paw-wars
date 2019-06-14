const defaultLocale = "en_US";

const locales = {
	en_US: require("./en_US")
};

module.exports = (phrase, data, locale = defaultLocale) => {
	return locales[locale][phrase](data);
};
