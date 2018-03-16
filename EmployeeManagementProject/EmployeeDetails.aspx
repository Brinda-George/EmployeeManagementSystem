<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="EmployeeDetails.aspx.cs" Inherits="EmployeeManagementProject.EmployeeDetails" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <input type="hidden" id="empId" /><br />
    <br />
    <table class="table table-striped table-responsive table-hover" id="employeeTable">
        <tbody>
            <tr>
                <td class="col-md-6">
                    <div class="col-md-3">First Name: </div>
                    <div class="col-md-9">
                        <label id="lblFirstName"></label>
                    </div>
                </td>
                <td class="col-md-6">
                    <div class="col-md-3">Last Name: </div>
                    <div class="col-md-9">
                        <label id="lblLastName"></label>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="col-md-6">
                    <div class="col-md-3">Age: </div>
                    <div class="col-md-9">
                        <label id="lblAge"></label>
                    </div>
                </td>
                <td class="col-md-6">
                    <div class="col-md-3">Gender: </div>
                    <div class="col-md-9">
                        <label id="lblGender"></label>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="col-md-6">
                    <div class="col-md-3">Date Of Birth: </div>
                    <div class="col-md-9">
                        <label id="lblDateOfBirth"></label>
                    </div>
                </td>
                <td class="col-md-6">
                    <div class="col-md-3">Qualification: </div>
                    <div class="col-md-9">
                        <label id="lblQualifications"></label>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="col-md-6">
                    <div class="col-md-3">Address: </div>
                    <div class="col-md-9">
                        <label id="lblAddress"></label>
                    </div>
                </td>
                <td class="col-md-6">
                    <div class="col-md-3">City: </div>
                    <div class="col-md-9">
                        <label id="lblCity"></label>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="col-md-6">
                    <div class="col-md-3">State: </div>
                    <div class="col-md-9">
                        <label id="lblState"></label>
                    </div>
                </td>
                <td class="col-md-6">
                    <div class="col-md-3">Country: </div>
                    <div class="col-md-9">
                        <label id="lblCountries"></label>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="col-md-6">
                    <div class="col-md-3">Department: </div>
                    <div class="col-md-9">
                        <label id="lblDepartments"></label>
                    </div>
                </td>
                <td class="col-md-6">
                    <div class="col-md-3">Experience: </div>
                    <div class="col-md-9">
                        <label id="lblExperience"></label>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="col-md-6">
                    <div class="col-md-3">Mobile: </div>
                    <div class="col-md-9">
                        <label id="lblMobile"></label>
                    </div>
                </td>
                <td class="col-md-6">
                    <div class="col-md-3">Email: </div>
                    <div class="col-md-9">
                        <label id="lblEmail"></label>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <script type="text/javascript" src="Scripts/jquery.blockUI.js"></script>
    <script type="text/javascript" src="Scripts/employeeDetails.js"></script>
    <script type="text/javascript" src="Scripts/date.format.js"></script>
    <script type="text/javascript" src="Scripts/jquery.toaster.js"></script>
</asp:Content>
