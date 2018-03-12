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
        public Nullable<int> QualificationId { get; set; }
        public Nullable<int> DepartmentId { get; set; }
    }
    public class EmployeeModel
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Nullable<int> Age { get; set; }
        public string Gender { get; set; }
        public string Qualification { get; set; }
        public string Department { get; set; }
    }
    public class MasterDataViewModel
    {
        public List<ListItem> QualificationList { get; set; }
        public List<ListItem> DepartmentList { get; set; }
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
}