$(document).ready(function(){
    buscar_cliente();
    var funcion;
    $('#form-crear-cliente').submit(e=>{

        let nombre=$('#nombre').val();
        let apellido=$('#apellido').val();
        let telefono=$('#telefono').val();
        let correo=$('#correo').val();
        let razonsocial=$('#razon_social').val();
        let adicional=$('#adicional').val();
        funcion='crear';
        $.post('../controladores/ClienteController.php',{nombre,apellido,telefono,correo,razonsocial,adicional,funcion}, (response)=>{
            
            if (response=='add'){
                $('#add-cli').hide('slow');
                $('#add-cli').show(1000);
                $('#add-cli').hide(2000);
                $('#form-crear-clientee').trigger('reset');
                buscar_cliente();
            }
            if(response=='noadd'){
                    $('#noadd-cli').hide('slow');
                    $('#noadd-cli').show(1000);
                    $('#noadd-cli').hide(2000);
                    $('#form-crear-cliente').trigger('reset');
                    
            }
        })
        e.preventDefault();
    });
    function buscar_cliente(consulta){
        funcion="buscar";
        $.post('../controladores/ClienteController.php',{consulta,funcion}, (response)=>{
           const clientes = JSON.parse(response);
           let template='';
           clientes.forEach(cliente => {
                template+=`
                    <div cliId="${cliente.id}" cliNombre="${cliente.nombre}" cliTelefono="${cliente.telefono}" cliCorreo="${cliente.correo}" cliRazon="${cliente.razonsocial}" cliAdicional="${cliente.adicional}" cliAvatar="${cliente.avatar}" class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column">
                        <div class="card bg-light d-flex flex-fill">
                            <div class="card-header text-muted border-bottom-0">
                                <h1 class="badge badge-success">cliente</h1>
                            </div>
                            <div class="card-body pt-0">
                                <div class="row">
                                    <div class="col-7">
                                    <h2 class="lead"><b>${cliente.nombre}</b></h2>
                                    <ul class="ml-4 mb-0 fa-ul text-muted">
                                        <li class="small"><span class="fa-li"><i class="fas fa-lg fa-building"></i></span> Razon Social: ${cliente.razonsocial}</li>
                                        <li class="small"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span> Telefono #: ${cliente.telefono}</li>
                                        <li class="small"><span class="fa-li"><i class="fas fa-lg fa-at"></i></span> Correo: ${cliente.correo}</li>
                                    </ul>
                                    </div>
                                    <div class="col-5 text-center">
                                    <img src="${cliente.avatar}" alt="user-avatar" class="img-circle img-fluid">
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer">
                                <div class="text-right">
                                    <button type="button" data-toggle="modal" data-target="#editarcliente" class="editar btn btn-sm btn-success">
                                        <i class="fas fa-pencil-alt"></i>
                                    </button>
                                    <button class="borrar btn btn-sm btn-danger">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `
           });
           $('#clientes').html(template);
        })
    }
    $(document).on('keyup','#buscar_cliente', function(){
        let valor=$(this).val();
        if (valor!='') {
            buscar_cliente(valor);
        }
        else{
            buscar_cliente();
        }
    });
    $(document).on('click', '.editar', (e)=>{
        let elemento = $(this)[0].activeElement.parentElement.parentElement.parentElement.parentElement;
        let id = $(elemento).attr('cliId');
        let telefono = $(elemento).attr('cliTelefono');
        let correo = $(elemento).attr('cliCorreo');
        let razonsocial = $(elemento).attr('cliRazon');
        let adicional = $(elemento).attr('cliAdicional');
        
        $('#telefono_edit').val(telefono);
        $('#correo_edit').val(correo);
        $('#razon_social_edit').val(razonsocial);
        $('#adicional_edit').val(adicional);
        $('#id_cliente').val(id);
    })
    $('#form_editar_cliente').submit(e=>{
        let id = $('#id_cliente').val();
        let telefono = $('#telefono_edit').val();
        let correo = $('#correo_edit').val();
        let razonsocial = $('#razon_social_edit').val();
        let adicional = $('#adicional_edit').val();
        funcion='editar_cliente';
        $.post('../controladores/ClienteController.php',{id , telefono, correo, razonsocial, adicional, funcion}, (response)=>{
            console.log(response);
            if (response=='edit'){
                $('#edit-cli').hide('slow');
                $('#edit-cli').show(1000);
                $('#edit-cli').hide(2000);
                $('#form-editar-clientee').trigger('reset');
                buscar_cliente();
            }
            if(response=='noedit'){
                    $('#noedit-cli').hide('slow');
                    $('#noedit-cli').show(1000);
                    $('#noedit-cli').hide(2000);
                    $('#form-editar-cliente').trigger('reset');
                    
            }
        })
        e.preventDefault();
    });
    $(document).on('click', '.borrar', (e)=>{
        funcion = "borrar";
        const elemento = $(this)[0].activeElement.parentElement.parentElement.parentElement.parentElement;
        const id = $(elemento).attr('cliId');
        const nombre = $(elemento).attr('cliNombre');

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger mr-2'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Estas seguro?',
            text: "No vas a ver mas este cliente "+nombre+"!",
            imageWidth: 100,
            imageHeight: 100,
            showCancelButton: true,
            confirmButtonText: 'Si, Borralo porfa!',
            cancelButtonText: 'No, Cancela!',
            reverseButtons: true
          }).then((result) => {
            if (result.value) {
                $.post('../controladores/ClienteController.php',{id,funcion}, (response)=>{
                    if(response=='borrado'){
                        swalWithBootstrapButtons.fire(
                            'Borrado!',
                            'El cliente '+nombre+' fue borrado.',
                            'success'
                        )
                       buscar_cliente();
                    }
                    else{
                        swalWithBootstrapButtons.fire(
                            'No se pudo borrar!',
                            'El cliente '+nombre+' no fue borrado.',
                            'error'
                        )
                    }
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                'Tu cliente '+nombre+' esta a salvo :)',
                'error'
              )
            }
          })
    });
})