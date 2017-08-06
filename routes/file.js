// ****************
// Import Libraries
// ****************
const express 				= require('express')
const router 				= new express.Router()
const formidable 			= require('formidable')
const mime 					= require('mime')
const fs 					= require('fs')
const os 					= require('os')
const compression 			= require('compression')

const config				= require('../config')

// **************
// Use compression
// **************
router.use(compression())

// **************
// Define Routers
// **************
router.post('/file', function(req, res, next) {
	console.log("File POST called!")
	var form 			= new formidable.IncomingForm()

    form.uploadDir 		= os.tmpdir()
    form.maxFieldsSize 	= 10 * 1024 * 1024
    form.parse(req)

    form.on('field', function(name, val){
    	// console.log("field Name: " + name + "  Value: " + val)
    }).on('fileBegin', function(name, file) {
    	console.log("File Name: " + file.name + " | File Size: ", file)
	}).on('progress', function(bytesReceived, bytesExpected) {
		console.log("bytesReceived: " + bytesReceived + " bytesExpected: " + bytesExpected)
	}).on('file', function(fields, file) {

    	var src
	    var dest
	    var targetPath
	    var targetName
	    var tempPath = file.path
	    
	    // get the mime type of the file
	    var type = file.type

	    // get file extension
	    var extension = file.name.split(/[. ]+/).pop()

	    console.log('type:', type)
	    console.log('extension:', extension)

	    // Set new path to file
	    require('crypto').randomBytes(48, function(err, buffer){
          	
          	var filename = buffer.toString('hex')
	    	targetPath = 'static/file/' + filename +'.'+ extension

	    	
		    // using read stream API to read file
		    src = fs.createReadStream(tempPath)
		    console.log(tempPath)
		  
		    // using a write stream API to write file
		    dest = fs.createWriteStream(targetPath)
		    src.pipe(dest)

		    // Show error
		    src.on('error', function(err) {
		        if (err) {
		            return res.status(500).json({
		            	success: false,
		            	message: err.message
		            })
		        }
		    })

		    src.on('end', function(){
		    	console.log('End!')
		        return res.status(200).json({
		        	success: true,
		            message: "File is uploaded",
		            data:{
		            	filename: filename + '.' + extension,
		            	url: config.serverUri + '/file/' + filename + '.' + extension
		            }
		        })		
		    })
		})
  	}).on('error', function(err) {
		return res.status(500).json({
			success: false,
			message: err.message
		})
	}).on('aborted', function () {
		console.log("Aborted by user!")
	})
})

router.get('/file/:file', function(req, res, next) {  
    try {
    	var contentType = mime.lookup(req.params.file)
	  	var file = fs.readFileSync('./static/file/'+ req.params.file)
	  	

    	res.writeHead(200, {'Content-Type': contentType })
    	res.end(file, 'binary')
	} catch (err) {
		console.log(err)
	  	if (err.code === 'ENOENT') {
			return res.status(404).json({
				success: false,
				message: 'File not found!'
			})
		} else {
			return res.status(500).json({
				success: false,
				message: err.message
			})
		}
	}
    
})

router.delete('/file/:file', function(req, res, next){
	fs.unlink('./static/file/' + req.params.file , (err) => {
		if (err) {
			if (err.code === 'ENOENT') {
				return res.status(404).json({
					success: false,
					message: 'File not found!'
				})
			} else {
				return res.status(500).json({
					success: false,
					message: err.message
				})
			}
		}
		return res.status(200).json({
	  		success: true,
	  		message: 'File deleted successfully!'
	  	})
	})
})
// **************
// Define Routers
// **************


// *************
// Export Router
// *************
module.exports = router

