import {
  llenar_menu_superior,
  llenar_menu_lateral,
} from "./layouts/layouts.js";
$(document).ready(function () {
  Loader("Cargando Productos");
  verificar_sesion();
  var datatable;
  $(".select2").select2();
  async function verificar_sesion() {
    let funcion = "verificar_sesion";
    let data = await fetch("../Controllers/UsuariosController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });
    if (data.ok) {
      let response = await data.text();
      try {
        let repuesta = JSON.parse(response);
        if (repuesta.length !== 0) {
          llenar_menu_lateral(repuesta);
          llenar_menu_superior(repuesta);
          $("#gestion_usuario").show();
          $("#gestion_catalogo").show();
          $("#gestion_ventas").show();
          $("#gestion_lotes").show();
          $("#gestion_pedidos").show();
          await obtener_perfil(repuesta);
          await obtener_info(repuesta);
        } else {
          location.href = "../";
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "hubo conflicto en el sistema, pongase en contacto con el administrador",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "hubo conflicto de codigo: " + data.status,
      });
    }
  }
  function Loader(mensaje) {
    if (mensaje == "" || mensaje == null) {
      mensaje = "Cargando productos...";
    }
    Swal.fire({
      position: "center",
      html: '<i class="fas fa-2x fa-sync-alt fa-spin"></i>',
      title: mensaje,
      showConfirmButton: false,
    });
  }
  function CloseLoader(mensaje, tipo) {
    if (mensaje == "" || mensaje == null) {
      Swal.close();
    } else {
      Swal.fire({
        position: "center",
        icon: tipo,
        title: mensaje,
        showConfirmButton: false,
      });
    }
  }
  function rellenar_estado_pago() {
    funcion = "rellenar_estado";
    $.post("../controladores/EstadoController.php", { funcion }, (response) => {
      // console.log(response)
      let estados = JSON.parse(response);
      let template = "";
      estados.forEach((estado) => {
        template += `
                    <option value="${estado.id}" >${estado.nombre}</option>
                `;
      });
      $("#estado_compra").html(template);
    });
  }
  function listar_compras() {
    funcion = "listar_compras";
    $.post(
      "../controladores/MisComprasController.php",
      { funcion },
      (response) => {
        let datos = JSON.parse(response);
        datatable = $("#compras").DataTable({
          data: datos,
          columns: [
            { data: "numeracion" },
            { data: "codigo" },
            { data: "fecha_compra" },
            { data: "fecha_entrega" },
            { data: "total" },
            { data: "estado" },
            { data: "proveedor" },
            {
              defaultContent: `
                    <button  class="imprimir btn btn-secondary"><i class="fas fa-print"></i></button>
                    <button  class="ver btn btn-success" type="button" data-toggle="modal" data-target="#vista_compra"><i class="fas fa-search"></i></button>
                    <button  class="editar btn btn-info" type="button" data-toggle="modal" data-target="#cambiarEstado"><i class="fas fa-pencil-alt"></i></button>`,
            },
          ],
          destroy: true,
          language: espanol,
        });
      }
    );
  }
  $("#compras tbody").on("click", ".editar", function () {
    let datos = datatable.row($(this).parents()).data();
    let codigo = datos.codigo;
    codigo = codigo.split(" | ");
    let id = codigo[0];
    let estado = datos.estado;
    $("#id_estado").val(id);
    funcion = "cambiarEstado";
    $.post(
      "../controladores/EstadoController.php",
      { funcion, estado },
      (response) => {
        let id_estado = JSON.parse(response);
        $("#estado_compra").val(id_estado[0]["id"]).trigger("change");
      }
    );
  });
  $("#form-editar").submit((e) => {
    let id_estado = $("#id_estado").val();
    let id_compra = $("#estado_compra").val();
    funcion = "editarEstado";
    $.post(
      "../controladores/MisComprasController.php",
      { funcion, id_compra, id_estado },
      (response) => {
        if ((response = "edit")) {
          $("#estado_compra").val("").trigger("change");
          $("#edit").hide("slow");
          $("#edit").show(1000);
          $("#edit").hide(2000);
          $("#form-crear").trigger("reset");
          listar_compras();
        } else {
          $("#noedit").hide("slow");
          $("#noedit").show(1000);
          $("#noedit").hide(2000);
          $("#form-crear").trigger("reset");
        }
      }
    );
    e.preventDefault();
  });
  $("#compras tbody").on("click", ".ver", function () {
    let datos = datatable.row($(this).parents()).data();
    let codigo = datos.codigo;
    codigo = codigo.split(" | ");
    let id = codigo[0];
    funcion = "ver";
    $("#codigo_compra").html(datos.codigo);
    $("#fecha_compra").html(datos.fecha_compra);
    $("#fecha_entrega").html(datos.fecha_entrega);
    $("#estado").html(datos.estado);
    $("#proveedor").html(datos.proveedor);
    $("#total").html(datos.total);

    $.post(
      "../controladores/LoteController.php",
      { funcion, id },
      (response) => {
        let registros = JSON.parse(response);
        let template = "";
        $("#detalles").html(template);
        registros.forEach((registro) => {
          template += `
                    <tr>
                        <td>${registro.numeracion}</td>
                        <td>${registro.codigo}</td>
                        <td>${registro.cantidad}</td>
                        <td>${registro.producto}</td>
                        <td>${registro.precio_compra}</td>
                        <td>${registro.tipo}</td>
                        <td>${registro.presentacion}</td>
                    </tr>
                `;
          $("#detalles").html(template);
        });
      }
    );
  });
  $("#compras tbody").on("click", ".imprimir", function () {
    let datos = datatable.row($(this).parents()).data();
    let codigo = datos.codigo;
    codigo = codigo.split(" | ");
    let id = codigo[0];
    funcion = "imprimir";
    $.post(
      "../controladores/MisComprasController.php",
      { id, funcion },
      (response) => {
        console.log(response);
        window.open("../pdf/pdf-compra-" + id + ".pdf", "_blank");
      }
    );
  });
});

let espanol = {
  processing: "Procesando...",
  lengthMenu: "Mostrar _MENU_ registros",
  zeroRecords: "No se encontraron resultados",
  emptyTable: "Ningún dato disponible en esta tabla",
  infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
  infoFiltered: "(filtrado de un total de _MAX_ registros)",
  search: "Buscar:",
  infoThousands: ",",
  loadingRecords: "Cargando...",
  paginate: {
    first: "Primero",
    last: "Último",
    next: "Siguiente",
    previous: "Anterior",
  },
  aria: {
    sortAscending: ": Activar para ordenar la columna de manera ascendente",
    sortDescending: ": Activar para ordenar la columna de manera descendente",
  },
  buttons: {
    copy: "Copiar",
    colvis: "Visibilidad",
    collection: "Colección",
    colvisRestore: "Restaurar visibilidad",
    copyKeys:
      "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br /> <br /> Para cancelar, haga clic en este mensaje o presione escape.",
    copySuccess: {
      1: "Copiada 1 fila al portapapeles",
      _: "Copiadas %ds fila al portapapeles",
    },
    copyTitle: "Copiar al portapapeles",
    csv: "CSV",
    excel: "Excel",
    pageLength: {
      "-1": "Mostrar todas las filas",
      _: "Mostrar %d filas",
    },
    pdf: "PDF",
    print: "Imprimir",
    renameState: "Cambiar nombre",
    updateState: "Actualizar",
    createState: "Crear Estado",
    removeAllStates: "Remover Estados",
    removeState: "Remover",
    savedStates: "Estados Guardados",
    stateRestore: "Estado %d",
  },
};
