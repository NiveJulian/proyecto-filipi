$(document).ready(function(){
    buscar_pre();
    var funcion;
    var edit=false;
    $('#form-crear-presentacion').submit(e=>{
        let nombre_presentacion = $('#nombre_presentacion').val();
        let id_editado = $('#id_editar_pre').val();
        if(edit==false){
            funcion="crear";
        }
        else{
            funcion="editar";
        }
        
        $.post('../controladores/presentacionController.php',{nombre_presentacion,funcion},(response)=>{
            console.log(response);
            if(response=='add'){
                    $('#add-presentacion').hide('slow');
                    $('#add-presentacion').show(1000);
                    $('#add-presentacion').hide(2000);
                    $('form-crear-presentacion').trigger('reset');
                    buscar_pre();
            }
            if(response=='noadd'){
                $('#noadd-presentacion').hide('slow');
                $('#noadd-presentacion').show(1000);
                $('#noadd-presentacion').hide(2000);
                $('form-crear-presentacion').trigger('reset');
            }
            if(response=='edit'){
                    $('#edit-presentacion').hide('slow');
                    $('#edit-presentacion').show(1000);
                    $('#edit-presentacion').hide(2000);
                    $('form-crear-presentacion').trigger('reset');
                    buscar_pre();
            }
            edit=false;
        });
        e.preventDefault();
    });
    function buscar_pre(consulta){
        funcion='buscar';
        $.post('../controladores/presentacionController.php',{consulta,funcion},(response)=>{
            const presentaciones = JSON.parse(response);
            let template= '';
            presentaciones.forEach(presentacion => {
                template+=`
                    <tr preId="${presentacion.id}" preNombre="${presentacion.nombre}" >
                        <td>${presentacion.nombre}</td>
                        <td>
                            <button class="editar-pre btn btn-success float-right m-1" title="Editar Presentacion" type="button" data-toggle="modal" data-target="#crearpresentacion"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="borrar-pre btn btn-danger float-right m-1" title="Eliminar Presentacion"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
            $('#presentaciones').html(template);
        });
    }
    $(document).on('keyup', '#buscar-presentacion', function(){
        let valor = $(this).val();
        if(valor!=''){
            buscar_pre(valor);
        }
        else{
            buscar_pre();
        }
    })
    $(document).on('click', '.borrar-pre', (e)=>{
        funcion = "borrar";
        const elemento = $(this)[0].activeElement.parentElement.parentElement;
        const id = $(elemento).attr('preId');
        const nombre = $(elemento).attr('preNombre');
        console.log(elemento)

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger mr-2'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Estas seguro?',
            text: "No vas a ver mas este articulo ["+nombre+"]!",
            imageWidth: 100,
            imageHeight: 100,
            showCancelButton: true,
            confirmButtonText: 'Si, Borralo porfa!',
            cancelButtonText: 'No, Cancela!',
            reverseButtons: true
          }).then((result) => {
            if (result.value) {
                $.post('../controladores/presentacionController.php',{id,funcion}, (response)=>{
                    edit=false;
                    if(response=='borrado'){
                        swalWithBootstrapButtons.fire(
                            'Borrado!',
                            'La presentacion '+nombre+' fue borrado.',
                            'success'
                        )
                        buscar_pre();
                    }
                    else{
                        swalWithBootstrapButtons.fire(
                            'No se pudo borrar!',
                            'la presentacion ['+nombre+'] no fue borrado.',
                            'error'
                        )
                    }
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                'Tu articulo esta a salvo :)',
                'error'
              )
            }
          })
    });
    
    $(document).on('click', '.editar-pre', (e)=>{
        const elemento = $(this)[0].activeElement.parentElement.parentElement;
        const id = $(elemento).attr('predId');
        const nombre = $(elemento).attr('preNombre');

        $('#id_editar_pre').val(id);
        $('#nombre_presentacion').val(nombre);
        edit=true;
    });

})