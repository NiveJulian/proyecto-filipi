$(document).ready(function(){
    buscar_tip();
    var funcion;
    $('#form-crear-tipo').submit(e=>{
        let nombre_tipo = $('#nombre_tipo').val();
        funcion="crear";
        $.post('../controladores/tipoController.php',{nombre_tipo, funcion},(response)=>{
            console.log(response);
            if (response=='add'){
                    $('#add-tipo').hide('slow');
                    $('#add-tipo').show(1000);
                    $('#add-tipo').hide(2000);
                    $('form-crear-tipo').trigger('reset');
                    buscar_tip();
            }
            if(response=='noadd'){
                    $('#noadd-tipo').hide('slow');
                    $('#noadd-tipo').show(1000);
                    $('#noadd-tipo').hide(2000);
                    $('form-crear-tipo').trigger('reset');
            }
        });
        e.preventDefault();
    });
    function buscar_tip(consulta){
        funcion='buscar';
        $.post('../controladores/tipoController.php',{consulta,funcion},(response)=>{
            const tipos = JSON.parse(response);
            let template= '';
            tipos.forEach(tipo => {
                template+=`
                    <tr tipId="${tipo.id}" tipNombre="${tipo.nombre}">
                        <td>${tipo.nombre}</td>
                        <td>
                            <button class="editar-tip btn btn-success float-right m-1" title="Editar Tipo" type="button" data-toggle="modal" data-target="#creartipo"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="borrar-tip btn btn-danger float-right m-1" title="Eliminar Tipo"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            })
            $('#tipos').html(template);
        });
    }
    $(document).on('keyup', '#buscar-tipo', function(){
        let valor = $(this).val();
        if(valor!=''){
            buscar_tip(valor);
        }
        else{
            buscar_tip();
        }
    })

    $(document).on('click', '.borrar-tip', (e)=>{
        funcion = "borrar";
        const elemento = $(this)[0].activeElement.parentElement.parentElement;
        const id = $(elemento).attr('tipId');
        const nombre = $(elemento).attr('tipNombre');

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
                $.post('../controladores/tipoController.php',{id,funcion}, (response)=>{
                    edit=false;
                    if(response=='borrado'){
                        swalWithBootstrapButtons.fire(
                            'Borrado!',
                            'El articulo '+nombre+' fue borrado.',
                            'success'
                        )
                        buscar_tip();
                    }
                    else{
                        swalWithBootstrapButtons.fire(
                            'No se pudo borrar!',
                            'El articulo ['+nombre+'] no fue borrado.',
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
    $(document).on('click', '.editar-tip', (e)=>{
        const elemento = $(this)[0].activeElement.parentElement.parentElement;
        const id = $(elemento).attr('tipId');
        const nombre = $(elemento).attr('tipNombre');
        
        $('#id_editar_tip').val(id);
        $('#nombre_tipo').val(nombre);

        edit=true;
    });
})