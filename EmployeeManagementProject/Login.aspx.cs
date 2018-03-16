using EmployeeManagementProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Security;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace EmployeeManagementProject
{
    public partial class Login : System.Web.UI.Page
    {
        static EmployeeDbContext dbContext = new EmployeeDbContext();

        [WebMethod(EnableSession = true)]
        [ScriptMethod]
        public static string LoginEmployee(string userName, string password)
        {
            string hashedPwd = FormsAuthentication.HashPasswordForStoringInConfigFile(password, "sha1");
            var employee = new tblEmployee();
            if (userName == "admin" && password == "admin")
            {
                employee = dbContext.tblEmployees.Where(s => s.FirstName == userName && s.Password == password).FirstOrDefault();
                if (employee == null)
                {
                    return Constants.invalidLogin;
                }
                else
                {
                    HttpContext.Current.Session["UserID"] = employee.ID;
                    HttpContext.Current.Session["UserName"] = employee.FirstName;
                    return "EmployeeList.aspx";
                }
            }
            else
            {
                employee = dbContext.tblEmployees.Where(s => s.FirstName == userName && s.Password == hashedPwd).FirstOrDefault();
                if (employee == null)
                {
                    return Constants.invalidLogin;
                }
                else
                {
                    HttpContext.Current.Session["UserID"] = employee.ID;
                    HttpContext.Current.Session["UserName"] = employee.FirstName;
                    return "EmployeeDetails.aspx";
                }
            }
        }
    }
}