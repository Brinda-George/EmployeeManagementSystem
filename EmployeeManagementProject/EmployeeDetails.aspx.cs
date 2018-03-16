using EmployeeManagementProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace EmployeeManagementProject
{
    public partial class EmployeeDetails : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if (Session["UserID"] == null)
                {
                    Response.Redirect("Login.aspx");
                }
            }
        }

        static EmployeeDbContext dbContext = new EmployeeDbContext();

        [WebMethod()]
        [ScriptMethod]
        public static EmployeeModel GetEmployeeBySessionId()
        {
            int Id = 0;
            if (HttpContext.Current.Session["UserID"] != null)
            {
                Id = Convert.ToInt32(HttpContext.Current.Session["UserID"]);
            }
            return dbContext.tblEmployees.Where(e => e.ID == Id).Join
             (dbContext.tblQualifications, e => e.QualificationId, q => q.Id, (e, q) => new
             {
                 e.ID,
                 e.FirstName,
                 e.LastName,
                 e.Age,
                 e.Gender,
                 e.DepartmentId,
                 e.Address,
                 e.City,
                 e.State,
                 e.CountryId,
                 e.DateOfBirth,
                 e.Email,
                 e.Experience,
                 e.Mobile,
                 q.Qualification
             })
             .Join(dbContext.tblDepartments, s => s.DepartmentId, d => d.Id, (s, d) => new
             {
                 s.ID,
                 s.FirstName,
                 s.LastName,
                 s.Age,
                 s.Gender,
                 s.DepartmentId,
                 s.Qualification,
                 d.Department,
                 s.Address,
                 s.City,
                 s.State,
                 s.CountryId,
                 s.DateOfBirth,
                 s.Email,
                 s.Experience,
                 s.Mobile
             })
             .Join(dbContext.tblCountries, s => s.CountryId, d => d.Id, (c, f) => new
             {
                 c.ID,
                 c.FirstName,
                 c.LastName,
                 c.Age,
                 c.Gender,
                 c.Qualification,
                 c.Department,
                 c.Address,
                 c.City,
                 c.State,
                 f.CountryName,
                 c.DateOfBirth,
                 c.Email,
                 c.Experience,
                 c.Mobile
             }).Select(s => new EmployeeModel()
                {
                    ID = s.ID,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    Age = s.Age,
                    Gender = s.Gender,
                    Qualification = s.Qualification,
                    Department = s.Department,
                    Address = s.Address,
                    City = s.City,
                    State = s.State,
                    Country = s.CountryName,
                    DateOfBirth = s.DateOfBirth,
                    Experience = s.Experience,
                    Email = s.Email,
                    Mobile = s.Mobile
                }).Single();
        }
    }
}