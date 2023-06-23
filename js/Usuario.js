$(document).ready(function(){
    var funcion = '';
    var id_usuario = $('#id_usuario').val();
    var edit = false;
    buscar_usuarios(id_usuario);
    function buscar_usuarios(dato) {
        funcion='buscar_usuario';
        $.post('../controladores/UsuariosController.php', {dato,funcion},(response)=>{
            let nombre= '';
            let apellido= '';
            let edad= '';
            let dni= '';
            let tipo= '';
            let telefono= '';
            let localidad= '';
            let correo= '';
            let sexo= '';
            let adicional= '';
            const usuario = JSON.parse(response);
            nombre+=`${usuario.nombre}`;
            apellido+=`${usuario.apellido}`;
            edad+=`${usuario.edad}`;
            dni+=`${usuario.dni}`;
            if(usuario.tipo=='root'){
                tipo+=`<h1 class="badge badge-danger ml-2">${usuario.tipo}</h1>`;
            }
            if(usuario.tipo=='vendedor'){
                tipo+=`<h1 class="badge badge-warning ml-2">${usuario.tipo}</h1>`;
            }
            if(usuario.tipo=='administrador'){
                tipo+=`<h1 class="badge badge-info ml-2">${usuario.tipo}</h1>`;
            }
            telefono+=`${usuario.telefono}`;
            localidad+=`${usuario.localidad}`;
            correo+=`${usuario.correo}`;
            sexo+=`${usuario.sexo}`;
            adicional+=`${usuario.adicional}`;
            $('#nombre_us').html(nombre);
            $('#apellido_us').html(apellido);
            $('#edad_us').html(edad);
            $('#dni_us').html(dni);
            $('#us_tipo').html(tipo);
            $('#telefono_us').html(telefono);
            $('#localidad_us').html(localidad);
            $('#correo_us').html(correo);
            $('#sexo_us').html(sexo);
            $('#adicional_us').html(adicional);
            $('#avatar3').attr('src',usuario.avatar);
            $('#avatar2').attr('src',usuario.avatar);
            $('#avatar1').attr('src',usuario.avatar);
        })
    }
    $(document).on('click', '.edit', (e)=>{
        funcion='capturar_datos';
        edit = true;
        $.post('../controladores/UsuariosController.php', {funcion,id_usuario}, (response)=>{
            const usuario = JSON.parse(response);
            $('#telefono').html(usuario.telefono);
            $('#localidad').val(usuario.localidad);
            $('#correo').val(usuario.correo);
            $('#sexo').val(usuario.sexo);
            $('#adicional').val(usuario.adicional);
        });
    })
    $('#form-usuario').submit(e=>{
        if(edit==true){
            let telefono=$('#telefono').val();
            let localidad=$('#localidad').val();
            let correo=$('#correo').val();
            let sexo=$('#sexo').val();
            let adicional=$('#adicional').val();
            funcion='editar_usuario';
            $.post('../controladores/UsuariosController.php',{id_usuario,funcion,telefono,localidad,correo,sexo,adicional},(response)=>{
                if(response=='editado'){
                    $('#editado').hide('slow');
                    $('#editado').show(1000);
                    $('#editado').hide(2000);
                    $('#form-usuario').trigger('reset');
                }
                edit=false;
                buscar_usuarios(id_usuario);
            })
            
        }
        else{
            $('#noeditado').hide('slow');
                    $('#noeditado').show(1000);
                    $('#noeditado').hide(2000);
                    $('#form-usuario').trigger('reset');
        }
        e.preventDefault();
    });
    $('#form-pass').submit(e=>{
        let oldpass=$('#oldpass').val();
        let newpass=$('#newpass').val();
        funcion='cambiar_contra';
        $.post('../controladores/UsuariosController.php',{id_usuario,funcion,oldpass,newpass}, (response)=>{
            if(response=='update'){
                $('#update').hide('slow');
                $('#update').show(1000);
                $('#update').hide(2000);
                $('#form-pass').trigger('reset');
            }
            else{
                $('#noupdate').hide('slow');
                $('#noupdate').show(1000);
                $('#noupdate').hide(2000);
                $('#form-pass').trigger('reset');
            }
        })
        e.preventDefault()
    })
    $('#form-photo').submit(e=>{
        let formData = new FormData($('#form-photo')[0]);
        $.ajax({
            url:'../controladores/UsuariosController.php',
            type:'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false
        }).done(function(response){
            
            const json = JSON.parse(response);
            if(json.alert=='edit') {
                $('#avatar1').attr('src',json.ruta);
                $('#edit').hide('slow');
                $('#edit').show(1000);
                $('#edit').hide(5000);
                $('#form-photo').trigger('reset');
                buscar_usuarios();
            }
            else{
                $('#noedit').hide('slow');
                $('#noedit').show(1000);
                $('#noedit').hide(2000);
                $('#form-photo').trigger('reset');
                buscar_usuarios();
            }
        });
        e.preventDefault();
    })


})