<%@ Page Title="Employee List" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="EmployeeList.aspx.cs" Inherits="EmployeeManagementProject.EmployeeList" %>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <div id="listSection">
        <div class="row form-inline">
            <div class="col-md-12">
                <%--<h2 id="title"><%: Title %></h2>--%>
                <br />
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <input type="text" id="txtSearch" class="form-control" placeholder="Search by Name or email" />
            </div>
            <div class="col-md-2">
                <span>Age: &nbsp;</span>
                <select id="ddlAgefilter" class="form-control"></select>
            </div>
            <div class="col-md-4">
                <span>Department: &nbsp;</span>
                <select id="ddlDepartmentsfilter" class="form-control"></select>
            </div>
            <div class="col-md-2 form-group">
                <input type="button" id="btnShowModal" value="Add new Employee" class="btn btn-primary" title="Add employee" />
            </div>
        </div>
    </div>
    <br />
    <div class="row divTable">
        <div class="col-md-12">
            <div class="panel panel-default" id="pdfTable">
                <table id="tblEmployees" class="table table-striped table-responsive table-hover">
                    <thead>
                        <tr>
                            <th id="SNo" class="col-sm">S.No</th>
                            <th id="ID" class="col-md">Emp ID</th>
                            <th id="FirstName" class="sortable col-lg">First Name <i class="fa fa-sort"></i></th>
                            <th id="LastName" class="col-lg">Last Name</th>
                            <th id="Age" class="sortable col-sm">Age <i class="fa fa-sort"></i></th>
                            <th id="Gender" class="sortable col-lg">Gender <i class="fa fa-sort"></i></th>
                            <th id="Qualification" class="sortable col-lg">Qualification <i class="fa fa-sort"></i></th>
                            <th id="Department" class="sortable col-lg">Department <i class="fa fa-sort"></i></th>
                            <th id="Actions" colspan="3">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="listDiv"></tbody>
                </table>
            </div>
        </div>
        <div class="col-md-12">
            <a id="aPdfFile"></a>
            <input type="button" id="btnExport" value="Export To PDF" class="btn btn-primary" />
            <a id="aExcelFile"></a>
            <input type="button" id="btnExportExcel" value="Export To Excel" class="btn btn-primary" />
        </div>
    </div>
    <div class="row divTable">
        <div class="col-md-10">
            <ul id="table-pagination" class="pagination-md "></ul>
        </div>
        <div class="col-md-2 right">
            <span>Page Size:</span>
            <select id="ddlPageSize" class="form-control"></select>
        </div>
    </div>
    <div class="row" id="alertMessage">
        <div class="alert alert-success">
            <strong>No Search Result!!! </strong>
        </div>
    </div>

    <script type="text/html" id="list-template">
        {#foreach $T as items}
                <tr>
                    <td class="center">{$P.pageIndex + $T.items$index +1}</td>
                    <td class="empId">EMP-{$T.items.ID}</td>
                    <td>{$T.items.FirstName}</td>
                    <td>{$T.items.LastName}</td>
                    <td>{$T.items.Age}</td>
                    <td>{$T.items.Gender}</td>
                    <td>{$T.items.Qualification}</td>
                    <td>{$T.items.Department}</td>
                    <td>
                        <button type="button" class="btn btn-primary View" id="btnView_{$T.items.ID}" title="View"><i class="fa fa-eye" aria-hidden="true"></i></button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-primary Edit" id="btnEdit_{$T.items.ID}" title="Edit"><i class="fa fa-edit" aria-hidden="true"></i></button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-primary Delete" id="btnDelete_{$T.items.ID}" title="Delete"><i class="fa fa-trash" aria-hidden="true"></i></button>
                    </td>
                </tr>
        {#/for} 
    </script>

    <!--Bootstrap modal dialog that shows up on clicking Add Employee-->
    <div class="modal fade" tabindex="-1" id="addEmployeeModal" data-keyboard="false" data-backdrop="static" role="dialog" aria-labelledby="helpModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title"></h4>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="empId"/>
                    <table class="table" id="addEmployeeTable">
                        <tbody>
                            <tr>
                                <td class="col-md-6">
                                    <div class="col-md-3">First Name </div>
                                    <div class="col-md-9">
                                        <input type="text" id="txtFirstName" placeholder=" FirstName" class="form-control" />
                                        <label id="lblFirstName" class="text-danger"></label>
                                    </div>
                                </td>
                                <td class="col-md-6">
                                    <div class="col-md-3">Last Name </div>
                                    <div class="col-md-9">
                                        <input type="text" id="txtLastName" placeholder=" LastName" class="form-control" />
                                        <label id="lblLastName" class="text-danger"></label>
                                    </div>
                                </td>
                            </tr>
                            <tr id="empPassword">
                                <td class="col-md-6">
                                    <div class="col-md-3">Password </div>
                                    <div class="col-md-9">
                                        <input type="password" id="txtPassword" placeholder="Password" class="form-control" />
                                        <label id="lblPassword" class="text-danger"></label>
                                    </div>
                                </td>
                                <td class="col-md-6">
                                    <div class="col-md-3">Confirm Password </div>
                                    <div class="col-md-9">
                                        <input type="password" id="txtConfirmPassword" placeholder="Confirm Password" class="form-control" />
                                        <label id="lblConfirmPassword" class="text-danger"></label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="col-md-6">
                                    <div class="col-md-3">Age </div>
                                    <div class="col-md-9">
                                        <select id="ddlAge" class="form-control"></select>
                                        <label id="lblAge" class="text-danger"></label>
                                    </div>
                                </td>
                                <td class="col-md-6">
                                    <div class="col-md-3">Gender </div>
                                    <div class="col-md-9">
                                        <input type="radio" id="Male" name="Gender" value="Male" checked />
                                        Male
                                        <input type="radio" id="Female" name="Gender" value="Female" />
                                        Female
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="col-md-6">
                                    <div class="col-md-3">DOB </div>
                                    <div class="col-md-9">
                                        <input type="date" id="txtDateOfBirth" class="form-control"/>
                                        <label id="lblDateOfBirth" class="text-danger"></label>
                                    </div>
                                </td>
                                <td class="col-md-6">
                                    <div class="col-md-3">Qualification </div>
                                    <div class="col-md-9">
                                        <select id="ddlQualifications" class="form-control"></select>
                                        <label id="lblQualifications" class="text-danger"></label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="col-md-6">
                                    <div class="col-md-3">Address </div>
                                    <div class="col-md-9">
                                        <textarea id="txtAddress" class="form-control" placeholder="Address"></textarea>
                                        <label id="lblAddress" class="text-danger"></label>
                                    </div>
                                </td>
                                <td class="col-md-6">
                                    <div class="col-md-3">City </div>
                                    <div class="col-md-9">
                                        <input type="text" id="txtCity" class="form-control" placeholder="City Name"/>
                                        <label id="lblCity" class="text-danger"></label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="col-md-6">
                                    <div class="col-md-3">State </div>
                                    <div class="col-md-9">
                                        <input type="text" id="txtState" class="form-control" placeholder="State Name"/>
                                        <label id="lblState" class="text-danger"></label>
                                    </div>
                                </td>
                                <td class="col-md-6">
                                    <div class="col-md-3">Country </div>
                                    <div class="col-md-9">
                                        <select id="ddlCountries" class="form-control"></select>
                                        <label id="lblCountries" class="text-danger"></label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="col-md-6">
                                    <div class="col-md-3">Department </div>
                                    <div class="col-md-9">
                                        <select id="ddlDepartments" class="form-control"></select>
                                        <label id="lblDepartments" class="text-danger"></label>
                                    </div>
                                </td>
                                <td class="col-md-6">
                                    <div class="col-md-3">Experience </div>
                                    <div class="col-md-9">
                                        <input type="number" value="0" id="txtExperience" min="0" max="30" class="form-control" />
                                        <label id="lblExperience" class="text-danger"></label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="col-md-6">
                                    <div class="col-md-3">Mobile </div>
                                    <div class="col-md-9">
                                        <input type="tel" id="txtMobile" class="form-control" placeholder="Mobile Number"/>
                                        <label id="lblMobile" class="text-danger"></label>
                                    </div>
                                </td>
                                <td class="col-md-6">
                                    <div class="col-md-3">Email </div>
                                    <div class="col-md-9">
                                        <input type="email" id="txtEmail" class="form-control" placeholder="Email Address" />
                                        <label id="lblEmail" class="text-danger"></label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <div class="right">
                                        <div id="btnReset" class="btn btn-primary" title="Reset Form"><i class="fa fa-eraser"></i>&nbsp;&nbsp;Reset</div>
                                        <button id="btnInsertEmployee" class="btn btn-primary" title="Add/Edit"></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript" src="Scripts/script.js"></script>
    <script type="text/javascript" src="Scripts/jquery.twbsPagination.min.js"></script>
    <script type="text/javascript" src="Scripts/jquery.toaster.js"></script>
    <script type="text/javascript" src="Scripts/jquery-confirm.min.js"></script>
    <script type="text/javascript" src="Scripts/jquery.blockUI.js"></script>
    <script type="text/javascript" src="Scripts/date.format.js"></script>
    <script type="text/javascript" src="Scripts/jquery-jtemplates.js"></script>
    
</asp:Content>
