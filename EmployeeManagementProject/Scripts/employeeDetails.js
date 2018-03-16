$(document).ready(function () {

    $.fn.GetToaster = function (title, message, priority) {
        $.toaster({ title: title, message: message, priority: priority, timeout: 1200000 });
    }

    $.fn.formatJSONDate = function (jsonDate) {
        var date = eval(jsonDate.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"));
        return dateFormat(date, "dd/mm/yyyy");
    }

    $.fn.GetEmployeeDetails = function () {
        $.ajax({
            type: "POST",
            url: "EmployeeDetails.aspx/GetEmployeeBySessionId",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: '{}',
            beforeSend: function () {
                $.blockUI({ message: "<h4><i class='fa fa-lg fa-spinner fa-pulse'></i> Loading...</h4>" });
            },
            success: function (data) {
                if (data.d.ID == undefined) {
                    window.open('Login.aspx');
                }
                else {
                    $('#empId').val(data.d.ID);
                    $('#lblFirstName').html(data.d.FirstName);
                    $('#lblLastName').html(data.d.LastName);
                    $("#lblAge").html(data.d.Age);
                    $("#lblGender").html(data.d.Gender);
                    $('#lblDateOfBirth').html($.fn.formatJSONDate(data.d.DateOfBirth));
                    $("#lblQualifications").html(data.d.Qualification);
                    $('#lblAddress').html(data.d.Address);
                    $('#lblCity').html(data.d.City);
                    $('#lblState').html(data.d.State);
                    $('#lblCountries').html(data.d.Country);
                    $("#lblDepartments").html(data.d.Department);
                    $('#lblExperience').html(data.d.Experience);
                    $('#lblMobile').html(data.d.Mobile);
                    $('#lblEmail').html(data.d.Email);
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

    $.fn.GetEmployeeDetails();

    $("#btnLogin").click(function () {
        var userName = $("#txtUserName").val();
        var password = $("#txtPassword").val();
        $.fn.Login(userName, password);
    });

});