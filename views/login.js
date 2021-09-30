$(function(){
    
    var $logForm = $("#loginForm")
    $.validator.addMethod("noSpace", function(value, element){
        return value == '' || value.trim().length !=0
    }, "Los espacios no están permitidos");
  

    if($logForm.length){
        $logForm.validate({
            rules:{
                correo:{
                    required: true,
                    email: true
                },
                password:{
                    required: true,
                    noSpace: true,
                }
            },
            messages:{
                correo:{
                    required: 'Favor de llenar el campo E-Mail',
                    email: "Favor de mandar una entrada correcta para E-Mail"
                },
                password:{
                    required: 'Favor de llenar el campo Contraseña'
    
                }
            }
        })
    }

})