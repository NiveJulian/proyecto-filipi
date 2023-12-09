$(document).ready(function(){
    
    rellenar_proveedor()
    rellenar_tipo_gasto()
    rellenar_personal()
    rellenar_vehiculos()
    actualizarOrdenCompra()
    $('#order_tipo_gasto,#num_order, #autorizado, #proveedor, #cantidad, #detalle, #obra, #equipo, #monto, #total, #observaciones').on('change', function () {
        actualizarOrdenCompra();
    });
    function obtenerFechaActual() {
        var fechaActual = new Date();
        var dia = fechaActual.getDate();
        var mes = fechaActual.getMonth() + 1; // Nota: JavaScript cuenta los meses desde 0
        var año = fechaActual.getFullYear();
    
        // Formatea la fecha como 'dd/mm/yyyy'
        var fechaFormateada = dia + '/' + mes + '/' + año;
    
        return fechaFormateada;
    }
    function actualizarOrdenCompra() {
        // Obtiene los valores de los campos del formulario
        let fecha = obtenerFechaActual();
        let tipoGasto = $('#order_tipo_gasto').val();
        let autorizado = $('#autorizado').val();
        let proveedor = $('#proveedor').val();
        
        let observaciones = $('#observaciones').val();
        $('#auth-fecha').html(fecha);
        $('#tipos-gastos').text(tipoGasto);
        $('#auth-personal').text(autorizado);
        $('#auth-proveedor').text(proveedor)
        $('#observacion').text(observaciones);

        
    }
    $('#agregar-dato').on('click', function() {
            let cantidad = $('#cantidad').val();
            let detalle = $('#detalle').val();
            let obra = $('#obra').val();
            let equipo = $('#equipo').val();
            let monto = $('#monto').val();
            let total = $('#total').text();
            let nuevaFila = '<tr>' +
                                '<td>' + cantidad + '</td>' +
                                '<td>' + detalle + '</td>' +
                                '<td>' + obra + '</td>' +
                                '<td>' + equipo + '</td>' +
                                '<td>' + monto + '</td>' +
                                '<td>' + total + '</td>' +
                            '</tr>';
            $('#tablaMateriales tbody').append(nuevaFila);
    
            // Limpiar los campos de entrada después de agregar la fila
            $('#cantidad').val('');
            $('#detalle').val('');
            $('#obra').val('');
            $('#equipo').val('');
            $('#monto').val('');
            $('#total').val('');
    });
    function rellenar_proveedor() {
        let funcion = 'rellenar_proveedores';
        $.post('/filippi/Controllers/ProveedorController.php', { funcion }, (response) => {
            let proveedores = JSON.parse(response);
            let template = '';
            proveedores.forEach(proveedor => {
                template += `<option value="${proveedor.id}">${proveedor.razon_social}</option>`;
            });
    
            $('#proveedor').html(template);
        });
    }
    function rellenar_vehiculos() {
        let funcion = 'rellenar_vehiculos';
        $.post('/filippi/Controllers/vehiculosController.php', { funcion }, (response) => {
            let vehiculos = JSON.parse(response);
            let template = '';
            vehiculos.forEach(vehiculo => {
                template += `<option value="${vehiculo.id}">${vehiculo.vehiculo}</option>`;
            });
    
            $('#equipo').html(template);
        });
    }
    function rellenar_tipo_gasto() {
        let funcion = 'rellenar_tipo_registro';
        $.post('/filippi/Controllers/FacturacionController.php', { funcion }, (response) => {
            let tipoGasto = JSON.parse(response);
            let template = '';
            tipoGasto.forEach(gasto => {
                template += `<option value="${gasto.id}">${gasto.nombre}</option>`;
            });
    
            $('#order_tipo_gasto').html(template);
        });
    }
    function rellenar_personal() {
        let funcion = 'rellenar_personal';
        $.post('/filippi/Controllers/PersonalController.php', { funcion }, (response) => {
            let personales = JSON.parse(response);
            let template = '';
            personales.forEach(personal => {
                template += `<option value="${personal.id}">${personal.nombre}</option>`;
            });
    
            $('#autorizado').html(template);
        });
    }
    
})
