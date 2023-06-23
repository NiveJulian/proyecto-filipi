$(document).ready(function(){
    $('#form-client').submit(e=>{
        let cliente = $('#cliente').val();
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Tu venta a '+cliente+' esta hecha',
            showConfirmButton: false,
            timer: 2500
          })
        e.preventDefault();
    })
})