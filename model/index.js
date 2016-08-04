

module.exports = function(db) {
	return {
		/*"Ad": require("./ad"),		
		"User": require("./user")*/		
		"Ad": require("./ad")(db),		
		"User": require("./user")(db)
	}
}