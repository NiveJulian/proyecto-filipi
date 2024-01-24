$(document).ready(function(){
    Loader('Cargando Datos');
    verificar_sesion();
    toastr.options={
        "preventDuplicates":true
    }
    let sueldoMensualGlobal = 0;
    let sueldoSemanalGlobal = 0;
    let sueldoSemanalPorTurno = 0.0;
    let edit = false
    let itemsPerPage = 10;
    // LAYOUTS
    function llenar_menu_superior(usuario){
        let template = `
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
                <a href="/filippi/Views/catalogo.php" class="nav-link">Inicio</a>
            </li>
        </ul>
        <ul class="navbar-nav ml-auto">
            <!-- Notifications Dropdown Menu -->
            <li class="nav-item dropdown">
                <a class="nav-link" id="count-vehicles" data-toggle="dropdown" href="#">
                    <i class="far fa-bell"></i>
                    <span class="badge badge-danger navbar-badge product-quantity"></span>
                </a>
                <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                    <span class="dropdown-item dropdown-header">Hay <span class="product-quantity"></span> vehículo(s) por vencer pagos</span>
                    <div id="notifications" class="list-group"></div>
                    <a href="#" class="dropdown-item dropdown-footer">Cerrar Notificaciones</a>
                </div>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link" data-toggle="dropdown" href="#">
                    <img src="/filippi/Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" heigth="30">
                    <span></span>
                </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <span class="dropdown-item dropdown-header"></span>
                    
                    <div class="dropdown-divider"></div>
                        <a href="/filippi/Controllers/Logout.php" class="dropdown-item text-center bg-danger">
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
                <img src="/filippi/Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" heigth="30">
                </div>
                <div class="info">
                    <a href="/filippi/Views/catalogo.php" class="d-block">${usuario.nombre}</a>
                </div>+
        </div>
      <!-- Sidebar Menu -->
            <nav class="mt-2">
                <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                
                    <li class="nav-header">Usuario</li>
                    <li class="nav-item" id="gestion_usuario">
                        <a href="/filippi/Views/Gestion_usuario.php" class="nav-link">
                        <i class="nav-icon fas fa-tags fa-lg"></i>
                        <p>
                            Gestion Usuario
                            <span class="badge badge-info right"></span>
                        </p>
                        </a>
                    </li>

                    <li class="nav-header">Datos</li>

                    <li class="nav-item">
                        <a href="/filippi/Views/catalogo.php" class="nav-link">
                        <i class="nav-icon fas fas fa-tractor"></i>
                        <p>
                            Vehiculos
                            <span class="badge badge-info right"></span>
                        </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="/filippi/Views/personal.php" class="nav-link">
                        <i class="nav-icon fas fa-user-tie"></i>
                        <p>
                            Personal
                            <span class="badge badge-info right">Nuevo</span>
                        </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="/filippi/Views/atributo.php" class="nav-link">
                        <i class="nav-icon fas fa-building"></i>
                        <p>
                            Clientes y Proveedores
                            <span class="badge badge-info right"></span>
                        </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="/filippi/Views/facturacion.php" class="nav-link">
                        <i class="nav-icon fas fa-file-invoice-dollar"></i>
                        <p>
                            Faturacion
                            <span class="badge badge-info right"></span>
                        </p>
                        </a>
                    </li>
                    
                </ul>
            </nav>
        `;
        $('#menu_lateral').html(template);
    }
    // FIN LAYOUTS
    // VERIFICACIONES
    async function verificar_sesion(){
        let funcion = "verificar_sesion";
        let data = await fetch('/filippi/Controllers/UsuariosController.php',{
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'funcion='+funcion
        })
        if(data.ok){
            let response= await data.text();
            try {
                let repuesta = JSON.parse(response);
                if (repuesta.length !== 0) {
                    llenar_menu_superior(repuesta);
                    llenar_menu_lateral(repuesta);
                    obtener_personal(1, itemsPerPage);
                    rellenar_archivos_personal()
                    showPurchaseOrder()
                    showAssist()
                    registrarSemana()
                    CloseLoader();
                    
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Usuario no puede ingresar'
                    })
                    location.href = "/filippi/index.php";
                }
            } catch (error) {
                console.error(error);
                ;
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
    // FIN LOADER
    
    // ORDENES DE COMPRA
    async function showPurchaseOrder(){
        let funcion = 'showPurchaseOrder';
        let data = await fetch('/filippi/Controllers/ordenCompraController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=' + funcion
        });
        if(data.ok){
            let response = await data.text();
            try {
                let ordenes = JSON.parse(response)
                $('#orden_compras_compra').DataTable({
                    "data": ordenes,
                    "aaSorting": [],
                    "scrollX": false,
                    "autoWidth": false,
                    paging: false,
                    bInfo: false,
                    columns: [
                        { data: null, render: function (data, type, row, meta) { return meta.row + 1; } },
                        { data: "id" },
                        { data: "proveedor" },
                        { data: "autorizado" },
                        { data: "fecha" },
                        {
                            "defaultContent": `
                                <button class="imprimir btn btn-success" type="button">
                                    <i class="fas fa-print" style="color: white;"></i>
                                </button>
                                <button class="anular btn btn-danger" type="button">
                                    <i class="fas fa-times" style="color:white;"></i>
                                </button>`
                        }
                    ],
                    "language": espanol,
                    "destroy": true,
                });
                
            } catch (error) {
                console.error(error);
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
    $('#orden_compras_compra tbody').on('click', '.imprimir', function() {
        // Realiza una solicitud al controlador PHP para obtener el HTML
        // Puedes usar AJAX para esto
        let id = $(this).closest('tr').find('td:eq(1)').text();
        let funcion = "imprimir";
        $.ajax({
            url: '/filippi/Controllers/ordenCompraController.php',
            type: 'POST',
            data: {
                funcion: funcion,
                id: id // Usa id aquí, que es el valor de data-id
            },
            cache: false,
            success: function(response) {
                window.open('/filippi/Util/pdf/pdf-ordencompra-' + id + '.pdf', '_blank');
            },
        });
    });
    $('#orden_compras_compra tbody').on('click', '.anular', function() {
        // Realiza una solicitud al controlador PHP para obtener el HTML
        // Puedes usar AJAX para esto
        let id = $(this).closest('tr').find('td:eq(1)').text();
        let funcion = "anular";

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger mr-2'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Estas seguro?',
            text: "No vas a ver mas los datos de la orden N°"+id+" ",
            imageWidth: 100,
            imageHeight: 100,
            showCancelButton: true,
            confirmButtonText: 'Si, Borralo',
            cancelButtonText: 'No, Cancela!',
            reverseButtons: true
          }).then((result) => {
            if (result.value) {
                $.post('/filippi/Controllers/ordenCompraController.php',{id,funcion}, (response)=>{
                    console.log(response);
                    if (response.includes('success')) {
                        swalWithBootstrapButtons.fire(
                            'Borrado!',
                            'La orden compra N°' + id + ' fue borrada.',
                            'success'
                        )
                        showPurchaseOrder()
                    } else {
                        swalWithBootstrapButtons.fire(
                            'No se pudo borrar!',
                            'La orden compra N°' + id + ' no fue borrada.',
                            'error'
                        )
                    }
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                'Tu orden de compra esta a salvo :)',
                'error'
              )
            }
          })
        
    });
    $('#form-crear-orden-compra').submit(function (e) {
        e.preventDefault();

        var formData = {
            tipoGasto: $('#order_tipo_gasto').val(),
            autorizado: $('#autorizado').val(),
            proveedor: $('#proveedor').val(),
            observaciones: $('#observaciones').val(),
            datosTabla: obtenerDatosTabla()
        };
        function obtenerDatosTabla() {
            var datosTabla = [];
            $('#tablaMateriales tbody tr').each(function () {
                var cantidad = $(this).find('td:eq(0)').text();
                var detalle = $(this).find('td:eq(1)').text();
                var obra = $(this).find('td:eq(2)').text();
                var equipo = $(this).find('td:eq(3)').text();
                var monto = $(this).find('td:eq(4)').text();
                var total = $(this).find('td:eq(5)').text();
        
                datosTabla.push({
                    cantidad: cantidad,
                    detalle: detalle,
                    obra: obra,
                    equipo: equipo,
                    monto: monto,
                    total: total
                });
            });
            return datosTabla;
        }
        $.ajax({
            type: 'POST',
            url: '/filippi/Controllers/ordenCompraController.php',
            data: { funcion: 'crear', ordenCompraData: formData },
            success: function (response) {
                try {
                    response = JSON.parse(response);
                    if (response.status === 'success') {
                        toastr.success(`Nueva Orden N° ${response.id} Agregado con éxito`, 'Éxito');
                        showPurchaseOrder()
                    } else {
                        toastr.error('No se pudo agregar la Orden', 'Error');
                    }
                } catch (e) {
                    console.error('Error al analizar la respuesta JSON:', e);
                    toastr.error('Error al procesar la respuesta del servidor', 'Error');

                }
            },
            error: function (xhr, status, error) {
                console.error('Error en la solicitud AJAX', error);
            }
        });
    });
    //

    // CRUD
    async function obtener_personal(page, itemsPerPage) {
        let funcion = "obtener_personal";
        let data = await fetch('/filippi/Controllers/PersonalController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=' + funcion + '&page=' + page + '&itemsPerPage=' + itemsPerPage
        });
    
        if (data.ok) {
            let response = await data.json();
            try {
                if (Array.isArray(response.data.data) && response.data.data.length > 0) {
                    let personal = response.data.data;
                    const totalRecords = response.data.pagination.totalRecords || 0;
    
                    const totalPages = Math.ceil(totalRecords / itemsPerPage);
                    const currentPageRecords = personal;
    
                    let template = "";

                currentPageRecords.forEach(persona => {
                    template += `<div class="card bg-light d-flex flex-fill">
                    <div class="card-header text-muted border-bottom-0">
                        <span class="badge badge-success">Rol</span>
                    </div>
                    <div class="card-body pt-0">
                        <div class="row">
                            <div class="col-7">
                                <h2 class="lead"><b>${persona.nombre || 'N/A'}</b></h2>
                                <p class="text-muted text-sm"><b>DNI: </b>${persona.dni || 'N/A'}</p>
                                <ul class="ml-4 mb-0 fa-ul text-muted">
                                <li class="small"><span class="fa-li"><i class="fas fa-map-marker"></i></span> Direccion: ${persona.direccion || 'N/A'}</li>
                                    <li class="small"><span class="fa-li"><i class="fas fa-building"></i></span> Fecha de ingreso: ${persona.fecha_ingreso || 'N/A'}</li>
                                    <li class="small"><span class="fa-li"><i class="fas fa-heartbeat"></i></span> Obra Social: ${persona.obra_social || 'N/A'}</li>
                                    <li class="small"><span class="fa-li"><i class="fas fa-id-card"></i></span> Carnet: ${persona.carnet || 'N/A'}</li>
                                    <li class="small"><span class="fa-li"><i class="fas fa-calendar-check"></i></span> Fecha Alta: ${persona.fecha_alta || 'N/A'}</li>
                                    <li class="small"><span class="fa-li"><i class="fas fa-calendar-times"></i></span> Fecha Baja: ${persona.fecha_baja || 'N/A'}</li>
                                    <li class="small"><span class="fa-li"><i class="fas fa-address-card"></i></span> Cuil: ${persona.cuil || 'N/A'}</li>
                                </ul>
                            </div>
                            <div class="col-5 text-center">
                                <img src="${persona.avatar || 'ruta_por_defecto_si_es_null'}" alt="user-avatar" class="img-circle img-fluid">
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="text-right">
                            <button perId="${persona.id}" 
                                    perNombre="${persona.nombre || 'N/A'}" 
                                    perObrasocial="${persona.obra_social || 'N/A'}"
                                    perFechaingreso="${persona.fecha_ingreso || 'N/A'}"
                                    perFechaalta="${persona.fecha_alta || 'N/A'}"
                                    perDireccion="${persona.direccion || 'N/A'}" 
                                    perDni="${persona.dni || 'N/A'}" 
                                    perCarnet="${persona.carnet || 'N/A'}"
                                    perFechabaja="${persona.fecha_baja || 'N/A'}"
                                    perCuil="${persona.cuil || 'N/A'}" 
                                    class="editar btn btn-sm bg-success" type="button" data-toggle="modal" data-target="#crear-personal">
                                
                                    <i class="fas fa-pencil-alt" style="color: white;"></i>
                            </button>
                            <button perId="${persona.id}" 
                                    perNombre="${persona.nombre || 'N/A'}"
                                    type="button" class="borrar btn btn-sm btn-danger">
                                <i class="fas fa-trash" style="color:white;"></i>
                            </button>
                            <button id="${persona.id}" 
                                    nombre="${persona.nombre}" 
                                    avatar="${persona.avatar}" 
                                    class="avatar btn btn-sm btn-info" type="button" data-toggle="modal" data-target="#cambiarlogo">
                                <i class="fas fa-image" style="color: white;"></i>
                            </button>
                            <button perId="${persona.id}" 
                                    perNombre="${persona.nombre || 'N/A'}" 
                                    perDni="${persona.dni || 'N/A'}" 
                                    perCuil="${persona.cuil || 'N/A'}" 
                                    perFechaingreso="${persona.fecha_ingreso || 'N/A'}" 
                                    perObrasocial="${persona.obra_social || 'N/A'}"
                                    perDireccion="${persona.direccion || 'N/A'}" 
                                    class="ver btn btn-sm btn-primary" type="button" data-toggle="modal" data-target="#vista_personal">
                                <i class="fas fa-eye" style="color: white;"></i>
                            </button>
                        </div>
                    </div>
                                </div>`;
                });

                    
                $('#personal').html(template);
                generarPaginacion(page, totalPages);
            } else {
                const personalList = document.getElementById('personal');
                personalList.innerHTML = "No hay personal registrado.";
                generarPaginacion(1, 1);
            }
            } catch (error) {
                console.error(error);
                console.log(response);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un conflicto en el sistema, póngase en contacto con el administrador'
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: data.statusText,
                text: 'Hubo un conflicto de código: ' + data.status
            });
        }
    }
    function generarPaginacion(currentPage, totalPages) {
        const paginationContainer = document.getElementById('pagination-container');
        const paginationHTML = [];
    
        if (totalPages === 0) {
            paginationContainer.innerHTML = '<p class="text-center">No hay personal registrado</p>';
            return;
        }
        const maxPagesToShow = 5;
    
        const startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
        const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML.push(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `);
        }
    
        paginationContainer.innerHTML = paginationHTML.join('');
        const paginationLinks = paginationContainer.querySelectorAll('.page-link');
        paginationLinks.forEach(link => {
            link.addEventListener('click', () => {
                const newPage = parseInt(link.getAttribute('data-page'));
                obtener_personal(newPage, itemsPerPage);
            });
        });
    }
    $('#form-crear-personal').submit( (e) =>{
        let id = $('#id_edit_personal').val();
        let nombre = $('#nombre').val();
        let direccion = $('#direccion').val();
        
        let cuil = $('#cuil').val();

        let dni = $('#dni').val();

        let obrasocial = $('#obrasocial').val();
        let fecha_alta = $('#fecha_alta').val();
        
        let fecha_baja = $('#fecha_baja').val();
        let fecha_ingreso = $('#fecha_ingreso').val();
        
        let carnet = $('#carnet').val();
        
        if(edit==true){
            funcion="editar";
        }
        else{
            funcion="crear";
        }
        $.post('/filippi/Controllers/PersonalController.php',{funcion,id,nombre,direccion,cuil,dni,obrasocial,carnet,fecha_alta,fecha_baja,fecha_ingreso},(response)=>{
            console.log(response)
            if (response=='add'){
                    toastr.success('Nuevo Personal '+ nombre +' Agregado con exito', 'Exito!');
                    $('#form-crear-personal').trigger('reset');
                    
                    obtener_personal(1, itemsPerPage);
                    
            }
            if (response=='edit'){
                toastr.success('Pesonal '+ nombre +' editado', 'Exito!');
                $('#form-crear-personal').trigger('reset');
                
                    obtener_personal(1, itemsPerPage);
            }
            
            if(response=='noadd'){
                    toastr.error('No se pudo agregar el Pesonal ', 'Error!');
                    $('#form-crear-personal').trigger('reset');
            }
            
            edit=false
        });
        e.preventDefault();
    });
    $(document).on('click', '.avatar', (e)=>{
        let funcion="cambiar_avatar";
        const elemento = $(this)[0].activeElement;
        const id = $(elemento).attr('id');
        const nombre = $(elemento).attr('nombre');
        const avatar = $(elemento).attr('avatar');
        $('#logoactual').attr('src', avatar);
        $('#nombre_img').html(nombre);
        $('#funcion').val(funcion);
        $('#id_logo_prod').val(id);
        $('#avatar').val(avatar);
    })
    $('#form-logo-prod').submit(e=>{
        let formData = new FormData($('#form-logo-prod')[0]);
        $.ajax({
            url:'/filippi/Controllers/PersonalController.php',
            type:'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false
        }).done(function(response){
            const json = JSON.parse(response);
            console.log(json)
            if(json.alert=='edit') {
                toastr.success('Imagen Agregada', 'Exito!');
                $('#form-logo-prod').trigger('reset');
                location.href = '/filippi/Views/Personal.php'
            }
            else{
                toastr.error('La imagen no cumple con los requisitos', 'Error!');
                $('#form-logo-prod').trigger('reset');
            }
        });
        e.preventDefault();
    })
    $(document).on('click', '.borrar', (e)=>{
        let funcion = "borrar";
        const elemento = $(this)[0].activeElement;
        const id = $(elemento).attr('perId');
        const nombre = $(elemento).attr('perNombre');

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger mr-2'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Estas seguro?',
            text: "No vas a ver mas los datos de "+nombre+"!",
            imageWidth: 100,
            imageHeight: 100,
            showCancelButton: true,
            confirmButtonText: 'Si, Borralo',
            cancelButtonText: 'No, Cancela!',
            reverseButtons: true
          }).then((result) => {
            if (result.value) {
                $.post('/filippi/Controllers/PersonalController.php',{id,funcion}, (response)=>{
                    edit=false;
                    if(response=='borrado'){
                        swalWithBootstrapButtons.fire(
                            'Borrado!',
                            'Personal: '+nombre+' y todos sus datos fueron borrados.',
                            'success'
                        )
                        
                    obtener_personal(1, itemsPerPage);
                    }
                    else{
                        swalWithBootstrapButtons.fire(
                            'No se pudo borrar!',
                            `Los datos <b>`+nombre+`</b> no fue borrado.`,
                            'error'
                        )
                    }
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                `Los datos de <b>`+nombre+`</b> estan a salvo`,
                'error'
              )
            }
          })
    });
    $(document).on('click', '.editar', (e)=>{
        const elemento = $(this)[0].activeElement
        const id = $(elemento).attr('perid')
        const nombre = $(elemento).attr('perNombre');
        const direccion = $(elemento).attr('perDireccion');
        const cuil = $(elemento).attr('perCuil');
        const dni = $(elemento).attr('perDni');
        const obrasocial = $(elemento).attr('perObrasocial');
        const fecha_ingreso = $(elemento).attr('perFechaingreso');
        const fecha_alta = $(elemento).attr('perFechaalta');
        const fecha_baja = $(elemento).attr('perFechabaja');
        const carnet = $(elemento).attr('perCarnet');

        $('#id_edit_personal').val(id);
        $('#nombre').val(nombre);
        $('#direccion').val(direccion);
        $('#cuil').val(cuil);
        $('#dni').val(dni);
        $('#obrasocial').val(obrasocial);
        $('#fecha_alta').val(fecha_alta);
        $('#fecha_baja').val(fecha_baja);
        $('#fecha_ingreso').val(fecha_ingreso);
        $('#carnet').val(carnet);
        edit=true;
    });
    //

    // ASISTENCIA

    $('#registrarSemanaBtn').click(registrarSemana);
    async function registrarSemana() {
        let semanaInicio = $('#comienzo-semana').val();
        let semanaFin = $('#final-semana').val();
    
        // Asigna los valores de las fechas a los campos ocultos
        $('#semanaInicio').val(semanaInicio);
        $('#semanaFin').val(semanaFin);
    
        let asistencias = [];
    
        $('#tablaEmpleados tbody tr').each(function () {
            let empleadoId = $(this).find('.asistencia-checkbox').data('personal-id');
    
            let turnos = [];
            $(this).find('.asistencia-checkbox:checked').each(function () {
                let dia = $(this).data('dia');
                let turno = $(this).data('turno');
                turnos.push({ dia, turno });
            });
    
            let totalDias = $(this).find('.total-dias').text();
            let rol = $(this).find('select[name="rol"]').val();
            let trabajo = $(this).find('input[name="trabajo"]').val();
            let comida = $(this).find('input[name="comida"]').val();
            let viaje = $(this).find('input[name="viaje"]').val();
            let domingos = $(this).find('input[name="domingos"]').val();
            let extras = $(this).find('input[name="extras"]').val();
            let bonificacion = $(this).find('input[name="bonificacion"]').val();
            let sueldo = $(this).find('p[name="sueldo"]').text();
            let sueldoSemanal = $(this).find('p[name="sueldoSemanal"]').text();
    
            let asistenciaEmpleado = {
                empleadoId,
                semanaInicio,
                semanaFin,
                turnos,
                totalDias,
                rol,
                trabajo,
                comida,
                viaje,
                domingos,
                extras,
                bonificacion,
                sueldo,
                sueldoSemanal
            };
    
            asistencias.push(asistenciaEmpleado);
        });
    
        // Enviar datos al servidor mediante una solicitud AJAX
        $.ajax({
            url: '/filippi/Controllers/asistenciaController.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ funcion: 'registrar_asistencia_semana', asistencias: asistencias }),
            success: function (response) {
                console.log(response);
                // Procesar la respuesta del servidor según sea necesario
            },
            error: function (xhr, textStatus, errorThrown) {
                Swal.fire({
                    icon: 'error',
                    title: textStatus,
                    text: 'Hubo un conflicto de código: ' + xhr.status
                });
            }
        });
    }
    async function showAssist(){
        let funcion = "obtener_datos_empleados";
        let data = await fetch('/filippi/Controllers/asistenciaController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=' + funcion
        });
    
        if(data.ok){
            let response = await data.text();
            console.log(response);
                try {
                let registrado = JSON.parse(response)
                $('#tablaEmpleados tbody').empty()

                registrado.forEach(asistencia => {
                    let rowHtml= `
                            <tr>
                                <td>${asistencia.nombre}</td>
                                <td style="width: 50px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="lunes" data-turno="manana">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="lunes" data-turno="tarde">    
                                </td>
                                <td style="width: 50px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="martes" data-turno="manana">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="martes" data-turno="tarde">    
                                </td>
                                <td style="width: 50px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="miercoles" data-turno="manana">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="miercoles" data-turno="tarde">    
                                </td>
                                <td style="width: 50px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="jueves" data-turno="manana">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="jueves" data-turno="tarde">    
                                </td>
                                <td style="width: 50px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="viernes" data-turno="manana">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="viernes" data-turno="tarde">    
                                </td>
                                <td style="width: 50px;">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="sabado" data-turno="manana">
                                    <input type="checkbox" class="asistencia-checkbox" data-personal-id="${asistencia.id}" data-dia="sabado" data-turno="tarde">    
                                </td>
                                <td><span class="form-control total-dias"></span></td>
                                
                                <td>
                                    <select class="form-control" name="rol" id="rol">
                                    </select>
                                </td>
                                
                                <td><input class="form-control" type="text" name="trabajo" id=""></td>
                                <td><input class="form-control" type="number" name="adelanto" id="adelanto"></td>
                                <td><input class="form-control" type="number" name="comida" id="comida"></td>
                                <td><input class="form-control" type="number" name="viaje" id="viaje"></td>
                                <td><input class="form-control" type="number" name="domingos" id="domingos"></td>
                                <td><input class="form-control" type="number" name="extras" id="extras"></td>
                                <td><input class="form-control" type="number" name="bonificacion" id="bonificacion"></td>
                                <td><span class="form-control" id="sueldoMensual">0</span></td>
                                <td><span class="form-control" id="sueldoSemanal">0</span></td>
                        </tr>`;

                    $('#tablaEmpleados tbody').append(rowHtml);
                })
                configurarSumaTotalDias()
                cargarRoles();
                actualizarSueldos()
                $('#adelanto').on('input', function () {
                    actualizarSueldos();
                });
            
                $('#comida, #viaje, #domingos, #extras, #bonificacion').on('input', function () {
                    actualizarSueldos();
                });
            } catch (error) {
                console.error(error);
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
    // Resto de tu código ...

    function actualizarSueldos() {
        // Obtener los valores actuales de adelanto, comida, viaje, domingos, extras y bonificación
        let adelanto = parseFloat($('#adelanto').val()) || 0;
        let comida = parseFloat($('#comida').val()) || 0;
        let viaje = parseFloat($('#viaje').val()) || 0;
        let domingos = parseFloat($('#domingos').val()) || 0;
        let extras = parseFloat($('#extras').val()) || 0;
        let bonificacion = parseFloat($('#bonificacion').val()) || 0;

        // Calcular sueldoMensual
        let sueldoMensual = sueldoMensualGlobal - adelanto + comida + viaje + domingos + extras + bonificacion;

        // Obtener el sueldo semanal máximo de la base de datos para el rol seleccionado
        let sueldoSemanalMaximo = sueldoSemanalGlobal - adelanto + comida + viaje + domingos + extras + bonificacion;

        console.log('sueldoSemanalMaximo: '+sueldoSemanalMaximo);

        // Obtener el número total de turnos (suponiendo 2 turnos por día durante 6 días)
        let totalTurnos = 12;

        // Obtener el número de turnos asistidos
        let turnosAsistidos = parseFloat($('.total-dias').text()) * 2;
        console.log('turnosAsistidos: '+turnosAsistidos);
        // Obtener el número de turnos no asistidos
        let turnosNoAsistidos = turnosAsistidos - totalTurnos;
        console.log('turnosNoAsistidos: '+ turnosNoAsistidos);

        // Calcular la contribución de cada turno asistido al sueldo semanal
        let sueldoSemanalPorTurnoAsistido = sueldoSemanalMaximo / totalTurnos;
        console.log('sueldoSemanalPorTurnoAsistido: '+ sueldoSemanalPorTurnoAsistido);

        // Dividir el sueldo semanal ajustado por el número total de turnos
        let sueldoSemanalDividido = sueldoSemanalPorTurnoAsistido * turnosAsistidos || sueldoSemanalMaximo;
        console.log('sueldoSemanalDividido:' + sueldoSemanalDividido);

        // Actualizar los valores en los elementos span sueldoMensual y sueldoSemanal
        $('#sueldoMensual').text(sueldoMensual);
        $('#sueldoSemanal').text(sueldoSemanalDividido.toFixed());
    }

// Resto de tu código ...

    
    function configurarSumaTotalDias() {
        // Detectar cambios en los checkboxes con la clase 'asistencia-checkbox'
        $('.asistencia-checkbox').change(function () {
            let totalDias = 0;
    
            // Obtener el elemento 'total-dias' específico de la fila actual
            let $totalDiasElement = $(this).closest('tr').find('.total-dias');
    
            // Iterar sobre todos los checkboxes en la fila actual
            $(this).closest('tr').find('.asistencia-checkbox:checked').each(function () {
                // Sumar 0.5 por cada checkbox seleccionado
                totalDias += 0.5;
            });
    
            // Actualizar el valor del campo 'total-dias' específico de la fila actual
            $totalDiasElement.text(totalDias);
    
            // Llamar a la función actualizarSueldos después de cambiar 'total-dias'
            actualizarSueldos();
        });
    }
    async function cargarRoles() {
        let data = await fetch('/filippi/Controllers/rolesController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=obtener_roles'
        });
    
        if (data.ok) {
            let response = await data.text();
            console.log(response);
            try {
                let roles = JSON.parse(response);
    
                $('[name^="rol"]').empty();
    
                roles.forEach(rol => {
                    $('[name^="rol"]').append(`<option value="${rol.id}" data-sueldo-mensual="${rol.sueldo_mensual}" data-sueldo-semanal="${rol.sueldo_semanal}">${rol.nombre}</option>`);
                    sueldoSemanalPorTurno = parseFloat(rol.sueldo_semanal) / 6; // Calcular la contribución de cada turno al sueldo semanal
                });
    
                // Agregar evento change al elemento select
                $('[name^="rol"]').change(function () {
                    // Obtener el sueldo mensual y semanal del rol seleccionado
                    sueldoMensualGlobal = parseFloat($('[name^="rol"] option:selected').data('sueldo-mensual')) || 0;
                    sueldoSemanalGlobal = parseFloat($('[name^="rol"] option:selected').data('sueldo-semanal')) || 0;
    
                    // Asignar los valores a los elementos p correspondientes
                    $('#sueldoMensual').text(sueldoMensualGlobal);
                    $('#sueldoSemanal').text(sueldoSemanalGlobal);
    
                    // Llamar a la función actualizarSueldos después de seleccionar un rol
                    actualizarSueldos();
                })
            } catch (error) {
                console.error(error);
            }
        }
    }
    // async function showAssistPersonal(){
    //     let funcion = "";
    //     let data = await fetch('/filippi/Controllers/asistenciaController.php', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //         body: 'funcion=' + funcion
    //     });
    
    //     if(data.ok){
    //         let response = await data.text();
    //         console.log(response);
    //             try {
    //             let asistencias = JSON.parse(response)
                
    //         } catch (error) {
    //             console.error(error);
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error',
    //                 text: 'hubo conflicto en el sistema, pongase en contacto con el administrador'
    //             })
    //         }
    //     }
    //     else{
    //         Swal.fire({
    //             icon: 'error',
    //             title: data.statusText,
    //             text: 'hubo conflicto de codigo: '+data.status
    //         })
    //     }
    // }
    // 

    // ARCHIVOS
    
    
    
    
    
    
    
    
    
    function rellenar_archivos_personal() {
        let funcion = 'rellenar_archivos_personal';
        $.post('/filippi/Controllers/ArchivosController.php', { funcion }, (response) => {
            let archivos = JSON.parse(response);
            let template = '';
            
            if (archivos.length === 0) {
                
                $('#tipo_archivos_personal').empty();
                return;
            }
            else{
                archivos.forEach(archivo => {
                    template += `
                        <option value="${archivo.id}">${archivo.nombre}</option>
                    `;
                });
            }
            
            $('#tipo_archivos_personal').html(template);
        });
    }
    $('#archivo').change(function () {
        let archivos = this.files;
        let archivosLista = $('#personal-archivos-lista');

        for (let i = 0; i < archivos.length; i++) {
            let archivo = archivos[i];

            if (archivo.type === 'application/pdf') {
                let archivoItem = $('<li class="archivo-list-item"><div class="archivo-details"><div class="archivo-name">' + archivo.name + '</div><i class="fas fa-check badge badge-success rounded"></i></div><button class="btn btn-sm btn-danger eliminar-archivo"><i class="fas fa-trash-alt"></i></button></li>');

                archivosLista.append(archivoItem);
            } else {
                toastr.error('El archivo "' + archivo.name + '" no es un PDF válido. Solo se permiten archivos PDF.', 'Error');
            }
            }
    });
    $('#personal-archivos-lista').on('click', '.eliminar-archivo', function () {
        const archivoItem = $(this).closest('.archivo-list-item');
        const archivoName = archivoItem.find('.archivo-name').text();
        
        const input = document.getElementById('archivo');
        for (let i = 0; i < input.files.length; i++) {
            if (input.files[i].name === archivoName) {
                input.files = new DataTransfer().files;
                break;
            }
        }
        archivoItem.remove();
    });
    $(document).on('click', '.ver', function (e) {
        e.preventDefault(); 
        const id = $(this).attr('perId');
        obtenerArchivosPersonal(id)
        const nombre = $(this).attr('perNombre');
        const dni = $(this).attr('perDni');
        const cuil = $(this).attr('perCuil');
        const fecha_ingreso = $(this).attr('perFechaingreso');
        const obra_social = $(this).attr('perObrasocial');
        const direccion = $(this).attr('perDireccion');
        
            let funcion = "adjuntar_archivo_personal";
            const idTipoArchivo = $('#tipo_archivos_personal').val();
        
            $('#personal-archivos-lista').empty();
            $('#funcion-personal-pdf').val(funcion);
            const nombreArchivo = $('#archivo').val();
            $('#nombre-archivo-pdf').val(nombreArchivo);
            $('#id-personal-pdf').val(id);
            $('#id-tipo-archivo-pdf').val(idTipoArchivo);
    
        $('#nombre_int').text(nombre)
        $('#dni_int').text(dni)
        $('#cuil_int').text(cuil)
        $('#fecha_ingreso_int').text(fecha_ingreso)
        $('#obra_social_int').text(obra_social)
        $('#direccion_int').text(direccion)
        $('#id_int').text(id)
    });
    $('#form-adjuntar-archivo-personal').submit((e) => {
        e.preventDefault();
        const formData = new FormData($('#form-adjuntar-archivo-personal')[0]);
        $.ajax({
                url:'/filippi/Controllers/ArchivosController.php',
                type:'POST',
                data: formData,
                cache: false,
                processData: false,
                contentType: false
            }).done(function(response){
                const json = JSON.parse(response);
                if (json.alert == 'edit') {
                    toastr.success('Archivo PDF adjuntado con éxito! Ya puedes verlo reflejado en la busqueda de tus archivos', 'Éxito');
                    $('#form-adjuntar-archivo-personal').trigger('reset');
                    $('#archivo').trigger('reset');
                    $('#archivos-lista').empty();
                    const id = $('.ver').attr('perId');
                    obtenerArchivosPersonal(id);
                }  
                else if( json.alert == 'exist'){
                    toastr.error('No se pudo registrar el archivo, verifique si selecciono alguno', 'Error');
                    $('#form-adjuntar-archivo-personal').trigger('reset');
                    $('#archivo').trigger('reset');
                    $('#archivos-lista').empty();
                }
                else if( json.alert == 'novalid'){
                    toastr.error('El archivo no es un PDF válido o supera el límite de tamaño permitido', 'Error');
                    $('#form-adjuntar-archivo-personal').trigger('reset');
                    $('#archivo').trigger('reset');
                    $('#archivos-lista').empty();

                }
                else if( json.alert == 'noedit'){
                    toastr.error('Ya existe un archivo con el mismo nombre y vehículo.', 'Error');
                    $('#form-adjuntar-archivo-personal').trigger('reset');
                    $('#archivo').trigger('reset');
                    $('#archivos-lista').empty();

                }
                else {
                    toastr.error('El archivo no cumple con los requisitos de tamaño. No se pudo subir el archivo', 'Error');
                    $('#form-adjuntar-archivo-personal').trigger('reset');
                    $('#archivo').trigger('reset');
                    $('#archivos-lista').empty();
                }
            });
    });
    $('#tipo_archivos_personal').on('change', function() {
        const idTipoArchivo = $(this).val();
        $('#id-tipo-archivo-pdf').val(idTipoArchivo);
    });
    async function obtenerArchivosPersonal(personalId) {
        let funcion = "obtener_archivos_personal";
        let data = new FormData();
        data.append('funcion', funcion);
        data.append('personal_id', personalId);
    
        try {
            const response = await fetch('/filippi/Controllers/ArchivosController.php', {
                method: 'POST',
                body: data,
            });
    
            if (response.ok) {
                const archivos = await response.json();
    
                const selectTipoArchivo = document.getElementById('tipo_archivos-select');
                selectTipoArchivo.innerHTML = '';
    
                const tiposDeArchivoUnicos = [...new Set(archivos.map(archivo => archivo.tipo_archivo_personal))];
    
                if (tiposDeArchivoUnicos.length > 0) {
                    tiposDeArchivoUnicos.forEach(tipoArchivo => {
                        const option = document.createElement('option');
                        option.value = tipoArchivo;
                        option.textContent = tipoArchivo;
                        selectTipoArchivo.appendChild(option);
                    });
    
                    mostrarArchivosFiltrados(archivos, tiposDeArchivoUnicos[0]);
                    selectTipoArchivo.style.display = 'block';
                } else {
                    selectTipoArchivo.style.display = 'none';
                    const archivosList = document.getElementById('archivos-list');
                    archivosList.innerHTML = `<p>No hay archivos adjuntos</p><br><p>Cerrá esta <b>Pestaña Emergente</b> y volve a abrir para ver reflejado los cambios</p>.`;
                }
    
                selectTipoArchivo.addEventListener('change', (e) => {
                    const selectedTipoArchivo = selectTipoArchivo.value;
                    const archivosFiltrados = archivos.filter(archivo => archivo.tipo_archivo_personal === selectedTipoArchivo);
    
                    let archivosTemplate = '';
    
                    archivosFiltrados.forEach(archivo => {
                        archivosTemplate += `
                            <li class="archivo-item mb-1 mr-1">
                                <span class="nombre-archivo">${archivo.nombre}</span>
                                <button data-id="${archivo.id}" data-ruta="${archivo.ruta}" class="btn btn-success float-end descargar"><i class="fas fa-print" style="color: white;"></i></button>
                                <button data-id="${archivo.id}" data-ruta="${archivo.ruta}" class="btn btn-danger float-end borrar-archivo" data-tipo="${archivo.tipo_archivo_personal}"><i class="fas fa-trash" style="color: white;"></i></button></li>
                            <hr>
                        `;
                    });
                    e.preventDefault()
    
                    const archivosList = document.getElementById('archivos-list');
                    archivosList.innerHTML = archivosTemplate;  

                    const botonesBorrar = document.querySelectorAll('.borrar-archivo');
                    botonesBorrar.forEach(boton => {
                        boton.addEventListener('click', (e) => {
                            e.preventDefault();
                            let id = boton.getAttribute('data-id');
                            let ruta = boton.getAttribute('data-ruta');
                            let tipo = boton.getAttribute('data-tipo');
                            borrarArchivo(id, ruta, tipo);
                        });
                    });
                    const botonesDescargar = document.querySelectorAll('.descargar');
                    botonesDescargar.forEach(boton => {
                        boton.addEventListener('click', (e) => {
                            e.preventDefault(); 
                            let id = boton.getAttribute('data-id');
                            let ruta = boton.getAttribute('data-ruta');
                            descargarPDF(id, ruta);
                        });
                    });
                });
    
            } else {
                console.error('Error al obtener archivos.');
            }
        } catch (error) {
            console.error('Error en la solicitud fetch:', error);
        }
    }
    function mostrarArchivosFiltrados(archivos, selectedTipoArchivo) {
        const archivosFiltrados = archivos.filter(archivo => archivo.tipo_archivo_personal === selectedTipoArchivo);
    
        let archivosTemplate = '';
    
        archivosFiltrados.forEach(archivo => {
            archivosTemplate += `
                <li class="archivo-item mb-1 mr-1">
                    <span class="nombre-archivo">${archivo.nombre}</span>
                    <button data-id="${archivo.id}" data-ruta="${archivo.ruta}" class="btn btn-success float-end descargar"><i class="fas fa-print" style="color: white;"></i></button>
                    <button data-id="${archivo.id}" data-ruta="${archivo.ruta}" class="btn btn-danger float-end borrar-archivo"><i class="fas fa-trash" style="color: white;"></i></button>
                </li>
                <hr>
            `;
        });
    
        const archivosList = document.getElementById('archivos-list');
        archivosList.innerHTML = archivosTemplate;
    
        const botonesBorrar = document.querySelectorAll('.borrar-archivo');
        botonesBorrar.forEach(boton => {
            boton.addEventListener('click', (e) => {
                e.preventDefault();
                let id = boton.getAttribute('data-id');
                let ruta = boton.getAttribute('data-ruta');
                borrarArchivo(id, ruta);
            });
        });
    
        const botonesDescargar = document.querySelectorAll('.descargar');
        botonesDescargar.forEach(boton => {
            boton.addEventListener('click', (e) => {
                e.preventDefault();
                let id = boton.getAttribute('data-id');
                let ruta = boton.getAttribute('data-ruta');
                descargarPDF(id, ruta);
            });
        });
    }
    function descargarPDF(id, ruta) {
        window.open(ruta , '_blank');
    }
    async function borrarArchivo(id, ruta) {
        let funcion = "borrar_archivo";
        let data = new FormData();
        data.append('funcion', funcion);
        data.append('id', id);
        data.append('ruta', ruta);
        const resultado = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el archivo permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (resultado.isConfirmed) {

            try {
                const response = await fetch('/filippi/Controllers/ArchivosController.php', {
                    method: 'POST',
                    body: data,
                });

                if (response.ok) {
                    Swal.fire('Archivo eliminado', 'El archivo se ha eliminado con éxito.', 'success');
                    
                    const id = $('.ver').attr('perId');
                    obtenerArchivosPersonal(id);
                } else {
                    console.error('Error al intentar borrar el archivo.');
                    Swal.fire('Error', 'No se pudo eliminar el archivo.', 'error');
                }
            } catch (error) {
                console.error('Error en la solicitud fetch:', error);
                Swal.fire('Error', 'Ocurrió un error en la solicitud de eliminación.', 'error');
            }
        }
    }
    // FIN ARCHIVOS



    
    
    
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
