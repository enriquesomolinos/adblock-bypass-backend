var BaseController = require("./basecontroller"),
  swagger = require("swagger-node-restify")



function User() {

}

User.prototype = new BaseController()

module.exports = function(lib) {
  var controller = new User()

//list
  controller.addAction({
  	'path': '/user',
  	'method': 'GET',
  	'summary' :'Returns the list of users',
  	'params': [ swagger.queryParam('q', 'Search parameter', 'string')],
  	'responseClass': 'User',
  	'nickname': 'getUser'
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
    

    function findAd(userIds) {
    	if(userIds) {
    		criteria.id = {$in: bookIds}

    	}
		lib.db.model('user')
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
  	'path': '/user/{id}',
  	'summary': 'Returns all the data from one specific user',
  	'method': 'GET',
  	'responseClass': 'user',
  	'nickname': 'getUser'
  }, function (req, res, next) {
  	var id = req.params.id

  	if(id) {
  		lib.db.model('User')
  			.findOne({_id: id})
  			.exec(function(err, user) {
	  			if(err) return next(controller.RESTError('InternalServerError', err))
	  			if(!user) {
	  				return next(controller.RESTError('ResourceNotFoundError', 'Ad not found'))
	  			}
	  			controller.writeHAL(res, user)
  			})
  	} else {
  		next(controller.RESTError('InvalidArgumentError', 'Missing author id'))
  	}
  })

  //post

  controller.addAction({
  	'path': '/user',
  	'summary': 'Adds a new user to the database',
  	'method': 'POST',
  	'params': [swagger.bodyParam('user', 'JSON representation of the data', 'string')],
  	'responseClass': 'User',
  	'nickname': 'addUser'
  }, function (req, res, next) {
  	var body = req.body

  	if(body) {
  		var newUser = lib.db.model('User')(body)
  		newUser.save(function(err, user) {
			if(err) return next(controller.RESTError('InternalServerError', err))
			controller.writeHAL(res, user)
		})
  	} else {
  		next(controller.RESTError('InvalidArgumentError', 'Missing author id'))
  	}
  })

  //put

  controller.addAction({
  	'path': '/user/{id}',
  	'method': 'PUT',
  	'summary': "UPDATES an user's information",
  	'params': [swagger.pathParam('id','The id of the user','string'), 
  				swagger.bodyParam('user', 'The new information to update', 'string')],
  	'responseClass': 'User',
  	'nickname': 'updateUser'
  }, function (req, res, next) {
  	var data = req.body
  	var id = req.params.id
  	if(id) {
  		
  		lib.db.model("user").findOne({_id: id}).exec(function(err, user) {
	 		if(err) return next(controller.RESTError('InternalServerError', err))
	        if(!user) return next(controller.RESTError('ResourceNotFoundError', 'User not found'))
		  		user = _.extend(user, data)
		  		user.save(function(err, data) {
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
