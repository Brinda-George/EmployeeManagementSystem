<%@ Page Title="Login" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="EmployeeManagementProject.Login" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <h2><%: Title %>.</h2>
    <div class="row">
        <div class="col-md-8">
            <section id="loginForm">
                <div class="form-horizontal">
                    <hr />
                    <div class="form-group">
                        <span class="col-md-2 control-label">User Name</span>
                        <div class="col-md-10">
                            <input type="text" id="txtUserName" placeholder="User Name" class="form-control" />
                            <label id="lblUserName" class="text-danger"></label>
                        </div>
                    </div>
                    <div class="form-group">
                        <span class="col-md-2 control-label">Password</span>
                        <div class="col-md-10">
                            <input type="Password" id="txtPassword" placeholder="Password" class="form-control" />
                            <label id="lblPassword" class="text-danger"></label>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-md-offset-2 col-md-10">
                            <button class="btn btn-primary" id="btnLogin">Login</button>
                        </div>
                    </div>
                </div>
                <p>
                    <%--<a id="RegisterHyperLink" href="~/Public/Register.aspx">Register as a new user</a> | <a id="ForgotPasswordHyperLink" href="~/Public/ForgotPassword.aspx">Forgot your password?</a>--%>
                </p>
            </section>
        </div>
    </div>
    <script type="text/javascript">
        function DisableBackButton() {
            window.history.forward()
        }
        DisableBackButton();
        window.onload = DisableBackButton;
        window.onpageshow = function (evt) { if (evt.persisted) DisableBackButton() }
        window.onunload = function () { void (0) }
    </script>
    <script type="text/javascript" src="Scripts/login.js"></script>
    <script type="text/javascript" src="Scripts/jquery.blockUI.js"></script>
    <script type="text/javascript" src="Scripts/jquery.toaster.js"></script>
    <script type="text/javascript" src="Scripts/jquery-confirm.min.js"></script>
</asp:Content>
