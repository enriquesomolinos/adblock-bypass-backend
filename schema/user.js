module.exports = {
	"id": "User",
	"properties": {
		"name": {
			"type": "string",
			"description": "Full name of the user"
		},
		"description": {
			"type": "string",
			"description": "User description"
		},
		"email": {
			"type": "string",
			"description": "Email of the client"
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