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
    public partial class Charts : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["UserID"] == null)
            {
                Response.Redirect("Login.aspx");
            }
        }

        static EmployeeDbContext dbContext = new EmployeeDbContext();

        [WebMethod()]
        [ScriptMethod]
        public static List<DepartmentModel> GetDepartments()
        {
            return dbContext.tblDepartments
                .Select(s => new DepartmentModel
                {
                    Id = s.Id,
                    Department = s.Department
                }).ToList();
        }

        [WebMethod()]
        [ScriptMethod]
        public static List<QualificationModel> GetQualifications()
        {
            return dbContext.tblQualifications
                .Select(s => new QualificationModel
                {
                    Id = s.Id,
                    Qualification = s.Qualification
                }).ToList();
        }

        [WebMethod()]
        [ScriptMethod]
        public static ChartModel GetChartData(string parameter)
        {
            ChartModel chartModel = new ChartModel();
            if (parameter == "Department")
            {
                chartModel.ChartData = GetDepartmentData();
                chartModel.ChartType = "pie";
            } else if (parameter == "Gender")
            {
                chartModel.ChartData = GetGenderData();
                chartModel.ChartType = "donut";
            } else if (parameter == "Qualification")
            {
                chartModel.ChartData = GetQualificationData();
                chartModel.ChartType = "bar";
            }
            chartModel.Parameter = parameter;
            return chartModel;
        }

        [WebMethod()]
        [ScriptMethod]
        public static List<ListItem> GetDepartmentData()
        {
            List<DepartmentModel> departments = GetDepartments();
            List<ListItem> chartData = new List<ListItem>();
            foreach (var departmentmodel in departments)
            {
                var department = dbContext.tblDepartments.Where(e => e.Department == departmentmodel.Department).Single();
                int departmentId = department.Id;
                ListItem selectlistitem = new ListItem
                {
                    Text = departmentmodel.Department,
                    Value = Convert.ToString(dbContext.tblEmployees.Where(e => e.DepartmentId == departmentId).Count())
                };
                chartData.Add(selectlistitem);
            }
            return chartData;
        }

        [WebMethod()]
        [ScriptMethod]
        public static List<ListItem> GetGenderData()
        {
            List<string> genders = new List<string>(){ "Male", "Female" };
            List<ListItem> chartData = new List<ListItem>();
            foreach (var gender in genders)
            {
                ListItem selectlistitem = new ListItem
                {
                    Text = gender,
                    Value = Convert.ToString(dbContext.tblEmployees.Where(e => e.Gender == gender).Count())
                };
                chartData.Add(selectlistitem);
            }
            return chartData;
        }

        [WebMethod()]
        [ScriptMethod]
        public static List<ListItem> GetQualificationData()
        {
            List<QualificationModel> qualifications = GetQualifications();
            List<ListItem> chartData = new List<ListItem>();
            foreach (var qualificationmodel in qualifications)
            {
                var qualification = dbContext.tblQualifications.Where(e => e.Qualification == qualificationmodel.Qualification).Single();
                int qualificationId = qualification.Id;
                ListItem selectlistitem = new ListItem
                {
                    Text = qualificationmodel.Qualification,
                    Value = Convert.ToString(dbContext.tblEmployees.Where(e => e.QualificationId == qualificationId).Count())
                };
                chartData.Add(selectlistitem);
            }
            return chartData;
        }
    }
}