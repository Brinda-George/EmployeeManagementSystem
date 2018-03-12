<%@ Page Title="Employee List" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="EmployeeList.aspx.cs" Inherits="EmployeeManagementProject.EmployeeList" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div class="wrapper">
        <div class="container-fluid" id="listSection">
            <div class="row form-inline">
                <div class="col-md-12">
                    <h2 id="title"><%: Title %></h2>
                </div>
                
                <div class="col-md-4">
                    <div class="input-group-btn">
                        <input type="text" id="txtSearch" class="form-control" placeholder="Search by Name" />
                        <input type="button" id="btnSearch" value="Search" class="btn btn-primary" />
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="input-group">
                    <span class="input-group-addon">Filter by Age:</span>
                    <select id="ddlAgefilter" class="form-control"></select>
                    <span class="input-group-addon">Filter by Department:</span>
                    <select id="ddlDepartmentsfilter" class="form-control"></select>
                </div>
                    <%--Filter by Age:
                    <select id="ddlAgefilter" class="form-control"></select>--%>
                </div>
                <%--<div class="col-md-2">
                    Filter by Department:
                    <select id="ddlDepartmentsfilter" class="form-control"></select>
                </div>--%>
                <div class="col-md-2 form-group">
                    <input type="button" id="btnShowModal" value="Add new Employee" class="btn btn-primary" title="Add employee" />
                </div>
            </div>
            <br />
            <div class="row divTable">
                <div class="col-md-12">
                    <div class="panel panel-default" id="pdfTable">
                        <table id="tblEmployees" class="table table-striped table-responsive table-hover">
                            <thead>
                                <tr>
                                    <th id="SNo">S.No</th>
                                    <th id="ID">Emp ID</th>
                                    <th id="FirstName" class="sortable">First Name <i class="fa fa-sort"></i></th>
                                    <th id="LastName">Last Name</th>
                                    <th id="Age" class="sortable">Age <i class="fa fa-sort"></i></th>
                                    <th id="Gender" class="sortable">Gender <i class="fa fa-sort"></i></th>
                                    <th id="Qualification" class="sortable">Qualification <i class="fa fa-sort"></i></th>
                                    <th id="Department" class="sortable">Department <i class="fa fa-sort"></i></th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="listDiv"></tbody>
                        </table>
                    </div>
                </div>
                <div class="col-md-12">
                    <input type="hidden" id="hfExportPdf" />
                    <input type="button" id="btnExport" value="Export To PDF" class="btn btn-primary" />
                </div>
            </div>
            <div class="row divTable">
                <div class="col-md-6">
                    <ul id="table-pagination" class="pagination-md "></ul>
                </div>
                <div class="col-md-6">
                    <br />
                    <div class="right">
                        <span>Page Size:</span>
                        <select id="ddlPageSize"></select>
                    </div>
                </div>
            </div>
            <div class="row" id="alertMessage">
                <div class="alert alert-success">
                    <strong>No Search Result!!! </strong>
                </div>
            </div>
        </div>
    </div>

    <script type="text/html" id="list-template">
        {#foreach $T as items}
                <tr>
                    <td>{$P.pageIndex + $T.items$index +1}</td>
                    <td>EMP-{$T.items.ID}</td>
                    <td>{$T.items.FirstName}</td>
                    <td>{$T.items.LastName}</td>
                    <td>{$T.items.Age}</td>
                    <td>{$T.items.Gender}</td>
                    <td>{$T.items.Qualification}</td>
                    <td>{$T.items.Department}</td>
                    <td>
                        <button type="button" class="btn btn-primary Edit" id="btnEdit-{$T.items.ID}" title="Edit"><i class="fa fa-edit" aria-hidden="true"></i></button>
                        &nbsp;&nbsp;
                        <button type="button" class="btn btn-primary Delete" id="btnDelete-{$T.items.ID}" title="Delete"><i class="fa fa-trash" aria-hidden="true"></i></button>
                    </td>
                </tr>
        {#/for} 
    </script>

    <!--Bootstrap modal dialog that shows up on clicking Add Employee-->
    <div class="modal fade" tabindex="-1" id="addEmployeeModal" data-keyboard="false" data-backdrop="static" role="dialog" aria-labelledby="helpModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title"></h4>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="empId" />
                    <table class="table" id="addEmployeeTable">
                        <tbody>
                            <tr>
                                <td>First Name</td>
                                <td>
                                    <input type="text" id="txtFirstName" placeholder=" FirstName" required />
                                    <label id="lblFirstName" class="text-danger"></label>
                                </td>
                            </tr>
                            <tr>
                                <td>Last Name</td>
                                <td>
                                    <input type="text" id="txtLastName" placeholder=" LastName" required />
                                    <label id="lblLastName" class="text-danger"></label>
                                </td>
                            </tr>
                            <tr>
                                <td>Age</td>
                                <td>
                                    <select id="ddlAge"></select>
                                    <label id="lblAge" class="text-danger"></label>
                                </td>
                            </tr>
                            <tr>
                                <td>Gender</td>
                                <td>
                                    <input type="radio" id="Male" name="Gender" value="Male" checked />
                                    Male
                                    <input type="radio" id="Female" name="Gender" value="Female" />
                                    Female
                                </td>
                            </tr>
                            <tr>
                                <td>Qualification</td>
                                <td>
                                    <select id="ddlQualifications"></select>
                                    <label id="lblQualifications" class="text-danger"></label>
                                </td>
                            </tr>
                            <tr>
                                <td>Department</td>
                                <td>
                                    <select id="ddlDepartments"></select>
                                    <label id="lblDepartments" class="text-danger"></label>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <button id="btnReset" class="btn btn-primary" title="Reset Form"><i class="fa fa-eraser"></i>&nbsp;&nbsp;Reset</button>
                                    <button id="btnInsertEmployee" class="btn btn-primary right" title="Add/Edit"></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript" src="Scripts/jquery.twbsPagination.min.js"></script>
    <script type="text/javascript" src="Scripts/jquery.toaster.js"></script>
    <script type="text/javascript" src="Scripts/jquery-confirm.min.js"></script>
    <script type="text/javascript" src="Scripts/jquery.blockUI.js"></script>
    <script type="text/javascript" src="Scripts/jquery-jtemplates.js"></script>
</asp:Content>
