$(document).ready(function(){
    var funcion= '';
    var edit=false;
    $('.select2').select2();
    buscar_productos();
    rellenar_Proveedores();
    rellenar_tipos();
    rellenar_presentaciones();
    rellenar_lotes();
    function rellenar_lotes(){
        funcion="rellenar_lotes";
        $.post('../controladores/ProveedorController.php',{funcion},(response)=>{
            const lotes = JSON.parse(response);
            let template='';
            lotes.forEach(lote => {
                template+=`
                    <option value="${lote.id}">${lote.nombre}</option>
                `;
            });
            $('#lote-prov').html(template);
        })
    }
    function rellenar_Proveedores(){
        funcion="rellenar_proveedores";
        $.post('../controladores/ProveedorController.php',{funcion},(response)=>{
            const proveedores = JSON.parse(response);
            let template='';
            proveedores.forEach(proveedor => {
                template+=`
                    <option value="${proveedor.id}">${proveedor.nombre}</option>
                `;
            });
            $('#proveedor').html(template);
        })
    }
    function rellenar_tipos(){
        funcion="rellenar_tipos";
        $.post('../controladores/tipoController.php',{funcion},(response)=>{
            const tipos = JSON.parse(response);
            let template='';
            tipos.forEach(tipo => {
                template+=`
                    <option value="${tipo.id}">${tipo.nombre}</option>
                `;
            });
            $('#tipo').html(template);
        })
    }
    function rellenar_presentaciones(){
        funcion="rellenar_presentaciones";
        $.post('../controladores/presentacionController.php',{funcion},(response)=>{
            const presentaciones = JSON.parse(response);
            let template='';
            presentaciones.forEach(presentacion => {
                template+=`
                    <option value="${presentacion.id}">${presentacion.nombre}</option>
                `;
            });
            $('#presentacion').html(template);
        })
    }
    $('#form-crear-producto').submit( e =>{
        let id = $('#id_edit_prod').val();
        let nombre = $('#nombre_producto').val();
        let descripcion = $('#descripcion').val();
        let codigo = $('#codigo').val();
        let precio = $('#precio').val();
        let tipo = $('#tipo').val();
        let proveedor = $('#proveedor').val();
        let presentacion = $('#presentacion').val();
        if(edit==true){
            funcion="editar";
        }
        else{
            funcion="crear";
        }
        $.post('../controladores/ProductoController.php',{funcion,id,nombre,descripcion,codigo,precio,tipo,proveedor,presentacion},(response)=>{
            console.log(response);
            if (response=='add'){
                    $('#add').hide('slow');
                    $('#add').show(1000);
                    $('#add').hide(2000);
                    $('#form-crear-producto').trigger('reset');
                    buscar_productos();
            }
            if (response=='edit'){
                $('#edit_prod').hide('slow');
                $('#edit_prod').show(1000);
                $('#edit_prod').hide(2000);
                $('#form-crear-producto').trigger('reset');
                buscar_productos();
            }
            if(response=='noadd'){
                    $('#noadd').hide('slow');
                    $('#noadd').show(1000);
                    $('#noadd').hide(2000);
                    $('#form-crear-producto').trigger('reset');
            }
            edit=false
        });
        e.preventDefault();
    });
    function buscar_productos(consulta){
        funcion="buscar";
        $.post('../controladores/ProductoController.php',{consulta,funcion},(response)=>{
            const productos = JSON.parse(response);
            let template= '';
            productos.forEach(producto => {
                template+=`
                <div prodId="${producto.id}" prodNombre="${producto.nombre}"prodPrecio="${producto.precio}"prodDescripcion="${producto.descripcion}"prodCodigo="${producto.codigo}"prodProveedor="${producto.proveedor_id}"prodPresentacion="${producto.presentacion_id}"prodTipo="${producto.tipo_id}"prodAvatar="${producto.avatar}" class="cambiar-avat col-12 col-sm-6 col-md-4 d-flex align-items-stretch">
                    <div class="card bg-light">
                        <div class="card-header text-muted border-bottom-0">
                            <i class="fas fa-lg fa-cubes mr-1"></i>${producto.stock}
                        </div>
                        <div class="card-body pt-0 m-2">
                            <div class="row">
                                <div class="col-7">
                                    <h2 class="lead"><b>${producto.nombre}</b></h2>
                                    <h4 class="lead"><b>$${producto.precio}</b></h4>
                                    <ul class="ml-4 mb-0 fa-ul text-muted">
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-truck"></i></i></span>Proveedor: ${producto.proveedor}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-circle-info"></i></span>Detalle: ${producto.descripcion}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-code"></i></span>Codigo: ${producto.codigo}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-box"></i></span>Tipo: ${producto.tipo}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-hands-holding"></i></span>Presentacion: ${producto.presentacion}</li>
                                    </ul>
                                </div>
                                <div class="col-5 text-center">
                                    <img src="${producto.avatar}" alt="" class="img-fluid redounded">
                                </div>
                            </div>
                        </div>
                            <div class="card-footer text-center">
                                    <button class="avatar btn btn-sm btn-info" type="button" data-toggle="modal" data-target="#cambiarlogo"><i class="fas fa-image"></i></button>
                                    <button class="editar btn btn-sm btn-success" type="button" data-toggle="modal" data-target="#crear-producto"><i class="fas fa-pencil-alt"></i></button>
                                    <button class="lote btn btn-sm btn-primary" type="button" data-toggle="modal" data-target="#crear-lote"><i class="fas fa-plus-square"></i></button>
                                    <button class="borrar btn btn-sm btn-danger"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            })
            $('#productos').html(template);
        });
    }
    $(document).on('keyup', '#buscar-producto', function(){
        let valor = $(this).val();
        if(valor!=""){
            buscar_productos(valor);
        }
        else{
            buscar_productos();
        }
    });
    $(document).on('click', '.avatar', (e)=>{
        funcion="cambiar_avatar";
        const elemento = $(this)[0].activeElement.parentElement.parentElement.parentElement;
        const id = $(elemento).attr('prodId');
        const nombre = $(elemento).attr('prodNombre');
        const avatar = $(elemento).attr('prodAvatar');
        $('#logoactual').attr('src', avatar);
        $('#nombre_img').html(nombre);
        $('#funcion').val(funcion);
        $('#id_logo_prod').val(id);
    })

    $(document).on('click', '.lote', (e)=>{
        const elemento = $(this)[0].activeElement.parentElement.parentElement.parentElement;
        const id = $(elemento).attr('prodId');
        const nombre = $(elemento).attr('prodNombre');

        $('#nombre_producto_lote').html(nombre);
        $('#id_lote_prov').val(id);
    })

    $('#form-logo').submit(e=>{
        let formData = new FormData($('#form-logo')[0]);
        $.ajax({
            url:'../controladores/ProductoController.php',
            type:'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false
        }).done(function(response){
            const json = JSON.parse(response);
            if(json.alert=='edit') {
                $('#logoactual').attr('src',json.ruta);
                $('#edit').hide('slow');
                $('#edit').show(1000);
                $('#edit').hide(5000);
                $('#form-logo').trigger('reset');
                buscar_productos();
            }
            else{
                $('#noedit').hide('slow');
                $('#noedit').show(1000);
                $('#noedit').hide(2000);
                $('#form-logo').trigger('reset');
                buscar_productos();
            }
        });
        e.preventDefault();
    })

    $(document).on('click', '.borrar', (e)=>{
        funcion = "borrar";
        const elemento = $(this)[0].activeElement.parentElement.parentElement.parentElement;
        const id = $(elemento).attr('prodId');
        const nombre = $(elemento).attr('prodNombre');

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
                $.post('../controladores/ProductoController.php',{id,funcion}, (response)=>{
                    edit=false;
                    if(response=='borrado'){
                        swalWithBootstrapButtons.fire(
                            'Borrado!',
                            'El articulo '+nombre+' fue borrado.',
                            'success'
                        )
                        buscar_productos();
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
    $(document).on('click', '.editar', (e)=>{
        const elemento = $(this)[0].activeElement.parentElement.parentElement.parentElement;
        const id = $(elemento).attr('prodId');
        const nombre = $(elemento).attr('prodNombre');
        const codigo = $(elemento).attr('prodCodigo');
        const descripcion = $(elemento).attr('prodDescripcion');
        const precio = $(elemento).attr('prodPrecio');
        const tipo = $(elemento).attr('prodTipo');
        const proveedor = $(elemento).attr('prodProveedor');
        const presentacion = $(elemento).attr('prodPresentacion');

        $('#id_edit_prod').val(id);
        $('#nombre_producto').val(nombre);
        $('#codigo').val(codigo);
        $('#descripcion').val(descripcion);
        $('#precio').val(precio);
        $('#tipo').val(tipo).trigger('change');
        $('#proveedor').val(proveedor).trigger('change');
        $('#presentacion').val(presentacion).trigger('change');
        edit=true;
    });

    $('#form-crear-lote').submit(e=>{
        let id_producto = $('#id_lote_prov').val();
        let proveedor = $('#lote-prov').val();
        let stock = $('#stock').val();
        let recibido = $('#recibido').val();
        funcion="crear";
        $.post('../controladores/LoteController.php',{funcion,id_producto,proveedor,stock,recibido},(response)=>{
            if(response=='add') {
                $('#logoactual').attr('src',JSON.ruta);
                $('#add-lote').hide('slow');
                $('#add-lote').show(1000);
                $('#add-lote').hide(5000);
                $('#form-crear-lote').trigger('reset');
                buscar_productos();
            }
            else{
                $('#noadd-lote').hide('slow');
                $('#noadd-lote').show(1000);
                $('#noadd-lote').hide(2000);
                $('#form-crear-lote').trigger('reset');
                buscar_productos();
            }
        });
        e.preventDefault();
    });
    
})