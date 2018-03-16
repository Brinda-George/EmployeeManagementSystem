using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;

namespace EmployeeManagementProject.Models
{
    public class Employee
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Nullable<int> Age { get; set; }
        public string Gender { get; set; }
        public Nullable<System.DateTime> DateOfBirth { get; set; }
        public Nullable<int> QualificationId { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public Nullable<int> CountryId { get; set; }
        public Nullable<int> DepartmentId { get; set; }
        public Nullable<int> Experience { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
    public class EmployeeModel
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Nullable<int> Age { get; set; }
        public string Gender { get; set; }
        public Nullable<DateTime> DateOfBirth { get; set; }
        public string Qualification { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Department { get; set; }
        public Nullable<int> Experience { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
    }
    public class MasterDataViewModel
    {
        public List<ListItem> QualificationList { get; set; }
        public List<ListItem> DepartmentList { get; set; }
        public List<ListItem> CountryList { get; set; }
    }
    public class EmployeeListModel
    {
        public List<EmployeeModel> Employees { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public bool PageContent { get; set; }
        public int TotalPages { get; set; }
    }
    public class QualificationModel
    {
        public int Id { get; set; }
        public string Qualification { get; set; }
    }
    public class DepartmentModel
    {
        public int Id { get; set; }
        public string Department { get; set; }
    }

    public class CountryModel
    {
        public int Id { get; set; }
        public string CountryName { get; set; }
    }

    public class ChartModel
    {
        public List<ListItem> ChartData { get; set; }
        public string Parameter { get; set; }
        public string ChartType { get; set; }

    }
}