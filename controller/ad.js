var BaseController = require("./basecontroller"),
  swagger = require("swagger-node-restify")



function Ad() {

}

Ad.prototype = new BaseController()

module.exports = function(lib) {
  var controller = new Ad()

//list
  controller.addAction({
  	'path': '/ad',
  	'method': 'GET',
  	'summary' :'Returns the list of ad',
  	'params': [ swagger.queryParam('q', 'Search parameter', 'string')],
  	'responseClass': 'Ad',
  	'nickname': 'getAd'
  }, function(req, res, next) {
    console.log(req)
	var criteria = {}
    if(req.params.q) {
      var expr = new RegExp('.*' + req.params.q + '.*', 'i')
      criteria.$or = [
        {name: expr},
        {description: expr}
      ]
    }
   
    findAd()
    

    function findAd(adIds) {
    	if(adIds) {
    		criteria.id = {$in: bookIds}

    	}
		lib.db.model('Ad')
	  		.find(criteria)
	  		.exec(function(err, ad) {
	  			if(err) {
	  				
	  				return next(controller.RESTError('InternalServerError', err))
	  			}
	  			controller.writeHAL(res, ad)
	  		})
    }
  	
  })
  //get
  controller.addAction({
  	'path': '/ad/{id}',
  	'summary': 'Returns all the data from one specific ad',
  	'method': 'GET',
  	'responseClass': 'Ad',
  	'nickname': 'getAd'
  }, function (req, res, next) {
  	var id = req.params.id

  	if(id) {
  		lib.db.model('Ad')
  			.findOne({_id: id})
  			.exec(function(err, ad) {
	  			if(err) return next(controller.RESTError('InternalServerError', err))
	  			if(!ad) {
	  				return next(controller.RESTError('ResourceNotFoundError', 'Ad not found'))
	  			}
	  			controller.writeHAL(res, ad)
  			})
  	} else {
  		next(controller.RESTError('InvalidArgumentError', 'Missing author id'))
  	}
  })

  //post

  controller.addAction({
  	'path': '/ad',
  	'summary': 'Adds a new ad to the database',
  	'method': 'POST',
  	'params': [swagger.bodyParam('ad', 'JSON representation of the data', 'string')],
  	'responseClass': 'Ad',
  	'nickname': 'addAd'
  }, function (req, res, next) {
  	var body = req.body

  	if(body) {
  		var newAd = lib.db.model('Ad')(body)
  		newAd.save(function(err, ad) {
			if(err) return next(controller.RESTError('InternalServerError', err))
			controller.writeHAL(res, ad)
		})
  	} else {
  		next(controller.RESTError('InvalidArgumentError', 'Missing author id'))
  	}
  })

  //put

  controller.addAction({
  	'path': '/ad/{id}',
  	'method': 'PUT',
  	'summary': "UPDATES an ad's information",
  	'params': [swagger.pathParam('id','The id of the ad','string'), 
  				swagger.bodyParam('ad', 'The new information to update', 'string')],
  	'responseClass': 'Ad',
  	'nickname': 'updateAd'
  }, function (req, res, next) {
  	var data = req.body
  	var id = req.params.id
  	if(id) {
  		
  		lib.db.model("Ad").findOne({_id: id}).exec(function(err, ad) {
	 		if(err) return next(controller.RESTError('InternalServerError', err))
	        if(!ad) return next(controller.RESTError('ResourceNotFoundError', 'Ad not found'))
		  		ad = _.extend(ad, data)
		  		ad.save(function(err, data) {
			 		if(err) return next(controller.RESTError('InternalServerError', err))
            controller.writeHAL(res, data)
		  		})
  		})
  	} else {
  		next(controller.RESTError('InvalidArgumentError', 'Invalid id received'))
  	}
  })

  



  return controller
}
