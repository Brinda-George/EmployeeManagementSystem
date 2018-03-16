<%@ Page Title="Charts" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Charts.aspx.cs" Inherits="EmployeeManagementProject.Charts" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <br />
    <br />
    <div class="col-md-2">
        <select id="ddlCharts" class="form-control">
            <option value="Department">Department</option>
            <option value="Gender">Gender</option>
            <option value="Qualification">Qualification</option>
        </select>
    </div>
    <div class="col-md-10">
        <div id="chart"></div>
    </div>
    <script type="text/javascript" src="Scripts/chart.js"></script>
    <script type="text/javascript" src="Scripts/jquery.blockUI.js"></script>
    <script type="text/javascript" src="Scripts/jquery.toaster.js"></script>
</asp:Content>
