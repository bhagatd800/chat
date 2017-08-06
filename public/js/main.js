$(document).ready( function() {
  	$(document).on('change', '.btn-file :file', function() {
    	var input = $(this),
    	label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    	input.trigger('fileselect', [label]);
  	});

	$('.btn-file :file').on('fileselect', function(event, label) {
    	var input = $(this).parents('.input-group').find(':text'),
        log = label;
    
    	if( input.length ) {
        	input.val(log);
    	} else {
        	if( log ) console.log(log);
    	}
	});
	function readURL(input) {
		console.log('read URL');
    	if (input.files && input.files[0]) {
        	var reader = new FileReader();
        	reader.onload = function (e) {
        		// console.log();
                var contentType = input.files[0].type;

            	$('#profile-pic').attr('src', e.target.result);

                var myFormData = new FormData();
                myFormData.append('image', input.files[0]);

                var request = jQuery.ajax({
                  type: 'POST',
                  url: '/file',
                  data: myFormData,
                  processData: false,
                  contentType: false, 
                  dataType: 'json'
                }).done(function(data) {
                    if (data.success) {
                        $.ajax({
                            contentType: 'application/json',
                            data: JSON.stringify({
                                profilePic: data.data
                            }),
                            dataType: 'json',
                            success: function(data){
                                console.log("success")
                            },
                            error: function(){
                                console.log("error")
                            },
                            processData: false,
                            type: 'POST',
                            url: '/setting'
                        });
                    }
                    console.log(data)
                })
        	}
        	reader.readAsDataURL(input.files[0]);
    	}
	}

	$("#imgInp").change(function(){
    	readURL(this);
	});   
});