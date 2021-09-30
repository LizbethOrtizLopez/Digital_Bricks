$(function(){
    
    var $registerForm = $("#registration")
    $.validator.addMethod("noSpace", function(value, element){
        return value == '' || value.trim().length !=0
    }, "Los espacios no están permitidos");
    $.validator.addMethod("minLength", function(value, element){
        return value == '' || value.length > 7 
    }, "Se necesita un tamaño mínimo de 8");
    
    if($registerForm.length){
        $registerForm.validate({
            rules:{
                nombres:{
                    required: true,
                    noSpace: true
                },
                apellidos:{
                    required: true,
                    noSpace: true

                },
                correo:{
                    required: true,
                    email: true
                },
                password:{
                    required: true,
                    noSpace: true,
                    minLength: true
                },
                passwordConfirm:{
                    required: true,
                    equalTo:'#password'
                },
                username:{
                    required: true,
                    noSpace: true
                },
                edad:{
                    required: true,
                    noSpace: true,
                    number: true
                }

            },
            messages:{
                nombres:{
                    required: 'Favor de llenar el campo Nombre'
                },
                apellidos:{
                    required: 'Favor de llenar el campo Apellido'
                },
                correo:{
                    required: 'Favor de llenar el campo E-Mail',
                    email: "Favor de mandar una entrada correcta para E-Mail"

                },
                password:{
                    required: 'Favor de llenar el campo Contraseña'
    
                },
                passwordConfirm:{
                    required: 'Favor de llenar el campo Confirmar Contraseña',
                    equalTo: 'Favor de mandar la misma contraseña'

                },
                username:{
                    required: 'Favor de llenar el campo Usuario'
                },
                edad:{
                    required: 'Favor de llenar el campo Edad',
                    number: "Favor de ingresar un número"
                }
            }
        })
    }


})