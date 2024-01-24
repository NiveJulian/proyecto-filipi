$(document).ready(function(){
    Loader('Cargando Datos');
    verificar_sesion();
    toastr.options={
        "preventDuplicates":true
    }
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
                        <a href="/filippi/Views/Personal.php" class="nav-link">
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
                    obtenerTiposRegistrosFactura()
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

    async function mesesFaturasEmitidas() {
        let funcion = "obtener_meses_emitidos";
        let data = await fetch('/filippi/Controllers/FacturacionController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=' + funcion
        });

        if (data.ok) {
            let response = await data.json();
            return response;
        } else {
            console.error("Error al obtener los meses");
            return [];
        }
    }

        // Función principal para obtener tipos de registros de facturas
    async function obtenerTiposRegistrosFactura() {
        let funcion = "obtenerRegistroEmitido";
        let data = await fetch('/filippi/Controllers/FacturacionController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=' + funcion
        });
    
        if (data.ok) {
            try {
                let response = await data.json();
    
                if (response && response.facturas && Array.isArray(response.facturas)) {


                    let tiposRegistro = response.tipos_registro;

                    //POR MESES
    
                    let meses = await mesesFaturasEmitidas();
    
                    let selectMes = $('#selectMes');
                    selectMes.empty();
                    selectMes.append('<option value="">Todos los meses</option>'); // Opción por defecto
                    meses.forEach(mes => {
                        selectMes.append(`<option value="${mes.valor}">${mes.nombre}</option>`);
                    });
    
                    // Manejar el evento de cambio en el selector de meses
                    selectMes.on('change', async function() {
                        var selectedMonth = $(this).val();
                        await actualizarWidgetsPorMes(selectedMonth, response, tiposRegistro);
                    });


                    //POR TIPO DE REGISTGRO

                    let selectTipoRegistro = $('#selectGasto');
                    selectTipoRegistro.empty();
                    selectTipoRegistro.append('<option value="">Todos los gastos</option>'); // Opción por defecto
                    tiposRegistro.forEach(opcion => {
                        if (opcion.estado === 'A') {
                            selectTipoRegistro.append(`<option value="${opcion.id}">${opcion.nombre}</option>`);
                            
                        }
                    });

                    // Manejar el evento de cambio en el selector de tipos de registro
                    selectTipoRegistro.on('change', async function() {
                        var selectedTipoRegistro = $(this).val();
                        await actualizarWidgetsPorTipoRegistro(selectedTipoRegistro, response, tiposRegistro);
                    });
    
                    // Llamada inicial sin mes seleccionado
                    await actualizarWidgetsPorTipoRegistro(null, response, tiposRegistro);
                    await actualizarWidgetsPorMes(null, response, tiposRegistro);
                } else {
                    console.error("La propiedad 'facturas' no está definida o no es un array en la respuesta.");
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log("Esta habiendo un problema");
        }
    }

        // Función para actualizar widgets por mes
    async function actualizarWidgetsPorMes(mesSeleccionado, response, tiposRegistro) {
        let totalesPorTipoMes = {};

        // Filtrar facturas por el mes seleccionado
        const facturasFiltradas = mesSeleccionado
            ? response.facturas.filter(factura => factura.mes == mesSeleccionado)
            : response.facturas;

        facturasFiltradas.forEach(factura => {
            const mes = factura.mes;
            if (!totalesPorTipoMes[mes]) {
                totalesPorTipoMes[mes] = {};
            }

            tiposRegistro.forEach(opcion => {
                if (opcion.id == factura.id && opcion.estado === "A") {
                    if (!totalesPorTipoMes[mes][opcion.id]) {
                        totalesPorTipoMes[mes][opcion.id] = {
                            totalPorTipoRegistro: 0,
                            totalActivas: 0
                        };
                    }

                    let totalPorTipoRegistro = parseFloat(factura.total);
                    totalesPorTipoMes[mes][opcion.id].totalPorTipoRegistro += totalPorTipoRegistro;
                    totalesPorTipoMes[mes][opcion.id].totalActivas += totalPorTipoRegistro;
                }
            });
        });

        let tabsContent = "";

        for (const mes in totalesPorTipoMes) {
            if (totalesPorTipoMes.hasOwnProperty(mes)) {
                for (const tipoRegistroId in totalesPorTipoMes[mes]) {
                    if (totalesPorTipoMes[mes].hasOwnProperty(tipoRegistroId)) {
                        const tipoRegistro = tiposRegistro.find(opcion => opcion.id == tipoRegistroId);

                        if (!tipoRegistro) {
                            continue;
                        }

                        const totalPorTipoRegistro = totalesPorTipoMes[mes][tipoRegistroId].totalPorTipoRegistro;
                        const totalActivas = totalesPorTipoMes[mes][tipoRegistroId].totalActivas;
                        const porcentaje = (totalPorTipoRegistro / totalActivas * 100).toFixed(2);

                        let widgetId = `widget-${tipoRegistroId}-mes${mes}`;

                        tabsContent += `
                            <div class="col-md-4 col-12" id="${widgetId}">
                                <div class="info-box bg-gradient-info">
                                    <span class="info-box-icon"><i class="fas fa-chart-line" style="color:#78DA26;"></i></span>
                                    <div class="info-box-content">
                                        <span class="info-box-text">${tipoRegistro.nombre || 'Nombre no disponible'}</span>
                                        <span class="info-box-number">${totalPorTipoRegistro.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })} Es el total</span>
                                        <div class="progress">
                                            <div class="progress-bar" style="width: ${porcentaje}%"></div>
                                        </div>
                                        <span class="progress-description">${porcentaje}% Incremental en 30 días</span>
                                    </div>
                                </div>
                            </div>`;
                    }
                }
            }
        }

        $('#widgets').html(tabsContent);
    }

    async function actualizarWidgetsPorTipoRegistro(tipoRegistroSeleccionado, response, tiposRegistro) {
        let totalesPorTipoRegistro = {};
        // ... (tu código actual)
    
        // Filtrar facturas por el tipo de registro seleccionado
        const facturasFiltradas = tipoRegistroSeleccionado
            ? response.facturas.filter(factura => factura.id == tipoRegistroSeleccionado)
            : response.facturas;
    
            facturasFiltradas.forEach(factura => {
                const nombre = factura.nombre;
                if (!totalesPorTipoRegistro[nombre]) {
                    totalesPorTipoRegistro[nombre] = {};
                }
    
                tiposRegistro.forEach(opcion => {
                    if (opcion.id == factura.id && opcion.estado === "A") {
                        if (!totalesPorTipoRegistro[nombre][opcion.id]) {
                            totalesPorTipoRegistro[nombre][opcion.id] = {
                                totalPorTipoRegistro: 0,
                                totalActivas: 0
                            };
                        }
    
                        let totalPorTipoRegistro = parseFloat(factura.total);
                        totalesPorTipoRegistro[nombre][opcion.id].totalPorTipoRegistro += totalPorTipoRegistro;
                        totalesPorTipoRegistro[nombre][opcion.id].totalActivas += totalPorTipoRegistro;
                    }
                });
            });
    
            let tabsContent = "";
    
            for (const nombre in totalesPorTipoRegistro) {
                if (totalesPorTipoRegistro.hasOwnProperty(nombre)) {
                    for (const tipoRegistroId in totalesPorTipoRegistro[nombre]) {
                        if (totalesPorTipoRegistro[nombre].hasOwnProperty(tipoRegistroId)) {
                            const tipoRegistro = tiposRegistro.find(opcion => opcion.id == tipoRegistroId);
    
                            if (!tipoRegistro) {
                                continue;
                            }
    
                            const totalPorTipoRegistro = totalesPorTipoRegistro[nombre][tipoRegistroId].totalPorTipoRegistro;
                            const totalActivas = totalesPorTipoRegistro[nombre][tipoRegistroId].totalActivas;
                            const porcentaje = (totalPorTipoRegistro / totalActivas * 100).toFixed(2);
    
                            let widgetId = `widget-${tipoRegistroId}-nombre${nombre}`;
    
                            tabsContent += `
                                <div class="col-md-4 col-12" id="${widgetId}">
                                    <div class="info-box bg-gradient-info">
                                        <span class="info-box-icon"><i class="fas fa-chart-line" style="color:#78DA26;"></i></span>
                                        <div class="info-box-content">
                                            <span class="info-box-text">${tipoRegistro.nombre || 'Nombre no disponible'}</span>
                                            <span class="info-box-number">${totalPorTipoRegistro.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })} Es el total</span>
                                            <div class="progress">
                                                <div class="progress-bar" style="width: ${porcentaje}%"></div>
                                            </div>
                                            <span class="progress-description">${porcentaje}% Incremental en 30 días</span>
                                        </div>
                                    </div>
                                </div>`;
                        }
                    }
                }
            }
    
        $('#widgets').html(tabsContent);
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
})