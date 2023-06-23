$(document).ready(function(){
    
    let funcion="listar";
    let datatable = $('#tabla_venta').DataTable({
        ajax: {
            "url": "../controladores/ventaController.php",
            "method": "POST",
            "data": {funcion:funcion}
        },
        columns: [
            { data: 'id_venta' },
            { data: 'fecha' },
            { data: 'cliente' },
            { data: 'firma' },
            { data: 'total' },
            { data: 'vendedor'},
            { "defaultContent": `<button id="button_imprimir" class="imprimir btn btn-secondary"><i class="fas fa-print"></i></button>
                                <button id="button_ver" class="ver btn btn-success" type="button" data-toggle="modal" data-target="#vista_venta"><i class="fas fa-search"></i></button>
                                <button id="button_borrar" class="borrar btn btn-danger"><i class="fas fa-window-close"></i></button>`}
        ],
        "language": espanol
    });
     
    $('#tabla_venta tbody').on('click','.imprimir', function() {
        let datos = datatable.row($(this).parents()).data();
        let id = datos.id_venta;
        $.post('../controladores/PDFController.php',{id},(response)=>{
            console.log(response);
            window.open('../pdf/pdf-'+id+'.pdf', '_blank')
        })
        
    })
    $('#tabla_venta tbody').on('click', '.borrar', function(){
        let datos = datatable.row($(this).parents()).data();
        let id = datos.id_venta;
        funcion="borrar_venta";
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success m-1',
              cancelButton: 'btn btn-danger m-1'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Estas seguro que deseas eliminar la Venta: '+id+' ?',
            text: "No podras revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, Borra esto!',
            cancelButtonText: 'No, cancela!',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
                $.post('../controladores/detalleVentaController.php',{funcion,id}, (response)=>{
                    if(response=='delete'){
                        swalWithBootstrapButtons.fire(
                            'Eliminado!',
                            'Tu venta: '+id+' fue eliminada.',
                            'success'
                          )
                    }
                    else if(response=='nodelete'){
                        swalWithBootstrapButtons.fire(
                            'Cancelado',
                            'No tenes permiso para eliminar esta venta :)',
                            'error'
                          )
                        
                    }
                })
              
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                'Tu venta no fue eliminada :)',
                'error'
              )
            }
          })
    })
    $('#tabla_venta tbody').on('click', '.ver', function(){
        let datos = datatable.row($(this).parents()).data();
        let id = datos.id_venta;
        funcion="ver";
        $('#codigo_venta').html(datos.id_venta);
        $('#fecha').html(datos.fecha);
        $('#cliente').html(datos.cliente);
        $('#firma').html(datos.firma);
        $('#vendedor').html(datos.vendedor);
        $('#total').html(datos.total);

        $.post('../controladores/ventaProductoController.php',{funcion,id},(response)=>{
            let registros = JSON.parse(response);
            let template = "";
            registros.forEach(registro => {
                template+=`
                    <tr>
                        <td>${registro.cantidad}</td>
                        <td>${registro.precio}</td>
                        <td>${registro.producto}</td>
                        <td>${registro.descripcion}</td>
                        <td>${registro.codigo}</td>
                        <td>${registro.presentacion}</td>
                        <td>${registro.tipo}</td>
                        <td>${registro.subtotal}</td>
                    </tr>
                `;
                $('#registros').html(template);
            });
        })
    })
})
let espanol = {
    "processing": "Procesando...",
    "lengthMenu": "M    ostrar _MENU_ registros",
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