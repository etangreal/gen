
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var superagent 	= require('superagent');
var expect 		= require('expect.js');

// ------------------------------------------------------------------------------------------------
// TESTS
// ------------------------------------------------------------------------------------------------

describe('REST API SERVICE', function() {

	// ----------------------------------------------------------------------------------------------
	// declarations
	// ----------------------------------------------------------------------------------------------
	
	var id;

	// ----------------------------------------------------------------------------------------------
	// tests
	// ----------------------------------------------------------------------------------------------

	// it('post a object(message)', function(done) {

	// 	superagent.post('http://localhost:8080/message')

	// 	.send({
	// 		msg: 'HELLO',
	// 		type: 'INIT',
	// 		token: null,
	// 		error: null
	// 	})

	// 	.end(function(err,res) {
	// 		//console.log(res.body)
	// 		expect(err).to.eql(null)

	// 		expect(res.body.length).to.eql(1)
	// 		expect(res.body[0]._id.length).to.eql(24)
	// 		id = res.body[0]._id
	// 		done()
	// 	});

	// })//post

	// --------------------------------------------------------------------------------------------

	// it('retrieves an object', function(done) {

	// 	superagent.get('http://localhost:3000/message/'+id)

	// 		.end(function(err, res) {
	// 			// console.log(res.body)
	// 			expect(err).to.eql(null)

	// 			expect(typeof res.body).to.eql('object')
	// 			expect(res.body._id.length).to.eql(24)        
	// 			expect(res.body._id).to.eql(id)        
	// 			done()
	// 		})

	// })//retrieves an object

	// ----------------------------------------------------------------------------------------------

	// it('retrieves a object', function(done) {

	// 	superagent.get('http://localhost:8080/message')

	// 	.end(function(e, res) {
	// 		// console.log(res.body)
	// 		expect(e).to.eql(null)

	// 		expect(res.body.length).to.be.above(0)
	// 		expect(res.body.map(function (item){return item._id})).to.contain(id)
	// 		done()
	// 	})

	// })//retrieves a collection

	// ----------------------------------------------------------------------------------------------

	// it('updates an object', function(done) {

	// 	superagent.put('http://localhost:8080/message/'+id)

	// 		.send({
	// 			msg: 'HELLO',
	// 			type: 'INIT',
	// 			token: null,
	// 			error: null
	// 		})

	// 		.end(function(e, res) {
	// 			// console.log(res.body)
	// 			expect(e).to.eql(null)

	// 			expect(typeof res.body).to.eql('object')
	// 			expect(res.body.msg).to.eql('success')      
	// 			done()
	// 		})

	// })//updates an object

	// ----------------------------------------------------------------------------------------------

	// it('checks an updated object', function(done) {

	// 	superagent.get('http://localhost:8080/message/'+id)

	// 	.end(function(e, res) {
	// 		// console.log(res.body)
	// 		expect(e).to.eql(null)

	// 		expect(typeof res.body).to.eql('object')
	// 		expect(res.body._id.length).to.eql(24)
	// 		expect(res.body._id).to.eql(id)
	// 		expect(res.body.name).to.eql('Peter')
	// 		done()
	// 	})

	// })//checks an updated object

	// ----------------------------------------------------------------------------------------------

	// it('removes an object', function(done) {

	// 	superagent.del('http://localhost:8080/message'+id)

	// 		.end(function(e, res) {
	// 			// console.log(res.body)
	// 			expect(e).to.eql(null)

	// 			expect(typeof res.body).to.eql('object')
	// 			expect(res.body.msg).to.eql('success')
	// 			done()
	// 		})

	// })//removes an object

	// ----------------------------------------------------------------------------------------------

});//describe 'express rest api server'

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------