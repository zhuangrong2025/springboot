$(function(){
  $('#btn_sign_in').on('click', function() {
      var username = $('#username_temp').val().replace(/\s+/g,"");
      var password = $('#password').val().replace(/\s+/g,"");
      // 用户名不能为空
      if( username.length == 0 ){
        swal({
          title: "",
          text: "用户名不能为空!",
          type: "info",
          confirmButtonText: "确认",
        })
        $('#username_temp').focus();
        return false;
      }
      // 密码不能为空
      if ( password.length == 0 ){
        swal({
          title: "",
          text: "密码不能为空!",
          type: "info",
          confirmButtonText: "确认",
        })
        $('#password').focus();
        return false;
      }
  });
})
