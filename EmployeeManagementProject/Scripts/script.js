$(document).ready(function () {

    var pageIndex = 1;
    var pageSize = 10;
    var sortOrder = 'ASC';
    var sortColumn = 'ID';
    var searchString = '';
    var totalPages;
    var filterGender = 0;
    var filterDepartment = '';

    var ApplyTemplate = function (data) {
        var template = $("#list-template").html();
        $('#listDiv').setTemplate(template);
        $("#listDiv").setParam("pageIndex", pageSize * (data.PageIndex - 1));
        $('#listDiv').processTemplate(data.Employees);
    }

    $.fn.GetData = function () {
        pageIndex = $('#table-pagination').find('.active > a').text();
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
        $.toaster({ title: title, message: message, priority: priority, timeout: 360000 });
    }

    $.fn.GetEmployeeList = function (pageIndex, pageSize, sortOrder, sortColumn, searchString, filterGender, filterDepartment) {
        $.ajax({
            type: "POST",
            url: "EmployeeList.aspx/GetEmployees",
            data: JSON.stringify({ "pageIndex": pageIndex, "pageSize": pageSize, "sortOrder": sortOrder, "sortColumn": sortColumn, "searchString": searchString, "filterGender": filterGender, "filterDepartment": filterDepartment  }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#listSection').block({ message: "<h4><i class='fa fa-lg fa-spinner fa-pulse'></i> Loading...</h4>" })
            },
            success: function (data) {
                totalPages = data.d.TotalPages;
                if (data.d.PageContent == false) {
                    pageIndex = 1;
                    $('#table-pagination').twbsPagination('show', 1);
                }
                if (data.d.Employees.length == 0) {
                    $("#alertMessage").show();
                    $(".divTable").hide();
                }
                else {
                    $("#alertMessage").hide();
                    $(".divTable").show();
                    ApplyTemplate(data.d);
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
                visiblePages.removeClass('disabled');
                visiblePages.find('a').each(function (index, value) {
                    if (parseInt($(this).html()) > totalPages) {
                        $(this).parent().closest('li').addClass('disabled');
                    }
                });
                
                if (totalPages <= visiblePages.length) {
                    $('#table-pagination').find('.next,.last').not('.disabled').addClass('disabled');

                    
                } else {
                    $('#table-pagination').find('.first,.prev,.next,.last').removeClass('disabled');
                    visiblePages.removeClass('disabled');
                }
            },
            complete: function(){
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
            beforeSend: function () {
                $.blockUI({ message: "<h4><i class='fa fa-lg fa-spinner fa-pulse'></i> Loading...</h4>" });
            },
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
            },
            complete: function () {
                $.unblockUI();
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
        $("#ddlAge").val("0");
        $('table').find('input:radio').prop('checked', false);
        $('table').find('input:radio[value=Male]').prop('checked', true);
        $("#ddlQualifications").val("0");
        $("#ddlDepartments").val("0");
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
                $.fn.GetData();
                $.fn.GetEmployeeList(pageIndex, pageSize, sortOrder, sortColumn, searchString, filterGender, filterDepartment);
                $.fn.GetToaster('Success', response.d, 'success');
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
                $("#ddlAge").val(data.d.Age);
                if (data.d.Gender == "Male") {
                    $('table').find('input:radio[value=Male]').prop('checked', true);
                }
                else {
                    $('table').find('input:radio[value=Female]').prop('checked', true);
                }
                $("#ddlQualifications").val(data.d.QualificationId);
                $("#ddlDepartments").val(data.d.DepartmentId);
                $('.modal-title').empty().html('<i class="fa fa-address-card"></i>&nbsp;&nbsp;Edit Employee');
                $('#btnInsertEmployee').empty().html('<i class="fa fa-edit"></i>&nbsp;&nbsp;Edit');
                $('#btnInsertEmployee').attr('title', 'Edit Employee');
                $('#addEmployeeTable').find('.text-danger').empty();
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

    $('#btnSearch').click(function () {
        $.fn.GetData();
        $.fn.GetEmployeeList(pageIndex, pageSize, sortOrder, sortColumn, searchString, filterGender, filterDepartment);
    });

    $('#btnShowModal').click(function () {
        $('.modal-title').empty().html('<i class="fa fa-user-plus"></i>&nbsp;&nbsp;Add Employee');
        $('#btnInsertEmployee').empty().html('<i class="fa fa-save"></i>&nbsp;&nbsp;Add');
        $('#btnInsertEmployee').attr('title', 'Add Employee');
        $.fn.ResetForm();
        $('#addEmployeeModal').modal("show");
        $('#btnReset').show();
    });

    $('#btnReset').click(function () {
        $.fn.ResetForm();
        $('#addEmployeeModal').modal("show");
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
        var tb = $('#addEmployeeTable');
        var flag = 0;
        if ($.trim(employee.FirstName) == "") {
            tb.find('#lblFirstName').html('The First Name field is required');
            flag = 1;
        }
        else {
            tb.find('#lblFirstName').empty();
        }
        if ($.trim(employee.LastName) == "") {
            tb.find('#lblLastName').html('The Last Name field is required');
            flag = 1;
        }
        else {
            tb.find('#lblLastName').empty();
        }
        if (employee.Age == "0") {
            tb.find('#lblAge').html('The Age field is required');
            flag = 1;
        }
        else {
            tb.find('#lblAge').empty();
        }
        if (employee.QualificationId == "0") {
            tb.find('#lblQualifications').html('The Qualifications field is required');
            flag = 1;
        }
        else {
            tb.find('#lblQualifications').empty();
        }
        if (employee.DepartmentId == "0") {
            tb.find('#lblDepartments').html('The Departments field is required');
            flag = 1;
        }
        else {
            tb.find('#lblDepartments').empty();
        }
        if (flag == 1) {
            return false;
        }
        if (employee.ID == "") {
            employee.ID = 0;
        }
        $.fn.AddEditEmployee(employee);
    });

    $("body").on("click", "[id=tblEmployees] .Edit", function () {
        //var id = $(this).closest("tr")
        //           .find(".empid")
        //           .text();
        var editId = this.id;
        var id = editId.substring(editId.indexOf("-") + 1);
        $.fn.GetEmployeeById(id);
    });

    $("body").on("click", "[id=tblEmployees] .Delete", function () {
        var deleteId = this.id;
        var id = deleteId.substring(deleteId.indexOf("-") + 1);
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

    $.fn.ExportToPdf = function (tableHtml)
    {
        $.ajax({
            type: "POST",
            url: "EmployeeList.aspx/GeneratePdf",
            //data: '{}',
            //contentType: "application/json; charset=utf-8",
            //dataType: "json",
            beforeSend: function () {
                $.blockUI({ message: "<h4><i class='fa fa-lg fa-spinner fa-pulse'></i> Loading...</h4>" });
            },
            success: function (data) {
                $.fn.GetToaster('Success', data.d, 'success');
            },
            complete: function () {
                $.unblockUI();
            },
            failure: function (response) {
                var responseText = jQuery.parseJSON(response.responseText);
                $.fn.GetToaster('Error', response.Message, 'danger');
            },
            error: function (response, exception) {
                var msg = '';
                if (response.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (response.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (response.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + response.responseText;
                }
                alert(msg);
                //var responseText = jQuery.parseJSON(response.responseText)
                //$.fn.GetToaster('Error', response.Message, 'danger');
            }
        });
    }

    $("#btnExport").click(function () {
        $("[id*=hfExportPdf]").val($("#pdfTable").html());
        $.fn.ExportToPdf($("[id*=hfExportPdf]").val());
    });

    //$("form[name='addEmployeeForm']").validate({
    //    rules: {
    //        firstname: "required",
    //        lastname: "required",
    //        age: "required",
    //        Gender: "required",
    //        qualifications: "required",
    //        departments: "required"
    //        //email: {
    //        //    required: true,
    //        //    email: true
    //        //},
    //        //password: {
    //        //    required: true,
    //        //    minlength: 5
    //        //}
    //    },
    //    messages: {
    //        firstname: "Please enter firstname",
    //        lastname: "Please enter lastname",
    //        age: "Please select age",
    //        Gender: "Please select gender",
    //        qualifications: "Please select qualification",
    //        departments: "Please select department"
    //        //password: {
    //        //    required: "Please provide a password",
    //        //    minlength: "Your password must be at least 5 characters long"
    //        //},
    //        //email: "Please enter a valid email address"
    //    },
    //    submitHandler: function (form) {
    //        form.submit();
    //    }
    //});


});