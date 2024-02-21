$(document).ready(function(){
    Loader('Cargando Datos');
    verificar_sesion();
    toastr.options={
        "preventDuplicates":true
    }
    let edit = false
    let datatable;
    let totalOriginal;
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
                    rellenar_proveedor();
                    // rellenar_tipo_registro();
                    obtenerTotalDeTotales()
                    calcularSituacionFrenteAlIVA()
                    obtenerTiposRegistrosFactura()
                    obtener_facturas()
                    rellenar_factura()
                    calcularTotal();
                    rellenar_vehiculo()
                    obtenerOpcionesFactura()
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

    function calcularTotal() {
        $("#calc_iva").text("0.00");
        $("#calc_itc").text("0.00");
        $("#calc_idc").text("0.00");
        $("#calc_perc_iibb").text("0.00");
        $("#calc_perc_iva").text("0.00");
        $("#calc_otro_impuestos").text("0.00");
        $("#calc_descuento").text("0.00");
    
        let subtotal = parseFloat($("#subtotal").val()) || 0;
    
        function mostrarImpuesto(impuestoId, campoResultadoId) {
            let impuesto = parseFloat($("#" + impuestoId).val()) || 0;
            
            $("#" + campoResultadoId).text(impuesto.toFixed(2));
            
            return impuesto;
        }
    
        let totalImpuestos = 0;
    
        totalImpuestos += mostrarImpuesto("iva", "calc_iva");
        totalImpuestos += mostrarImpuesto("itc", "calc_itc");
        totalImpuestos += mostrarImpuesto("idc", "calc_idc");
        totalImpuestos += mostrarImpuesto("perc_iibb", "calc_perc_iibb");
        totalImpuestos += mostrarImpuesto("perc_iva", "calc_perc_iva");
        totalImpuestos += mostrarImpuesto("otros_impuestos", "calc_otro_impuestos");
    
        let descuentoPorcentaje = parseFloat($("#descuento").val()) || 0;
    
        let descuento = descuentoPorcentaje * subtotal / 100;
    
        $("#calc_descuento").text(descuento.toFixed(2));
    
        let total = subtotal - descuento + totalImpuestos;
    
        $("#total").text(total.toFixed(2));
    }

    $("#subtotal, #iva, #itc, #idc, #perc_iibb, #perc_iva, #otros_impuestos, #descuento").on("input", function () {
        calcularTotal();
    });

    async function obtenerMeses() {
        let funcion = "obtener_meses_recibidos";
        let data = await fetch('/filippi/Controllers/FacturacionController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=' + funcion
        });
    
        if (data.ok) {
            let response = await data.json();
            response.forEach(mes => {
                mes.nombre = mesesEnEspañol[mes.nombre.split('-')[1]]; // Obtener el nombre del mes y convertirlo
            });
            return response;
        } else {
            console.error("Error al obtener los meses");
            return [];
        }
    }
    
    async function obtener_facturas() {
        let funcion = "obtener_facturas";
        let data = await fetch('/filippi/Controllers/FacturacionController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=' + funcion
        });
        
        if (data.ok) {
            let response = await data.text();
            try {
                let facturas = JSON.parse(response);
                let meses = await obtenerMeses();

                let selectMes = $('#filtroMes');
                selectMes.empty();
                selectMes.append('<option value="">Todos los meses</option>'); // Opción por defecto
                meses.forEach(mes => {
                    selectMes.append(`<option value="${mes.valor}">${mes.nombre}</option>`);
                });

                facturas.forEach(objeto => {
                    objeto.subtotal = formatCurrency(objeto.subtotal, '$ ');
                    objeto.iva = formatCurrency(objeto.iva, '$ ');
                    objeto.itc = formatCurrency(objeto.itc, '$ ');
                    objeto.idc = formatCurrency(objeto.idc, '$ ');
                    objeto.perc_iibb = formatCurrency(objeto.perc_iibb, '$ ');
                    objeto.perc_iva = formatCurrency(objeto.perc_iva, '$ ');
                    objeto.otros_im = formatCurrency(objeto.otros_im, '$ ');
                    objeto.descuento = formatCurrency(objeto.descuento, '$ ');
                    objeto.total = formatCurrency(objeto.total, '$ ');
                });
                datatable = $('#obtener-recibidas').DataTable({
                    "data": facturas,
                    "aaSorting": [],
                    "scrollX": false,
                    "autoWidth": false,
                    paging: true,
                    bInfo: false,
                    columns: [
                        { data: "fecha" },
                        { data: "razon_social" },
                        { data: "num_factura" },
                        { data: "subtotal" },
                        { data: "iva" },
                        { data: "itc" },
                        { data: "idc" },
                        { data: "perc_iibb" },
                        { data: "perc_iva" },
                        { data: "otros_im" },
                        { data: "descuento" },
                        { data: "total" },
                        { data: "vehiculo_datos" },
                        { data: "tipo_gasto" },
                        {
                            "defaultContent": `
                                <button class="editar btn btn-success" type="button" data-toggle="modal" data-target="#crear-factura">
                                    <i class="fas fa-pencil-alt" style="color: white;"></i>
                                </button>
                                <button class="anular btn btn-danger" type="button">
                                    <i class="fas fa-times" style="color:white;"></i>
                                </button>`
                        }
                        
                    ],
                    "language": espanol,
                    "destroy": true,
                });
                $('#filtroMes').on('change', function () {
                    let mesSeleccionado = $(this).val();
                    let fechaFiltro = ''; // Inicializar la variable del filtro
                    if (mesSeleccionado !== '') {
                        // Dividir el valor del mes seleccionado para obtener el año y el mes
                        let partes = mesSeleccionado.split('-');
                        // Obtener el año y el mes de las partes
                        let año = partes[0];
                        let mes = partes[1];
                        // Formatear la fecha al formato "YYYY-MM"
                        fechaFiltro = año + '-' + mes;
                    }
                    // Aplicar el filtro a la columna de fechas y dibujar la tabla
                    datatable.column(0).search(fechaFiltro).draw();
                });
                
                
                
                
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
                text: 'Hubo conflicto de código: ' + data.status
            });
        }
    }

    // CRUD

    
    $('#form-crear-factura').submit(function (e) {
        e.preventDefault();
    

        let id = $('#editar_factura_id').val();

        let tipoVenta = $('#tipo_registro_id').val();
        let tipoRegistroId= $('#tipo_registro').val();
    

        let fecha = $("#fecha").val();
        let comprobante = $('#comprobante').val();
        let punto_venta = $('#punto_venta').val();
        let numeroFactura = $('#numero_factura').val();
        let razonSocial = $('#razon_social').val();
        
        let equipo = $('#equipo').val();
        let subtotal = parseFloat($('#subtotal').val()) || 0;
    
        let iva = parseFloat($('#calc_iva').text()) || 0;
        let itcValue = parseFloat($('#calc_itc').text()) || 0;
        let idcValue = parseFloat($('#calc_idc').text()) || 0;
        let percIibb = parseFloat($('#calc_perc_iibb').text()) || 0;
        let percIvaValue = parseFloat($('#calc_perc_iva').text()) || 0;
        let otrosImpuestos = parseFloat($('#calc_otro_impuestos').text()) || 0;
        let descuentoValue = parseFloat($('#calc_descuento').text()) || 0;
    
        calcularTotal();
    
        let totalNuevo = parseFloat($('#total').text()) || 0;
        if (!razonSocial || !fecha || !comprobante || !punto_venta || !numeroFactura || isNaN(subtotal) || subtotal < 0)  {
            toastr.error('Hay algun dato que pasaste por alto que es importante para el registro', 'Error');
            return;
        }
        if(edit==true){
            funcion="editar";
        }
        else{
            funcion="registrar_factura";
        }
    
        // Realizar la llamada AJAX al servidor para registrar la factura
        $.ajax({
            type: 'POST',
            url: '/filippi/Controllers/FacturacionController.php',
            data: {
                id: id,
                funcion: funcion,
                fecha: fecha,
                comprobante: comprobante,
                puntoVenta: punto_venta,
                tipoRegistroId: tipoRegistroId,
                tipoVenta: tipoVenta,
                numeroFactura: numeroFactura,
                razonSocial: razonSocial,
                equipo: equipo,
                subtotal: subtotal,
                iva: iva,
                itc: itcValue,
                idc: idcValue,
                percIibb: percIibb,
                percIva: percIvaValue,
                otrosImpuestos: otrosImpuestos,
                descuento: descuentoValue,
                total: (totalNuevo !== totalOriginal) ? totalNuevo : totalOriginal
            },
            success: function (response) {
                if (response === 'add') {
                    toastr.success('Factura creada con éxito', 'Éxito');
                    $('#form-crear-factura').trigger('reset');
                    location.href= "/filippi/Views/facturacion-recibido.php"
                }else if (response === 'edit') {
                    toastr.success('Factura editada con éxito', 'Éxito');
                    $('#form-crear-factura').trigger('reset');
                    
                } else {
                    toastr.error('No se pudo crear la factura', 'Error');
                }
                edit = false
            },
            error: function (xhr, status, error) {
                console.log(error)
                console.error(xhr.responseText);
                toastr.error('Hubo un error en el servidor', 'Error');
            }
        });
    });
    $('#tipo_registro').change(function () {
        calcularTotal();
    
        // Obtener el valor seleccionado del tipo de registro y actualizar el campo oculto
        let tipoRegistroIdEmitido = $(this).val();
        $('#tipo_registro_id').val(tipoRegistroIdEmitido);
    
        // Restaurar el valor original del total solo si totalOriginal tiene un valor válido
        if (totalOriginal !== 0) {
            $('#total').text(totalOriginal);
        }
    });
    $('#obtener-recibidas tbody').on('click', '.editar', function() {
        let datos = datatable.row($(this).parents()).data();
        let id = datos.id;
        let factura = datos.num_factura;
        let dividirDatos = factura.split('-');
        let tipo_factura = datos.id_tipo_factura;
        let punto_venta = dividirDatos[1];
        let numero_factura = dividirDatos[2];

        let tipos_registro = datos.id_registro;

        let fecha = datos.fecha;
        let razon_social = datos.id_proveedor;
        let cuit = datos.cuit;
        let vehiculo_datos = datos.id_vehiculo;
        let subtotal = removeCurrencyFormat(datos.subtotal);
        let iva = removeCurrencyFormat(datos.iva);
        let idc = removeCurrencyFormat(datos.idc);
        let itc = removeCurrencyFormat(datos.itc);
        let otros_im = removeCurrencyFormat(datos.otros_im);
        let perc_iibb = removeCurrencyFormat(datos.perc_iibb);
        let perc_iva = removeCurrencyFormat(datos.perc_iva);
        let descuento = removeCurrencyFormat(datos.descuento);
        let total = removeCurrencyFormat(datos.total);

        totalOriginal = total;

        $('#editar_factura_id').val(id)
        let tipoRegistroActual = tipos_registro;
        cargarOpcionesTipoRegistro(tipoRegistroActual);
        $('#tipo_registro_id').val(tipoRegistroActual);
        
        $('#razon_social').val(razon_social);
        $('#fecha').val(fecha);
        $('#punto_venta').val(punto_venta);
        $('#comprobante').val(tipo_factura);
        $('#numero_factura').val(numero_factura);
        $('#cuit').val(cuit);
        $('#equipo').val(vehiculo_datos);
        $('#subtotal').val(+subtotal);
        $('#calc_iva').text(iva);
        $('#iva').val(+iva);
        $('#calc_itc').text(itc);
        $('#itc').val(+itc);
        $('#calc_idc').text(idc);
        $('#idc').val(+idc);
        $('#calc_perc_iibb').text(perc_iibb);
        $('#perc_iibb').val(+perc_iibb);
        $('#calc_perc_iva').text(perc_iva);
        $('#perc_iva').val(+perc_iva);
        $('#calc_otro_impuestos').text(otros_im);
        $('#otros_impuestos').val(+otros_im);
        $('#calc_descuento').text(descuento);
        $('#descuento').val(+descuento);
        $('#total').text(totalOriginal);
        
         edit = true
    });
    
    $('#obtener-recibidas tbody').on('click', '.anular', function() {
        let datos = datatable.row($(this).parents()).data();
        let idFactura = datos.id;
        let factura = datos.num_factura;
        let dividirDatos = factura.split('-');
        let numero_factura = dividirDatos[2];
        Swal.fire({
            title: "¿Estás seguro?",
            text: 'Podrás revertir esto, en la seccion "Papelera" buscalo como: '+ numero_factura,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, anular factura"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await anularFactura(idFactura, numero_factura);
            }
        });
    });
    async function anularFactura(idFactura, numero_factura) {
        let funcion = "borrar";
        let data = await fetch('/filippi/Controllers/FacturacionController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=' + funcion + '&&idFactura=' + idFactura + '&&numeroFactura='+numero_factura
        });
    
        if (data.ok) {
            let response = await data.text();
    
            if (response=='borrado') {
                Swal.fire('Factura anulada con éxito', '', 'success');
                obtener_facturas();
            } else {
                Swal.fire('Error al anular la factura', 'Hubo un problema al anular la factura', 'error');
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: data.statusText,
                text: 'Hubo un problema al comunicarse con el servidor'
            });
        }
    }

    function formatCurrency(value, symbol = '') {
        return symbol + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    function removeCurrencyFormat(value) {
        return value.replace(/[$,]/g, '');
    }

    function cargarOpcionesTipoRegistro(tipoRegistroSeleccionado) {
        let funcion = "rellenar_tipo_registro";
    
        $.ajax({
            url: '/filippi/Controllers/FacturacionController.php',
            method: 'POST',
            data: {
                funcion: funcion
            },
            success: function (response) {
                response = JSON.parse(response);
                if (Array.isArray(response) && response.length > 0) {
                    $('#tipo_registro').empty();
    
                    response.forEach(function (opcion) {
                        let selected = (opcion.id === tipoRegistroSeleccionado) ? 'selected' : '';
                        $('#tipo_registro').append('<option value="' + opcion.id + '" ' + selected + '>' + opcion.nombre + '</option>');
                    });
    
                    $('#tipo_registro_div').show();
                } else {
                    console.error('La respuesta no es un array o está vacía.');
                    $('#tipo_registro_div').hide();
                }
            },
            error: function (error) {
                console.error('Error al cargar opciones de tipo de registro:', error);
            }
        });
    }

    

    function rellenar_proveedor() {
        let funcion = 'rellenar_proveedores';
        $.post('/filippi/Controllers/ProveedorController.php', { funcion }, (response) => {
            let proveedores = JSON.parse(response);
            let template = '';
    
            $('#razon_social').empty();
    
            proveedores.forEach(proveedor => {
                template += `<option value="${proveedor.id}" data-cuit="${proveedor.cuit}">${proveedor.razon_social}</option>`;
            });
    
            $('#razon_social').html(template);
        });
    }

    $('#razon_social').change(function () {
        let cuit = $(this).find(':selected').attr('data-cuit');
        $('#cuit').val(cuit);
    });

    $('#close').on('click', function(){
        location.href="../Views/facturacion-recibido.php"
    })

    function rellenar_vehiculo() {
        let funcion = 'rellenar_vehiculos';
        $.post('/filippi/Controllers/vehiculosController.php', { funcion }, (response) => {
            let archivos = JSON.parse(response);
            let template = '';
            
            $('#equipo').empty();
            
            archivos.forEach(archivo => {
                template += `
                    <option value="${archivo.id}">V: ${archivo.vehiculo} | P: ${archivo.codigo}</option>
                `;
            });
            $('#equipo').html(template);
        });
    }

    function rellenar_factura() {
        let funcion = 'rellenar_factura';
        $.post('/filippi/Controllers/FacturacionController.php', { funcion }, (response) => {
            let comprobantes = JSON.parse(response);
            let template = '';
            
            $('#comprobante').empty();
            
            comprobantes.forEach(comprobante => {
                template += `
                    <option value="${comprobante.id}">${comprobante.nombre} | ${comprobante.descripcion}</option>
                `;
            });
            $('#comprobante').html(template);
        });
    }

    async function obtenerOpcionesFactura() {
        let funcion = "rellenar_tipo_registro";
        let data = await fetch('/filippi/Controllers/FacturacionController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=' + funcion
        });
    
        if (data.ok) {
            let response = await data.text();
            try {
                let facturas = JSON.parse(response);
                let template = "";
    
                facturas.forEach(opcion => {
                    template += `<div class="cards col-sm-6 mb-1 text-center" id="${opcion.id}" style="cursor: pointer;">
                                    <div class="card blue">
                                        <p class="tip">${opcion.nombre}</p>
                                        <p class="second-text"></p>
                                    </div>
                                </div>`;
                });
    
                // Mostrar el modal "opciones-factura"
                $('#opciones_factura').html(template);
    
                // Configurar el evento click para las tarjetas (cards)
                $('.cards').click(function () {
                    // Obtener el índice del elemento clicado
                    let index = $('.cards').index(this);
                
                    // Obtener la opción correspondiente en el array
                    let opcion = facturas[index];
                
                    // Ocultar el modal "opciones-factura"
                    document.getElementById('opciones-factura').style.display = 'none';
                    
                    $('#opciones-factura').hide()
                
                    // Llenar el campo correspondiente en el formulario de "crear-factura"
                    $('#tipo_venta').val(opcion.nombre);
                
                    // Llenar el campo oculto con el ID del tipo de registro
                    $('#tipo_registro_id').val(opcion.id);
                
                    // Mostrar el modal "crear-factura"
                    $('#crear-factura').modal('show');
                });
                const buttonClose = document.getElementById('close')
                buttonClose.addEventListener('click', (e)=>{
                    e.preventDefault()

                })
            } catch (error) {
                console.error(error);
                console.log(response);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un conflicto en el sistema, póngase en contacto con el administrador.'
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

    async function obtenerTiposRegistrosFactura() {
        let funcion = "obtener_opciones_factura";
        let data = await fetch('/filippi/Controllers/FacturacionController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=' + funcion
        });
    
        if (data.ok) {
            let response = await data.json();
    
            try {
                let tiposRegistro = response.tipos_registro;
                if (response.facturas && Array.isArray(response.facturas)) {
                    let facturasActivas = response.facturas.filter(factura => factura.estado === 'A');
    
                    // Crear un objeto para almacenar totales por tipo de registro
                    let totalesPorTipoRegistro = {};
    
                    // Calcular totales por tipo de registro solo para facturas activas
                    facturasActivas.forEach(factura => {
                        if (!totalesPorTipoRegistro[factura.id]) {
                            totalesPorTipoRegistro[factura.id] = 0;
                        }
                        totalesPorTipoRegistro[factura.id] += parseFloat(factura.total);
                    });
    
                    let totalActivas = facturasActivas.reduce((total, factura) => total + parseFloat(factura.total), 0);
    
                    let template = "";
    
                    tiposRegistro.forEach(opcion => {
                        let totalPorTipoRegistro = totalesPorTipoRegistro[opcion.id] || 0;
                        let porcentaje = totalPorTipoRegistro > 0 ? (totalPorTipoRegistro / totalActivas * 100).toFixed(2) : 0;
                        if(opcion.estado === "A"){
                            template+= `
                            <div class="col-md-3 col-sm-6 col-12">
                                <div class="info-box bg-gradient-info">
                                <span class="info-box-icon"><i class="fas fa-chart-line"></i></span>

                            <div class="info-box-content" id="${opcion.id}">
                                <span class="info-box-text">${opcion.nombre}</span>
                                <span class="info-box-number">${totalPorTipoRegistro} Es el total</span>

                                <div class="progress">
                                <div class="progress-bar" style="width: ${porcentaje}%"></div>
                                </div>
                                <span class="progress-description">
                                ${porcentaje}% Incremental en 30 días
                                </span>
                            </div>
                            </div>
                        </div>`
                        }else{
                            return ""
                        }
                    });
    
                    $('#widgets').html(template);
                } else {
                    console.error("La propiedad 'facturas' no está definida o no es un array en la respuesta.");
                }
            } catch (error) {
                console.error(error);
            }
        } else {
        }
    }

    $('#punto_venta').on('input', function() {
        actualizarValor(this);
    });

    function actualizarValor(input) {
        let dosUltimosDigitos = input.value.slice(-2);
        input.value = "00" + dosUltimosDigitos;
    }
    
    $('#razon_social').on(function () {
        let cuit = $(this).find(':selected').attr('data-cuit');
        $('#cuit').val(cuit);
    });
    
    $('#iva-toggle').change(function () {
        if (this.checked) {
            $('#iva-input-group').show();
        } else {
            $('#iva-input-group').hide();
        }
    });

    $('#itc-toggle').change(function () {
        if (this.checked) {
            $('#itc-input-group').show();
        } else {
            $('#itc-input-group').hide();
        }
    });

    $('#idc-toggle').change(function () {
        if (this.checked) {
            $('#idc-input-group').show();
        } else {
            $('#idc-input-group').hide();
        }
    });

    $('#iibb-toggle').change(function () {
        if (this.checked) {
            $('#iibb-input-group').show();
        } else {
            $('#iibb-input-group').hide();
        }
    });

    $('#periva-toggle').change(function () {
        if (this.checked) {
            $('#perciva-input-group').show();
        } else {
            $('#perciva-input-group').hide();
        }
    });

    $('#imp-toggle').change(function () {
        if (this.checked) {
            $('#otrosimp-input-group').show();
        } else {
            $('#otrosimp-input-group').hide();
        }
    });

    $('#desc-toggle').change(function () {
        if (this.checked) {
            $('#descuento-input-group').show();
        } else {
            $('#descuento-input-group').hide();
        }
    });
    $('#moreInfo').on('click',() => {
        location.href = '/filippi/Views/calculosMensualesRecibidos.php'
    })
    $('#papelera').on('click',() => {
        location.href = '/filippi/Views/papeleraFacturas.php'
    })
    

    
   
    // LOADER
    
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
    async function obtenerTotalDeTotales() {
        let funcion = "obtener_calculo_total_emitido";
        let data = await fetch('/filippi/Controllers/FacturacionController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=' + funcion
        });
    
        if (data.ok) {
            try {
                let facturas = await data.json();
                let totalDeTotales = facturas.reduce((total, factura) => {
                    return total + parseFloat(factura.total) || 0;
                }, 0);
    
                $('#total_totales').text(formatCurrency(totalDeTotales, '$'));
    
                return totalDeTotales;
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un conflicto en el sistema, póngase en contacto con el programador.'
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
    async function calcularSituacionFrenteAlIVA() {
        try {
            const ivaDebito = parseFloat(await obtenerCalculosEmitidos()) || 0;
            const ivaCredito = parseFloat(await obtenerCalculosRecibidos()) || 0;
    
            const situacionFrenteAlIVA = ivaDebito - ivaCredito;
    
           $('#situacion_fisco').text(formatCurrency(situacionFrenteAlIVA, '$'));
        } catch (error) {
            console.error("Error al calcular la situación frente al IVA:", error);
        }
    }
    async function obtenerCalculosEmitidos() {
        let funcion = "obtener_calculo_iva_venta";
        let data = await fetch('/filippi/Controllers/FacturacionController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=' + funcion
        });
    
        if (data.ok) {
            try {
                let response = await data.text();
    
                // Intentar hacer JSON.parse solo si la respuesta es un JSON válido
                let facturas = isValidJson(response) ? JSON.parse(response) : [];
    
                let montoTotalIVAVenta = 0;
    
                facturas.forEach(factura => {
                    montoTotalIVAVenta += parseFloat(factura.iva) || 0;
                });
    
                $('#iva_venta').text(formatCurrency(montoTotalIVAVenta, '$'));
    
                return montoTotalIVAVenta;
            } catch (error) {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un conflicto en el sistema, póngase en contacto con el programador.'
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
    async function obtenerCalculosRecibidos() {
        let funcion = "obtener_calc";
        let data = await fetch('/filippi/Controllers/FacturacionController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'funcion=' + funcion
        });
        
        if (data.ok) {
            try {
                let response = await data.text();
    
                // Intentar hacer JSON.parse solo si la respuesta es un JSON válido
                let facturas = isValidJson(response) ? JSON.parse(response) : [];
    
                let montoTotalIVA = 0;
                facturas.forEach(factura => {
                    montoTotalIVA += parseFloat(factura.iva) || 0;
                });
    
                $('#iva_compra').text(formatCurrency(montoTotalIVA, '$'));
                return montoTotalIVA;
    
            } catch (error) {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un conflicto en el sistema, póngase en contacto con el programador.'
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
    function isValidJson(str) {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }
    // FIN LOADER
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
const mesesEnEspañol = {
    "January": "Enero",
    "February": "Febrero",
    "March": "Marzo",
    "April": "Abril",
    "May": "Mayo",
    "June": "Junio",
    "July": "Julio",
    "August": "Agosto",
    "September": "Septiembre",
    "October": "Octubre",
    "November": "Noviembre",
    "December": "Diciembre"
};