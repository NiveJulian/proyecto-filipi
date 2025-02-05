import {
  llenar_menu_superior,
  llenar_menu_lateral,
} from "./layouts/layouts.js";

$(document).ready(function () {
  Loader("Cargando Productos");
  verificar_sesion();
  let funcion = "";
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
          await cargarAlmacenes();
          rellenar_tipo_producto();
        } else {
          location.href = "../";
        }
        CloseLoader();
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

  $("#modalAlmacen").on("show.bs.modal", async function (event) {
    var button = $(event.relatedTarget);
    var id = button.data("id");
    if (id) {
      $.ajax({
        url: "../Controllers/LoteController.php",
        type: "POST",
        data: { funcion: "obtener_almacen", id: id },
        dataType: "json",
        success: async function (response) {
          $("#idAlmacen").val(response[0].id);
          $("#nombreAlmacen").val(response[0].nombre);
          $("#ubicacionAlmacen").val(response[0].ubicacion);
          $("#tipo_producto").val(response[0].tipo_producto);
          $("#estadoAlmacen").val(response[0].estado);
          $("#modalTitulo").text("Editar Almacén");
        },
      });
    } else {
      // Crear nuevo almacén
      $("#formAlmacen")[0].reset();
      $("#modalTitulo").text("Crear Almacén");
    }
  });

  $("#tablaAlmacenes tbody").on("click", "tr", async function () {
    let idAlmacen = $(this).data("id");
    $(this).addClass("cursor-pointer");
    await cargarProductosAlmacen(idAlmacen);
    $("#modalProductos").modal("show");
  });

  async function cargarProductosAlmacen(idAlmacen) {
    $.ajax({
      url: "../Controllers/LoteController.php",
      type: "POST",
      data: { funcion: "listar_productos", idAlmacen },
      dataType: "json",
      success: function (response) {
        let tbody = $("#tablaProductos tbody");
        tbody.empty();

        if (response.length === 0) {
          tbody.append(
            '<tr><td colspan="3" class="text-center">No hay productos</td></tr>'
          );
        } else {
          response.forEach(function (producto) {
            let fila = `
                      <tr>
                          <td>${producto.nombre}</td>
                          <td>${producto.descripcion}</td>
                          <td>${producto.stock}</td>
                      </tr>
                  `;
            tbody.append(fila);
          });
        }
      },
      error: function () {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "hubo conflicto en el sistema, pongase en contacto con el administrador",
        });
      },
    });
  }

  // Cargar almacenes en la tabla
  async function cargarAlmacenes() {
    $.ajax({
      url: "../Controllers/LoteController.php",
      type: "POST",
      data: { funcion: "listar_almacenes" },
      dataType: "json",
      success: function (response) {
        let tbody = $("#tablaAlmacenes tbody");
        tbody.empty();
        response.forEach(function (almacen) {
          let fila = `
                    <tr data-id=${almacen.id}>
                        <td>${almacen.nombre}</td>
                        <td>${almacen.ubicacion}</td>
                        <td>${almacen.tipo_producto}</td>
                        <td>${almacen.estado}</td>
                        <td>${almacen.cantidad_productos}</td>
                        <td>
                            <button class="btn btn-sm btn-warning editar-almacen text-center" data-toggle="modal" data-target="#modalAlmacen" data-id="${almacen.id}"><i class="fas fa-pencil text-black"></i></button>
                            <button class="btn btn-sm btn-danger eliminar-almacen" data-id="${almacen.id}"><i class="fas fa-trash text-black"></i></button>
                        </td>
                    </tr>
                `;
          tbody.append(fila);
        });
      },
    });
  }

  // Guardar almacén (crear o editar)
  $("#guardarAlmacen").click(function () {
    let id = $("#idAlmacen").val();
    let nombre = $("#nombreAlmacen").val();
    let ubicacion = $("#ubicacionAlmacen").val();
    let tipoProducto = $("#tipo_producto").val();
    let estado = $("#estadoAlmacen").val();

    let funcion = id ? "editar_almacen" : "crear_almacen";

    $.ajax({
      url: "../Controllers/LoteController.php",
      type: "POST",
      data: {
        funcion: funcion,
        id: id,
        nombre: nombre,
        ubicacion: ubicacion,
        tipo_producto: tipoProducto,
        estado: estado,
      },
      success: function (response) {
        $("#modalAlmacen").modal("hide");
        cargarAlmacenes();
      },
    });
  });

  // Eliminar almacén
  $(document).on("click", ".eliminar-almacen", function () {
    var id = $(this).data("id");
    if (confirm("¿Estás seguro de eliminar este almacén?")) {
      $.ajax({
        url: "../Controllers/LoteController.php",
        type: "POST",
        data: { funcion: "eliminar_almacen", id: id },
        success: function (response) {
          cargarAlmacenes();
        },
      });
    }
  });

  function rellenar_tipo_producto() {
    let funcion = "rellenar_tipo_producto";
    $.post("../Controllers/LoteController.php", { funcion }, (response) => {
      let tipoProducto = JSON.parse(response);
      let template = "";

      $("#tipo_producto").empty();

      tipoProducto.forEach((type) => {
        template += `
                        <option value="${type.id}">${type.nombre}</option>
                    `;
      });
      $("#tipo_producto").html(template);
    });
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
});
