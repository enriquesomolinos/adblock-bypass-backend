module.exports = {
	"id": "Ad",
	"properties": {
		"name": {
			"type": "string",
			"description": "Name of the ad"
		},
		"description": {
			"type": "string",
			"description": "Description of the ad"
		},
		"type": {
			"type": "string",
			"description": "Type of the ad"
		},
		"original_code": {
			"type": "string",
			"description": "Original ad text. This is the original code."
		},
		"generated_code": {
			"type": "string",
			"description": "This is the adblock-bypass code to introduce in your web."
		},
		"user": {
			"type": "object",
			"$ref": "User",
			"description": "The user who submits the ad"

		},
		"enabled": {
			"type": "boolean",
			"description": "Determines if the ad is enabled"

		},
		"creation_date": {
			"type":"date",
			"description": "When the ad is created"
		},

	}
}