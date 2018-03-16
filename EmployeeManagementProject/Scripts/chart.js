$(document).ready(function () {

    $.fn.GetToaster = function (title, message, priority) {
        $.toaster({ title: title, message: message, priority: priority, timeout: 1200000 });
    }

    $.fn.GetChart = function (parameter) {
        $.ajax({
            type: "POST",
            url: "Charts.aspx/GetChartData",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({ "parameter": parameter }),
            async: "true",
            cache: "false",
            beforeSend: function () {
                $.blockUI({ message: "<h4><i class='fa fa-lg fa-spinner fa-pulse'></i> Loading...</h4>" });
            },
            success: function (response) {
                var data = {};
                var projects = [];
                response.d.ChartData.forEach(function (e) {
                    projects.push(e.Text);
                    data[e.Text] = e.Value;
                })

                chart = c3.generate({
                    bindto: '#chart',
                    data: {
                        json: [data],
                        keys: {
                            value: projects,
                        },
                        type: response.d.ChartType,
                        onclick: function (d, i) { console.log("onclick", d, i); },
                        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                    },
                    donut: {
                        title: response.d.Parameter,
                        width: 60,
                        label: {
                            format: function (value, ratio, id) {
                                return value;
                            }
                        }
                    },
                    color: {
                        pattern: ["#F06292", "#8892d6", "#78c350", "#45bbe0", "#ff9800", "#f7531f", "#0045b5"]
                    }
                });
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

    var parameter = $('#ddlCharts').val();
    $.fn.GetChart(parameter);

    $('#ddlCharts').change(function () {
        $.fn.GetChart(this.value);
    });

});