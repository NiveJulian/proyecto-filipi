$(document).ready(function(){
    Loader('Cargando Productos');
    verificar_sesion();
    toastr.options={
        "preventDuplicates":true
    }
    calcularTotal();
    function llenar_menu_superior(usuario){
        let template = `
        <ul class="navbar-nav">
            <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
            <a href="/gasolero/Views/catalogo.php" class="nav-link">Inicio</a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
            <a href="#" class="nav-link">Contacto</a>
            </li>
            <li class="nav-item dropdown" id="cat-carrito" style="display:none;" role="button">
                    <img src="/gasolero/Util/img/carrito.png" class="imagen-carrito nav-link">
                    <span id="contador" class="contador badge badge-danger"></span>
                    </img>
            </li>
        </ul>
        <ul class="navbar-nav ml-auto">
            <!-- Notifications Dropdown Menu -->
            <li class="nav-item dropdown">
            <a class="nav-link" data-toggle="dropdown" href="#">
                <i class="far fa-bell"></i>
                <span class="badge badge-warning navbar-badge">1</span>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <span class="dropdown-item dropdown-header">1 Notifications</span>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                <i class="fas fa-file mr-2"></i> 3 new reports
                <span class="float-right text-muted text-sm">2 days</span>
                </a>
                <div class="dropdown-divider"></div>
                
                <div class="dropdown-divider"></div>
                
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a>
            </div>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link" data-toggle="dropdown" href="#">
                    <img src="/gasolero/Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" heigth="30">
                    <span>${usuario.nombre}</span>
                </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <span class="dropdown-item dropdown-header"></span>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item">
                        <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>Perfil</a>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item">
                        <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>Configuracion</a>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-divider"></div>
                        <a href="/gasolero/Controllers/Logout.php" class="dropdown-item text-center bg-danger">
                            <i class="fas fa-power-off mr-2"></i>Cerrar Sesion</a>
                    <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item dropdown-footer"></a>
            </div>
            </li>
        </ul>
        `;
        $('#menu_superior').html(template);
    }
    function llenar_menu_lateral(usuario){
        let template = `
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                <div class="image">
                <img src="/gasolero/Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" heigth="30">
                </div>
                <div class="info">
                    <a href="#" class="d-block">${usuario.nombre+' '+usuario.apellido}</a>
                </div>
        </div>
      <!-- Sidebar Menu -->
            <nav class="mt-2">
                <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                
                <li class="nav-header">Catalogo</li>
                <li class="nav-item" id="gestion_cliente">
                    <a href="/gasolero/Views/catalogo.php" class="nav-link">
                    <i class="nav-icon fas fa-shopping-cart fa-lg"></i>
                    <p>
                        Catalogo
                        <span class="badge badge-info right"></span>
                    </p>
                    </a>
                </li>
                <li class="nav-header">Ventas</li>
                <li class="nav-item" id="gestion_cliente">
                    <a href="/gasolero/Views/mis_ventas.php" class="nav-link">
                    <i class="nav-icon fas fa-list-ul fa-lg"></i>
                    <p>
                        Ventas
                        <span class="badge badge-info right"></span>
                    </p>
                    </a>
                </li>
                </ul>
            </nav>
        `;
        $('#menu_lateral').html(template);
    }
    async function verificar_sesion(){
        let funcion = "verificar_sesion";
        let data = await fetch('/gasolero/Controllers/UsuariosController.php',{
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'funcion='+funcion
        })
        if(data.ok){
            let response= await data.text();
            try {
                let repuesta = JSON.parse(response);
                if (repuesta.length!=0) {
                    llenar_menu_lateral(repuesta);
                    llenar_menu_superior(repuesta);
                    $('#cat-carrito').show();
                    contarProductos();
                    obtener_productos();
                    CloseLoader();
                }
                else{
                    location.href = "/gasolero/";
                }
            } catch (error) {
                console.error(error);
                console.log(response);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'hubo conflicto en el sistema, pongase en contacto con el administrador'
                })
            }
        }
        else{
            Swal.fire({
                icon: 'error',
                title: data.statusText,
                text: 'hubo conflicto de codigo: '+data.status
            })
        }
        
    }
    async function obtener_productos(){
        let funcion = "obtener_productos";
        let data = await fetch('/gasolero/Controllers/ProductoController.php',{
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=' + funcion
        })
        if(data.ok){
            let response= await data.text();
            try {
                let producto = JSON.parse(response);
                $('#productos').DataTable({
                    "data": producto,
                    "aaSorting": [],
                    "searching": true,
                    "scrollX": false,
                    "autoWidth":false,
                    paging:false,
                    bInfo:false,
                    columns:[
                        {
                    "render": function(data,type,datos,meta){
                        let stock = '';
                        if (datos.stock==null || datos.stock==0) {
                            stock = 'Sin stock'
                        } else {
                            stock = datos.stock;
                        }
                        return  `
                        <div class="card-catalogo">
                            <div class="card bg-light">
                                <div class="card-header text-muted border-bottom-0">
                                    <h4><i class="fas fa-lg fa-cubes mr-1"></i>${stock}</h4>
                                </div>
                                <div class="card-body pt-0 m-2">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <h3 class=""><b>${datos.nombre}</b></h3>
                                            <h4 class=""><b>$${datos.precio}</b></h4>
                                            <ul class="ml-4 mb-0 fa-ul text-muted">
                                                <li class="h8"><span class="fa-li"><i class="fas fa-truck"></i></i></span>Proveedor: ${datos.proveedor}</li>
                                                <li class="h8"><span class="fa-li"><i class="fas fa-code"></i></span>Codigo: ${datos.codigo}</li>
                                            </ul>
                                        </div>
                                        <div class="col-md-6 text-center">
                                            <img src="/gasolero/Util/img/productos/${datos.avatar}" width="250px" alt="" class="img-fluid redounded">
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer text-center">
                                        <button id="${datos.id}" 
                                                codigo="${datos.codigo}"
                                                nombre="${datos.nombre}"
                                                precio="${datos.precio}"
                                                stock="${datos.stock}"
                                                class="agregar-carrito btn btn-sm btn-primary">
                                                Agregar al carrito</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `}
                    }
                ],
                "language": espanol,
                "destroy": true
                })
            } catch (error) {
                console.error(error);
                console.log(response);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'hubo conflicto en el sistema, pongase en contacto con el administrador'
                })
            }
        }
        else{
            Swal.fire({
                icon: 'error',
                title: data.statusText,
                text: 'hubo conflicto2 de codigo: '+data.status
            })
        }
        
    }
    $(document).on('click', '.agregar-carrito', (e)=>{
        let elemento = $(this)[0].activeElement;
        let id = $(elemento).attr('id');
        let codigo = $(elemento).attr('codigo');
        let nombre = $(elemento).attr('nombre');
        let precio = $(elemento).attr('precio');
        let stock = $(elemento).attr('stock');
        if(stock!='null'){
            let producto={
                'id': id,
                'nombre': nombre,
                'codigo': codigo,
                'precio': precio,
                'stock': stock,
                'cantidad': 1
            }
            let bandera=false;
            let productos = RecuperarLS();
            productos.forEach(prod => {
                if(prod.id === producto.id){
                   bandera=true;
                }
            });
            if(bandera){
                toastr.error('El producto '+nombre+ ' #'+codigo+' ya fue agregado', 'Error!');
            }
            else{
            AgregarLS(producto);
            contarProductos();
            toastr.success('Producto '+nombre+ ' #'+codigo+' agregado', 'Exito!');
            }
        }
        else{
            toastr.warning('El producto '+nombre+ ' #'+codigo+' no tiene stock', 'No se pudo agregar!');
        }
        
    })
    function abrirCarrito(){
        let productos = RecuperarLS();
        if (productos.length!=0) {
            $('#abrirCarrito').modal('show');
            $('#carrito_compras').DataTable({
                "data": productos,
                "aaSorting": [],
                "searching": true,
                "scrollX": false,
                "language": espanol,
                "autoWidth":false,
                paging:false,
                bInfo:false,   
                columns:[
                    {
                "render": function(data,type,datos,meta){
                    let template= `
                        <div class="card bg-ligth">
                            <div class="card-body pt-0">
                                <div class="row">
                                    <div class="col-md-10 p-1 m-1">
                                        <ul class="col-ml-4 mb-0 fa-ul">
                                            <li class="small"><span class="fa-li"><i class="fas fa-heading"></i></i></span>Nombre: ${datos.nombre}</li>
                                            <li class="small"><span class="fa-li"><i class="fas fa-code"></i></span>Codigo: ${datos.codigo}</li>
                                        </ul>
                                    </div>
                                    <div class="col-md-2 text-center">
                                        <button id="${datos.id}" 
                                                nombre="${datos.nombre}"
                                                precio="${datos.precio}"
                                                type="button" class="borrar-producto btn btn-outline-danger btn-circle btn-lg"><i class="far fa-trash-alt"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                    return template;
                }}
            ],
            
            "language": espanol,
            "destroy": true
            });
            calcularTotal()
        } else {
            toastr.warning('El carrito esta vacio', 'No se pudo abrir!');
            $('#abrirCarrito').modal('hide');
        }
    }
    $(document).on('click', '#cat-carrito', (e)=>{
        abrirCarrito()
    })
    $(document).on('click', '.vaciar-carrito', (e)=>{
        EliminarLS();
        toastr.success('El carrito esta vacio', 'Exito!');
        contarProductos();
        $('#abrirCarrito').modal('hide');
    })
    $(document).on('click', '.borrar-producto', (e)=>{
        let elemento = $(this)[0].activeElement;
        let id = $(elemento).attr('id')
        let nombre = $(elemento).attr('nombre');
        toastr.success('El producto '+nombre+' fue eliminado del carrito', 'Exito!');
        Eliminar_producto_LS(id);
        contarProductos();
        abrirCarrito();
    })
    $(document).on('click', '#procesar-compra', (e)=>{
        Procesar_compra();
    })
    function RecuperarLS(){
        let productos;
        if(localStorage.getItem('productos')===null){
            productos=[];
        }
        else{
            productos= JSON.parse(localStorage.getItem('productos'))
        }
        return productos
    }
    function AgregarLS(producto){
        let productos;
        productos = RecuperarLS();
        productos.push(producto);
        localStorage.setItem('productos', JSON.stringify(productos))
    }
    function contarProductos(){
        let productos;
        let contador=0;
        productos=RecuperarLS();
        productos.forEach(producto => {
            contador++;
        });
        $('#contador').html(contador);
    }
    function Eliminar_producto_LS(id) {
        let productos;
        productos = RecuperarLS();
        productos.forEach(function(producto,indice){
            if(producto.id===id){
                productos.splice(indice,1);
            }
        })
        localStorage.setItem('productos', JSON.stringify(productos))
    }
    function EliminarLS(){
        localStorage.clear();
    };
    function Loader(mensaje){
        if (mensaje==''|| mensaje==null) {
            mensaje="Cargando datos...";
        }
        Swal.fire({
            position: 'center',
            html:'<i class="fas fa-2x fa-sync-alt fa-spin"></i>',
            title: mensaje,
            showConfirmButton: false,
        })
    }
    function CloseLoader(mensaje,tipo){
        if (mensaje==''||mensaje==null) {
            Swal.close();
        }
        else{
            Swal.fire({
                position: 'center',
                icon: tipo,
                title: mensaje,
                showConfirmButton: false,
            })
        }
    }
    // PROCESO DE COMPRA
    function calcularTotal(){
        let productos,subtotal,con_iva;
        let total= 0,iva=0.21;
        productos=RecuperarLS();
        productos.forEach(producto => {
            let subtotal_producto= Number(producto.precio * producto.cantidad);
            total=total+subtotal_producto;
        });

        total_sin_descuento=total.toFixed(2);
        con_iva=parseFloat(total*iva).toFixed(2);
        subtotal=parseFloat(total-con_iva).toFixed(2);

        $('#subtotal').html(subtotal);
        $('#con_iva').html(con_iva);
            // $('#total_sin_descuento').html(total_sin_descuento);
        $('#total').html(total.toFixed(2));
            // $('#vuelto').html(vuelto.toFixed(2));
    }
    function Procesar_compra(){
        let cliente = $('#cliente').val();
        if(RecuperarLS().length == 0){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El pedido no se pudo hacer!'
              }).then(function(){
                location.href = "/gasolero/";
              })
        }
        else if(cliente==''){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Necesitamos un cliente!'
              })
        }
        else{
            Verificar_stock().then(error=>{
                if(error==0){
                    Registrar_compra(cliente);
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Se realizo la compra',
                        showConfirmButton: false,
                        timer: 1500
                      }).then(function(){
                        location.href = "/gasolero/";
                        location.href = "/gasolero/";
                      })
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Algun producto esta sin stock!'
                      })
                }
            });
            
        }

    }
    async function Verificar_stock(){
        let productos;
        funcion = 'verificar_stock';
        productos = RecuperarLS();
        const response = await fetch('/gasolero/Controllers/ProductoController.php',{
            method:'POST',
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            body:'funcion='+funcion+'&&productos='+JSON.stringify(productos)
        })
        let error = await response.text();
        return error;
    }
    function Registrar_compra(cliente){
        funcion = "registrar_compra";
        let total = $('#total').get(0).textContent;
        let productos=RecuperarLS();
        let json = JSON.stringify(productos);
        $.post('/gasolero/Controllers/CompraController.php',{funcion,total,cliente,json}, (response)=>{
            console.log(response);
        })
    }
})
let espanol = {
    "processing": "Procesando...",
    "lengthMenu": "Mostrar _MENU_ registros",
    "zeroRecords": "No se encontraron resultados",
    "emptyTable": "Ningún dato disponible en esta tabla",
    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
    "search": "Buscar:",
    "infoThousands": ",",
    "loadingRecords": "Cargando...",
    "paginate": {
        "first": "Primero",
        "last": "Último",
        "next": "Siguiente",
        "previous": "Anterior"
    },
    "aria": {
        "sortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sortDescending": ": Activar para ordenar la columna de manera descendente"
    },
    "buttons": {
        "copy": "Copiar",
        "colvis": "Visibilidad",
        "collection": "Colección",
        "colvisRestore": "Restaurar visibilidad",
        "copyKeys": "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br \/> <br \/> Para cancelar, haga clic en este mensaje o presione escape.",
        "copySuccess": {
            "1": "Copiada 1 fila al portapapeles",
            "_": "Copiadas %ds fila al portapapeles"
        },
        "copyTitle": "Copiar al portapapeles",
        "csv": "CSV",
        "excel": "Excel",
        "pageLength": {
            "-1": "Mostrar todas las filas",
            "_": "Mostrar %d filas"
        },
        "pdf": "PDF",
        "print": "Imprimir",
        "renameState": "Cambiar nombre",
        "updateState": "Actualizar",
        "createState": "Crear Estado",
        "removeAllStates": "Remover Estados",
        "removeState": "Remover",
        "savedStates": "Estados Guardados",
        "stateRestore": "Estado %d"
    }
};