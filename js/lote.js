$(document).ready(function(){
    var funcion= '';
    buscar_lote();
    var edit=false;
    
    function buscar_lote(consulta){
        funcion="buscar";
        $.post('../controladores/LoteController.php',{consulta,funcion},(response)=>{
            const lotes = JSON.parse(response);
            let template= '';
            lotes.forEach(lote => {
                template+=`
                <div prodId="${lote.id}" prodNombre="${lote.nombre}"prodRecibido="${lote.recibido}"prodStock="${lote.stock}" class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch">`;
                if(lote.estado=='light'){
                    template+=`<div class="card bg-light">`;
                }
                if(lote.estado=='warning'){
                    template+=`<div class="card bg-warning">`;
                }
                if(lote.estado=='danger'){
                    template+=`<div class="card bg-danger">`;
                }
                template+= `<div class="card-header border-bottom-0">
                            <i class="fas fa-lg fa-cubes mr-1"></i>${lote.stock}
                        </div>
                        <div class="card-body pt-0 m-2">
                            <div class="row">
                                <div class="col-7">
                                    <h2 class="lead"><b>${lote.nombre}</b></h2>
                                    <ul class="ml-4 mb-0 fa-ul">
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-truck"></i></i></span>Proveedor: ${lote.proveedor}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-circle-info"></i></span>Detalle: ${lote.descripcion}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-code"></i></span>Codigo: ${lote.codigo}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-box"></i></span>Tipo: ${lote.tipo}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-calendar-alt"></i></span>Recibido: ${lote.recibido}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-hands-holding"></i></span>Presentacion: ${lote.presentacion}</li>
                                    </ul>
                                </div>
                                <div class="col-5 text-center">
                                    <img src="${lote.avatar}" alt="" class="img-fluid redounded">
                                </div>
                            </div>
                        </div>
                            <div class="card-footer text-center">
                                    


                                    <button class="borrar btn btn-sm btn-danger"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            })
            $('#lote').html(template);
        });
    }
    $(document).on('keyup', '#buscar-lote', function(){
        let valor = $(this).val();
        if(valor!=""){
            buscar_lote(valor);
        }
        else{
            buscar_lote();
        }
    });
    // $(document).on('click', '.editar', (e)=>{ //ARREGLAR
    //     const elemento = $(this)[0].activeElement.parentElement.parentElement.parentElement;
    //     const id_producto = $(elemento).attr('prodId');
    //     const stock = $(elemento).attr('prodNombre');
    //     const proveedor = $(elemento).attr('prodProveedor');
    //     const recibido = $(elemento).attr('prodRecibido');

    //     $('#id_edit_prod').val(id_producto);
    //     $('#lote-proveedor').val(proveedor).trigger('change');
    //     $('#recibido').val(recibido).trigger('change');
    //     $('#stock').val(stock);
    //     edit=true;
    // });
    $(document).on('click', '.borrar', (e)=>{
        funcion = "borrar";
        const elemento = $(this)[0].activeElement.parentElement.parentElement.parentElement;
        const id = $(elemento).attr('prodId');

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger mr-2'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Estas seguro?',
            text: "No vas a ver mas este lote!",
            imageWidth: 100,
            imageHeight: 100,
            showCancelButton: true,
            confirmButtonText: 'Si, Borralo porfa!',
            cancelButtonText: 'No, Cancela!',
            reverseButtons: true
          }).then((result) => {
            if (result.value) {
                $.post('../controladores/LoteController.php',{id,funcion}, (response)=>{
                    if(response=='borrado'){
                        swalWithBootstrapButtons.fire(
                            'Borrado!',
                            'El lote fue borrado.',
                            'success'
                        )
                        buscar_lote();
                    }
                    else{
                        swalWithBootstrapButtons.fire(
                            'No se pudo borrar!',
                            'El lote no fue borrado.',
                            'error'
                        )
                    }
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                'Tu lote esta a salvo :)',
                'error'
              )
            }
          })
          e.preventDefault();
    });
    
})