$(document).ready(function () {

    $.fn.GetToaster = function (title, message, priority) {
        $.toaster({ title: title, message: message, priority: priority, timeout: 1200000 });
    }

    $.fn.Login = function (userName, password) {
        $.ajax({
            type: "POST",
            url: "Login.aspx/LoginEmployee",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({ "userName": userName, "password": password }),
            beforeSend: function () {
                $.blockUI({ message: "<h4><i class='fa fa-lg fa-spinner fa-pulse'></i> Loading...</h4>" });
            },
            success: function (response) {
                if (response.d.indexOf(".aspx") != -1) {
                    window.location = response.d;
                }
                else {
                    alert(response.d);
                    //$.fn.GetToaster('Success', response.d, 'success');
                }
            },
            complete: function () {
                $.unblockUI();
            },
            failure: function (response) {
                var responseText = jQuery.parseJSON(response.responseText)
                $.fn.GetToaster('Error', response.Message, 'danger');
            },
            error: function (response) {
                var responseText = jQuery.parseJSON(response.responseText)
                $.fn.GetToaster('Error', response.Message, 'danger');
            }
        });
    }

    $("#btnLogin").click(function () {
        var userName = $("#txtUserName").val();
        var password = $("#txtPassword").val();
        $.fn.Login(userName, password);
    });


});