$(document).ready(function () {

  $("#otros-datos-toggle").change(function () {
    const otrosDatosContainer = $("#otros-datos");
    const icon = $(".toggle-container .icon");
    otrosDatosContainer.slideToggle(300);

    icon.text(this.checked ? "v" : ">");

    const labelText = this.checked ? "Ocultar datos" : "Mostrar datos";
    $(".toggle-container label").text(labelText);
  });
  $("#motor-toggle").change(function () {
    if (this.checked) {
      $("#motor-input-group").show();
    } else {
      $("#motor-input-group").hide();
    }
  });
  $("#cedula-toggle").change(function () {
    if (this.checked) {
      $("#cedula-input-group").show();
    } else {
      $("#cedula-input-group").hide();
    }
  });
  $("#vtv-toggle").change(function () {
    if (this.checked) {
      $("#vtv-input-group").show();
    } else {
      $("#vtv-input-group").hide();
    }
  });
  $("#logistica-toggle").change(function () {
    if (this.checked) {
      $("#ruta-input-group").show();
    } else {
      $("#ruta-input-group").hide();
    }
  });
  $("#senasa-toggle").change(function () {
    if (this.checked) {
      $("#senasa-input-group").show();
    } else {
      $("#senasa-input-group").hide();
    }
  });
});
