$(document).ready(function () {

    var pageIndex = 1;
    var pageSize = 10;
    var sortOrder = 'ASC';
    var sortColumn = 'ID';
    var searchString = '';
    var totalPages;
    var filterGender = 0;
    var filterDepartment = '';
    var isEdit = true;

    var ApplyTemplate = function (data) {
        var template = $("#list-template").html();
        $('#listDiv').setTemplate(template);
        $("#listDiv").setParam("pageIndex", pageSize * (data.PageIndex - 1));
        $('#listDiv').processTemplate(data.Employees);
    }

    $.fn.formatJSONDate = function (jsonDate) {
        var date = eval(jsonDate.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"));
        return dateFormat(date, "dd/mm/yyyy");
    }

    $.fn.GetData = function () {
        var pageNo = $('#table-pagination').find('.active > a').text();
        pageIndex = pageNo == '' ? 1 : pageNo;
        pageSize = $('#ddlPageSize').val();
        if ($(".fa").hasClass('fa-sort-up')) {
            sortOrder = 'ASC';
            sortColumn = $(".fa").parent().closest('th').attr('id');
        } else if ($(".fa").hasClass('fa-sort-down')) {
            sortOrder = 'DESC';
            sortColumn = $(".fa").parent().closest('th').attr('id');
        } else {
            sortOrder = 'ASC';
            sortColumn = 'ID';
        }
        searchString = $("#txtSearch").val();
        filterGender = $('#ddlAgefilter').val();
        if (filterDepartment = $('#ddlDepartmentsfilter option:selected').val() != 0) {
            filterDepartment = $('#ddlDepartmentsfilter option:selected').text();
        } else {
            filterDepartment = '';
        }
    }

    $.fn.GetToaster = function (title, message, priority) {
        $.toaster({ title: title, message: message, priority: priority, timeout: 1200000 });
    }

    $.fn.GetEmployeeList = function (pageIndex, pageSize, sortOrder, sortColumn, searchString, filterGender, filterDepartment) {
        $.ajax({
            type: "POST",
            url: "EmployeeList.aspx/GetEmployees",
            data: JSON.stringify({ "pageIndex": pageIndex, "pageSize": pageSize, "sortOrder": sortOrder, "sortColumn": sortColumn, "searchString": searchString, "filterGender": filterGender, "filterDepartment": filterDepartment }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#listSection').block({ message: "<h4><i class='fa fa-lg fa-spinner fa-pulse'></i> Loading...</h4>" })
            },
            success: function (data) {
                totalPages = data.d.TotalPages;
                if (data.d.Employees.length == 0) {
                    $("#alertMessage").show();
                    $(".divTable").hide();
                }
                else if (data.d.PageContent == false) {
                    pageIndex = 1;
                    $('#table-pagination').twbsPagination('show', 1);
                } else {
                    $("#alertMessage").hide();
                    $(".divTable").show();
                    ApplyTemplate(data.d);
                    $('.Date').each(function () {
                        $(this).html($.fn.formatJSONDate($(this).html()));
                    });
                }
                if (totalPages > 0) {
                    $('#table-pagination').twbsPagination({
                        totalPages: totalPages,
                        visiblePages: (totalPages > 1 || totalPages < 5) ? totalPages : 5,
                        next: '<span aria-hidden="true">&raquo;</span>',
                        prev: '<span aria-hidden="true">&laquo;</span>',
                        onPageClick: function (event, page) {
                            pageIndex = page;
                            pageSize = $('#ddlPageSize').val() == null ? 10 : $('#ddlPageSize').val();
                            searchString = $("#txtSearch").val();
                            if ($(".fa").hasClass('fa-sort-up')) {
                                sortOrder = 'ASC';
                                sortColumn = $(".fa").parent().closest('th').attr('id');
                            } else if ($(".fa").hasClass('fa-sort-down')) {
                                sortOrder = 'DESC';
                                sortColumn = $(".fa").parent().closest('th').attr('id');
                            } else {
                                sortOrder = 'ASC';
                                sortColumn = 'ID';
                            }
                            filterGender = $('#ddlAgefilter').val() == null ? 0 : $('#ddlAgefilter').val();
                            if (filterDepartment = $('#ddlDepartmentsfilter option:selected').val() != 0) {
                                filterDepartment = $('#ddlDepartmentsfilter option:selected').text() == null ? '' : $('#ddlDepartmentsfilter option:selected').text();
                            } else {
                                filterDepartment = '';
                            }
                            $.fn.GetEmployeeList(page, pageSize, sortOrder, sortColumn, searchString, filterGender, filterDepartment);
                        }
                    });
                }
                var visiblePages = $('#table-pagination').find('.page-item').not('.first,.prev,.next,.last');
                visiblePages.show();//removeClass('disabled');
                visiblePages.find('a').each(function (index, value) {
                    if (parseInt($(this).html()) > totalPages) {
                        $(this).parent().closest('li').hide();//addClass('disabled');
                    }
                });

                if (totalPages <= visiblePages.length) {
                    $('#table-pagination').find('.next,.last').not('.disabled').addClass('disabled');


                } else {
                    $('#table-pagination').find('.first,.prev,.next,.last').removeClass('disabled');
                    visiblePages.removeClass('disabled');
                }
            },
            complete: function () {
                $('#listSection').unblock();
            },
            failure: function (response) {
                var responseText = jQuery.parseJSON(response.responseText)
                $.fn.GetToaster('Error', responseText.Message, 'danger');
            },
            error: function (response) {
                var responseText = jQuery.parseJSON(response.responseText)
                $.fn.GetToaster('Error', responseText.Message, 'danger');
            }
        });
    }

    $.fn.GetDropdownlists = function () {
        $.ajax({
            type: "POST",
            url: "EmployeeList.aspx/GetMasterTableData",
            data: {},
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var option = '<option value="0">--select--</option>'
                for (var i = 18; i <= 60; i++) {
                    option += '<option value="' + i + '">' + i + '</option>';
                }
                $('#ddlAge').append(option);
                $('#ddlAgefilter').append(option);
                var sizeOption = '';
                for (var i = 10; i <= 50; i = i + 10) {
                    sizeOption += '<option value="' + i + '">' + i + '</option>';
                }
                $('#ddlPageSize').append(sizeOption);
                $('#empId').val("");
                $("#ddlQualifications").empty().append('<option value="0">--select--</option>');
                $.each(data.d.QualificationList, function () {
                    $("#ddlQualifications").append($("<option></option>").val(this['Value']).html(this['Text']));
                });
                $("#ddlDepartments").empty().append('<option value="0">--select--</option>');
                $("#ddlDepartmentsfilter").empty().append('<option value="0">--select--</option>');
                $.each(data.d.DepartmentList, function () {
                    $("#ddlDepartments").append($("<option></option>").val(this['Value']).html(this['Text']));
                    $("#ddlDepartmentsfilter").append($("<option></option>").val(this['Value']).html(this['Text']));
                });
                $("#ddlCountries").empty().append('<option value="0">--select--</option>');
                $.each(data.d.CountryList, function () {
                    $("#ddlCountries").append($("<option></option>").val(this['Value']).html(this['Text']));
                });
            },
            failure: function (response) {
                var responseText = jQuery.parseJSON(response.responseText)
                $.fn.GetToaster('Error', responseText.Message, 'danger');
            },
            error: function (response) {
                var responseText = jQuery.parseJSON(response.responseText)
                $.fn.GetToaster('Error', responseText.Message, 'danger');
            }
        });
    }

    $.fn.ResetForm = function () {
        $('#empId').val("");
        $('#txtFirstName').val("");
        $('#txtLastName').val("");
        $('#txtPassword').val("");
        $('#txtConfirmPassword').val("");
        $("#ddlAge").val("0");
        $('#addEmployeeTable').find('input:radio').prop('checked', false);
        $('#addEmployeeTable').find('input:radio[value=Male]').prop('checked', true);
        $("#ddlQualifications").val("0");
        $("#ddlDepartments").val("0");
        $('#txtAddress').val("");
        $('#txtCity').val("");
        $('#txtState').val("");
        $("#ddlCountries").val("0");
        $('#txtMobile').val("");
        $('#txtEmail').val("");
        $('#txtExperience').val("0");
        $('#txtDateOfBirth').val("");
        $('[id^="lbl"]').empty();
    }

    $.fn.AddEditEmployee = function (employee) {
        $.ajax({
            type: "POST",
            url: "EmployeeList.aspx/InsertEmployee",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: '{employee: ' + JSON.stringify(employee) + '}',
            beforeSend: function () {
                $.blockUI({ message: "<h4><i class='fa fa-lg fa-spinner fa-pulse'></i> Loading...</h4>" });
            },
            success: function (response) {
                $('#addEmployeeModal').modal("hide");
                $.fn.GetData();
                $.fn.GetEmployeeList(pageIndex, pageSize, sortOrder, sortColumn, searchString, filterGender, filterDepartment);
                $.fn.ResetForm();
                $.fn.GetToaster('Success', data.d, 'success');
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

    $.fn.GetEmployeeById = function (id) {
        $.ajax({
            type: "POST",
            url: "EmployeeList.aspx/GetEmployeeById",
            data: '{Id: ' + id + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $.blockUI({ message: "<h4><i class='fa fa-lg fa-spinner fa-pulse'></i> Loading...</h4>" });
            },
            success: function (data) {
                $('#empId').val(data.d.ID);
                $('#txtFirstName').val(data.d.FirstName);
                $('#txtLastName').val(data.d.LastName);
                $('#txtPassword').val(data.d.Password);
                $('#txtConfirmPassword').val(data.d.Password);
                $("#ddlAge").val(data.d.Age);
                if (data.d.Gender == "Male") {
                    $('table').find('input:radio[value=Male]').prop('checked', true);
                }
                else {
                    $('table').find('input:radio[value=Female]').prop('checked', true);
                }
                $("#ddlQualifications").val(data.d.QualificationId);
                $("#ddlDepartments").val(data.d.DepartmentId);
                $('#txtAddress').val(data.d.Address);
                $('#txtCity').val(data.d.City);
                $('#txtState').val(data.d.State);
                $('#ddlCountries').val(data.d.CountryId);
                $('#txtExperience').val(data.d.Experience);
                $('#txtEmail').val(data.d.Email);
                $('#txtMobile').val(data.d.Mobile);
                var date = $.fn.formatJSONDate(data.d.DateOfBirth).split("/").reverse().join("-");
                $('#txtDateOfBirth').val(date);
                $('#addEmployeeTable').find('.text-danger').empty();
                if (isEdit) {
                    $('.modal-title').empty().html('<i class="fa fa-address-card"></i>&nbsp;&nbsp;Edit Employee');
                    $("#addEmployeeTable :input").prop("disabled", false);
                    $('#btnInsertEmployee').empty().html('<i class="fa fa-edit"></i>&nbsp;&nbsp;Update');
                    $('#btnInsertEmployee').attr('title', 'Edit Employee');
                    $('#btnInsertEmployee').show();
                    $('#empPassword').show();
                }
                else {
                    $('.modal-title').empty().html('<i class="fa fa-user"></i>&nbsp;&nbsp;View Employee');
                    $("#addEmployeeTable :input").prop("disabled", true);
                    $('#btnInsertEmployee').hide();
                    $('#empPassword').hide();
                }
                $('#addEmployeeModal').modal("show");
                $('#btnReset').hide();
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

    $.fn.DeleteEmployee = function (id) {
        $.ajax({
            type: "POST",
            url: "EmployeeList.aspx/DeleteEmployee",
            data: '{Id: ' + id + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $.blockUI({ message: "<h4><i class='fa fa-lg fa-spinner fa-pulse'></i> Loading...</h4>" });
            },
            success: function (data) {
                $.fn.GetData();
                $.fn.GetEmployeeList(pageIndex, pageSize, sortOrder, sortColumn, searchString, filterGender, filterDepartment);
                $.fn.GetToaster('Success', data.d, 'success');
                $.fn.ResetForm();
                $('#addEmployeeModal').modal("hide");
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

    $("#alertMessage").hide();
    $.fn.GetDropdownlists();
    $.fn.GetEmployeeList(pageIndex, pageSize, sortOrder, sortColumn, searchString, filterGender, filterDepartment);

    $('#ddlPageSize').change(function () {
        $.fn.GetData();
        $.fn.GetEmployeeList(pageIndex, pageSize, sortOrder, sortColumn, searchString, filterGender, filterDepartment);
    });

    var table = $('#tblEmployees');

    $('.sortable')
        .wrapInner('<span title="sort"/>')
        .each(function () {
            var th = $(this),
                thIndex = th.index,
                inverse = false;
            th.click(function () {
                sortColumn = th.attr('id');
                table.find('i:not(.fa-sort)').addClass('fa-sort');
                th.find('i').removeClass("fa-sort");
                if (inverse == false) {
                    table.find('i').removeClass("fa-sort-up fa-sort-down");
                    th.find('i').addClass("fa-sort-up");
                    sortOrder = 'ASC';
                }
                else {
                    table.find('i').removeClass("fa-sort-up fa-sort-down");
                    th.find('i').addClass("fa-sort-down");
                    sortOrder = 'DESC';
                }
                $.fn.GetData();
                $.fn.GetEmployeeList(pageIndex, pageSize, sortOrder, sortColumn, searchString, filterGender, filterDepartment);
                inverse = !inverse;
            });
        });

    $('#txtSearch').keyup(function () {
        $.fn.GetData();
        $.fn.GetEmployeeList(pageIndex, pageSize, sortOrder, sortColumn, searchString, filterGender, filterDepartment);
    });

    $('#btnShowModal').click(function () {
        $('.modal-title').empty().html('<i class="fa fa-user-plus"></i>&nbsp;&nbsp;Add Employee');
        $('#btnInsertEmployee').empty().html('<i class="fa fa-save"></i>&nbsp;&nbsp;Add');
        $('#btnInsertEmployee').attr('title', 'Add Employee');
        $.fn.ResetForm();
        $("#addEmployeeTable :input").prop("disabled", false);
        $('#btnInsertEmployee').show();
        $('#addEmployeeModal').modal("show");
        $('#empPassword').show();
        $('#btnReset').show();
    });

    $('#btnReset').click(function () {
        $.fn.ResetForm();
    });

    $('#btnInsertEmployee').click(function () {
        var employee = {};
        employee.FirstName = $("#txtFirstName").val();
        employee.LastName = $("#txtLastName").val();
        employee.Age = $("#ddlAge").val();
        employee.Gender = $("table").find("input[type='radio']:checked").val();
        employee.QualificationId = $("#ddlQualifications").val();
        employee.DepartmentId = $("#ddlDepartments").val();
        employee.ID = $('#empId').val();
        employee.DateOfBirth = $("#txtDateOfBirth").val();
        employee.Address = $("#txtAddress").val();
        employee.City = $("#txtCity").val();
        employee.State = $("#txtState").val();
        employee.CountryId = $("#ddlCountries").val();
        employee.Experience = $("#txtExperience").val();
        employee.Mobile = $("#txtMobile").val();
        employee.Email = $("#txtEmail").val();
        employee.Password = $("#txtPassword").val();
        var confirmPassword = $("#txtConfirmPassword").val();
        var tb = $('#addEmployeeTable');
        var flag = 0;
        if ($.trim(employee.FirstName) == "") {
            tb.find('#lblFirstName').html('First Name is required');
            flag = 1;
        }
        else {
            tb.find('#lblFirstName').empty();
        }
        if ($.trim(employee.LastName) == "") {
            tb.find('#lblLastName').html('Last Name is required');
            flag = 1;
        }
        else {
            tb.find('#lblLastName').empty();
        }
        if (employee.Age == "0") {
            tb.find('#lblAge').html('Age is required');
            flag = 1;
        }
        else {
            tb.find('#lblAge').empty();
        }
        if (employee.QualificationId == "0") {
            tb.find('#lblQualifications').html('Qualifications is required');
            flag = 1;
        }
        else {
            tb.find('#lblQualifications').empty();
        }
        if (employee.DepartmentId == "0") {
            tb.find('#lblDepartments').html('Department is required');
            flag = 1;
        }
        else {
            tb.find('#lblDepartments').empty();
        }
        if ($.trim(employee.Address) == "") {
            tb.find('#lblAddress').html('Address is required');
            flag = 1;
        }
        else {
            tb.find('#lblAddress').empty();
        }
        if ($.trim(employee.City) == "") {
            tb.find('#lblCity').html('City is required');
            flag = 1;
        }
        else {
            tb.find('#lblCity').empty();
        }
        if ($.trim(employee.State) == "") {
            tb.find('#lblState').html('State is required');
            flag = 1;
        }
        else {
            tb.find('#lblState').empty();
        }
        if (employee.CountryId == "0") {
            tb.find('#lblCountries').html('Country is required');
            flag = 1;
        }
        else {
            tb.find('#lblCountries').empty();
        }
        if ($.trim(employee.Experience) == "") {
            tb.find('#lblExperience').html('Experience is required');
            flag = 1;
        }
        else if ($.trim(employee.Experience) > 60) {
            tb.find('#lblExperience').html('Experience is cannot be greater than 60');
            flag = 1;
        }
        else if ($.trim(employee.Experience) < 0) {
            tb.find('#lblExperience').html('Experience is cannot be negative');
            flag = 1;
        }
        else {
            tb.find('#lblExperience').empty();
        }
        if ($.trim(employee.Mobile) == "") {
            tb.find('#lblMobile').html('Mobile Number is required');
            flag = 1;
        }
        else if ($.trim(employee.Mobile).length != 10) {
            tb.find('#lblMobile').html('A valid Mobile Number is required');
            flag = 1;
        }
        else {
            tb.find('#lblMobile').empty();
        }
        if ($.trim(employee.Email) == "") {
            tb.find('#lblEmail').html('Email is required');
            flag = 1;
        }
        else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(employee.Email))) {
            $('#lblEmail').html('A valid Email is required');
            flag = 1;
        }
        else {
            tb.find('#lblEmail').empty();
        }
        if ($.trim(employee.DateOfBirth) == "") {
            tb.find('#lblDateOfBirth').html('Date Of Birth is required');
            flag = 1;
        }
        else {
            tb.find('#lblDateOfBirth').empty();
        }
        if ($.trim(employee.Password) == "") {
            tb.find('#lblPassword').html('Password is required');
            flag = 1;
        }
        else {
            tb.find('#lblPassword').empty();
        }
        if ($.trim(confirmPassword) == "") {
            tb.find('#lblConfirmPassword').html('Please confirm Password');
            flag = 1;
        }
        else if ($.trim(employee.Password) != $.trim(confirmPassword)) {
            tb.find('#lblConfirmPassword').html('Password and confirm Password must match');
            flag = 1;
        }
        else {
            tb.find('#lblConfirmPassword').empty();
        }
        if (flag == 1) {
            return false;
        }
        if (employee.ID == "") {
            employee.ID = 0;
        }
        $.fn.AddEditEmployee(employee);
    });

    $("body").on("click", "[id=tblEmployees] .View", function () {
        var editId = this.id;
        var id = editId.substring(editId.indexOf("_") + 1);
        isEdit = false;
        $.fn.GetEmployeeById(id);
    });

    $("body").on("click", "[id=tblEmployees] .Edit", function () {
        var editId = this.id;
        var id = editId.substring(editId.indexOf("_") + 1);
        isEdit = true;
        $.fn.GetEmployeeById(id);
    });

    $("body").on("click", "[id=tblEmployees] .Delete", function () {
        var id = this.id.substring(deleteId.indexOf("_") + 1);
        $.confirm({
            icon: 'fa fa-warning',
            title: 'Alert',
            content: 'Do you want to delete this employee?',
            draggable: true,
            theme: 'material',
            buttons: {
                Yes: function () {
                    $.fn.DeleteEmployee(id);
                },
                No: function () {
                }
            }
        });
    });

    $('#ddlAgefilter').change(function () {
        $.fn.GetData();
        $.fn.GetEmployeeList(pageIndex, pageSize, sortOrder, sortColumn, searchString, filterGender, filterDepartment);
    });

    $('#ddlDepartmentsfilter').change(function () {
        $.fn.GetData();
        $.fn.GetEmployeeList(pageIndex, pageSize, sortOrder, sortColumn, searchString, filterGender, filterDepartment);
    });

    $.fn.ExportToPdf = function () {
        $.fn.GetData();
        $.ajax({
            type: "POST",
            url: "EmployeeList.aspx/GeneratePdf",
            data: JSON.stringify({ "sortOrder": sortOrder, "sortColumn": sortColumn, "searchString": searchString, "filterGender": filterGender, "filterDepartment": filterDepartment }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $.blockUI({ message: "<h4><i class='fa fa-lg fa-spinner fa-pulse'></i> Loading...</h4>" });
            },
            success: function (data) {
                $('#aPdfFile').prop('href', data.d);
                $("#aPdfFile").trigger("click");
                $.fn.GetToaster('Success', 'Exported to pdf successfully!!', 'success');
            },
            complete: function () {
                $.unblockUI();
            },
            failure: function (response) {
                var responseText = jQuery.parseJSON(response.responseText);
                $.fn.GetToaster('Error', response.Message, 'danger');
            },
            error: function (response, exception) {
                var responseText = jQuery.parseJSON(response.responseText)
                $.fn.GetToaster('Error', response.Message, 'danger');
            }
        });
    }

    $("#btnExport").click(function () {
        $.fn.ExportToPdf();
    });

    $.fn.ExportToExcel = function () {
        $.fn.GetData();
        $.ajax({
            type: "POST",
            url: "EmployeeList.aspx/GenerateExcel",
            data: JSON.stringify({ "sortOrder": sortOrder, "sortColumn": sortColumn, "searchString": searchString, "filterGender": filterGender, "filterDepartment": filterDepartment }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $.blockUI({ message: "<h4><i class='fa fa-lg fa-spinner fa-pulse'></i> Loading...</h4>" });
            },
            success: function (data) {
                $('#aExcelFile').prop('href', data.d);
                $("#aExcelFile").trigger("click");
                $.fn.GetToaster('Success', 'Exported to excel successfully!!', 'success');
            },
            complete: function () {
                $.unblockUI();
            },
            failure: function (response) {
                var responseText = jQuery.parseJSON(response.responseText);
                $.fn.GetToaster('Error', response.Message, 'danger');
            },
            error: function (response) {
                var responseText = jQuery.parseJSON(response.responseText)
                $.fn.GetToaster('Error', response.Message, 'danger');
            }
        });
    }

    $("#btnExportExcel").click(function () {
        $.fn.ExportToExcel();
    });

    $('#aExcelFile,#aPdfFile').click(function (e) {
        e.preventDefault();
        window.location.href = $(this).attr('href');
    });

});