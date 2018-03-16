using EmployeeManagementProject.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Spire.Xls;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Security;
using System.Web.Services;
using System.Web.UI.WebControls;
using listItem = System.Web.UI.WebControls.ListItem;


namespace EmployeeManagementProject
{
    public partial class EmployeeList : System.Web.UI.Page
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
        public static List<CountryModel> GetCountries()
        {
            return dbContext.tblCountries
                .Select(s => new CountryModel
                {
                    Id = s.Id,
                    CountryName = s.CountryName
                }).ToList();
        }

        [WebMethod()]
        public static MasterDataViewModel GetMasterTableData()
        {
            List<QualificationModel> qualificationList = GetQualifications();
            List<listItem> qualifications = new List<listItem>();
            foreach (QualificationModel qualificationModel in qualificationList)
            {
                listItem selectlistitem = new listItem
                {
                    Text = qualificationModel.Qualification,
                    Value = qualificationModel.Id.ToString()

                };
                qualifications.Add(selectlistitem);
            }

            List<DepartmentModel> departmentList = GetDepartments();
            List<listItem> departments = new List<listItem>();
            foreach (DepartmentModel departmentModel in departmentList)
            {
                listItem selectlistitem = new listItem
                {
                    Text = departmentModel.Department,
                    Value = departmentModel.Id.ToString()

                };
                departments.Add(selectlistitem);
            }

            List<CountryModel> countryList = GetCountries();
            List<listItem> countries = new List<listItem>();
            foreach (CountryModel countryModel in countryList)
            {
                listItem selectlistitem = new listItem
                {
                    Text = countryModel.CountryName,
                    Value = countryModel.Id.ToString()

                };
                countries.Add(selectlistitem);
            }

            var data = new MasterDataViewModel
            {
                QualificationList = qualifications,
                DepartmentList = departments,
                CountryList = countries
            };
            return data;
        }

        [WebMethod()]
        [ScriptMethod]
        public static string InsertEmployee(Employee employee)
        {
            try
            {
                if (employee.ID == 0)
                {
                    dbContext.tblEmployees.Add(new tblEmployee
                    {
                        FirstName = employee.FirstName,
                        LastName = employee.LastName,
                        Age = employee.Age,
                        Gender = employee.Gender,
                        QualificationId = employee.QualificationId,
                        DepartmentId = employee.DepartmentId,
                        Address = employee.Address,
                        City = employee.City,
                        State = employee.State,
                        CountryId = employee.CountryId,
                        DateOfBirth = employee.DateOfBirth,
                        Email = employee.Email,
                        Experience = employee.Experience,
                        Mobile = employee.Mobile,
                        Password = FormsAuthentication.HashPasswordForStoringInConfigFile(employee.Password, "sha1")
                    });
                    dbContext.SaveChanges();
                    return Constants.employeeAdded;
                }
                else
                {
                    tblEmployee model = dbContext.tblEmployees.Where(x => x.ID == employee.ID).FirstOrDefault();
                    model.FirstName = employee.FirstName;
                    model.LastName = employee.LastName;
                    model.Age = employee.Age;
                    model.Gender = employee.Gender;
                    model.QualificationId = employee.QualificationId;
                    model.DepartmentId = employee.DepartmentId;
                    model.Address = employee.Address;
                    model.City = employee.City;
                    model.State = employee.State;
                    model.CountryId = employee.CountryId;
                    model.DateOfBirth = employee.DateOfBirth;
                    model.Experience = employee.Experience;
                    model.Mobile = employee.Mobile;
                    model.Email = employee.Email;
                    dbContext.SaveChanges();
                    return Constants.employeeUpdated;
                }
            }
            catch (Exception ex)
            {
                return string.Format(Constants.exceptionMessage, ex.GetType() + Environment.NewLine, ex.Message + Environment.NewLine, ex.StackTrace + Environment.NewLine);
            }
        }

        [WebMethod()]
        [ScriptMethod]
        public static string DeleteEmployee(int Id)
        {
            try
            {
                tblEmployee emp = dbContext.tblEmployees.Find(Id);
                dbContext.tblEmployees.Remove(emp);
                dbContext.SaveChanges();
                return Constants.employeeDeleted;
            }
            catch (Exception ex)
            {
                return string.Format(Constants.exceptionMessage, ex.GetType() + Environment.NewLine, ex.Message + Environment.NewLine, ex.StackTrace + Environment.NewLine);
            }
        }

        [WebMethod()]
        [ScriptMethod]
        public static EmployeeListModel GetEmployees(int pageIndex, int pageSize, string sortOrder, string sortColumn, string searchString, int filterGender, string filterDepartment)
        {
            EmployeeDbContext dbContext2 = new EmployeeDbContext();
            EmployeeListModel model = new EmployeeListModel();
            model.PageIndex = pageIndex;
            model.PageSize = pageSize;
            model.PageContent = true;
            var employeeList = dbContext2.tblEmployees.Where(e => e.FirstName != "admin").Join
              (dbContext2.tblQualifications, e => e.QualificationId, q => q.Id, (e, q) => new
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
              .Join(dbContext2.tblDepartments, s => s.DepartmentId, d => d.Id, (s, d) => new
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
              .Join(dbContext2.tblCountries, s => s.CountryId, d => d.Id, (c, f) => new
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
              });
            if (!String.IsNullOrEmpty(searchString))
            {
                employeeList = employeeList.Where(e => e.FirstName.ToLower().StartsWith(searchString.ToLower()) || e.LastName.ToLower().StartsWith(searchString.ToLower()));
            }
            if (filterGender > 0)
            {
                employeeList = employeeList.Where(e => e.Age == filterGender);
            }
            if (!String.IsNullOrEmpty(filterDepartment))
            {
                employeeList = employeeList.Where(e => e.Department.ToLower().StartsWith(filterDepartment.ToLower()));
            }
            switch (sortColumn)
            {
                case "FirstName":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.FirstName) : employeeList.OrderBy(e => e.FirstName);
                    break;
                case "Age":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.Age) : employeeList.OrderBy(e => e.Age);
                    break;
                case "Gender":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.Gender) : employeeList.OrderBy(e => e.Gender);
                    break;
                case "Qualification":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.Qualification) : employeeList.OrderBy(e => e.Qualification);
                    break;
                case "Department":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.Department) : employeeList.OrderBy(e => e.Department);
                    break;
                case "City":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.City) : employeeList.OrderBy(e => e.City);
                    break;
                case "State":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.State) : employeeList.OrderBy(e => e.State);
                    break;
                case "Country":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.CountryName) : employeeList.OrderBy(e => e.CountryName);
                    break;
                case "Experience":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.Experience) : employeeList.OrderBy(e => e.Experience);
                    break;
                case "Email":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.Email) : employeeList.OrderBy(e => e.Email);
                    break;
                case "Mobile":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.Mobile) : employeeList.OrderBy(e => e.Mobile);
                    break;
                default:
                    employeeList = employeeList.OrderBy(e => e.ID);
                    break;
            }
            model.TotalPages = (int)Math.Ceiling((decimal)employeeList.Count() / pageSize);
            if (employeeList.Skip((pageIndex - 1) * model.PageSize).Take(model.PageSize).Count() > 0)
            {
                employeeList = employeeList.Skip((pageIndex - 1) * model.PageSize).Take(model.PageSize);
            }
            else
            {
                model.PageContent = false;
            }
            model.Employees = employeeList.Select(s => new EmployeeModel
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
            }).ToList();
            return model;
        }

        [WebMethod()]
        [ScriptMethod]
        public static Employee GetEmployeeById(int Id)
        {
            Employee employee = dbContext.tblEmployees.Where(e => e.ID == Id)
                .Select(s => new Employee()
                {
                    ID = s.ID,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    Age = s.Age,
                    Gender = s.Gender,
                    QualificationId = s.QualificationId,
                    DepartmentId = s.DepartmentId,
                    Address = s.Address,
                    City = s.City,
                    State = s.State,
                    CountryId = s.CountryId,
                    DateOfBirth = s.DateOfBirth,
                    Experience = s.Experience,
                    Email = s.Email,
                    Mobile = s.Mobile,
                    Password = s.Password
                }).Single();
            return employee;
        }

        [WebMethod()]
        public static List<EmployeeModel> GetFullEmployeeList(string sortOrder, string sortColumn, string searchString, int filterGender, string filterDepartment)
        {
            EmployeeDbContext dbContext = new EmployeeDbContext();
            var employeeList = dbContext.tblEmployees.Where(e=> e.FirstName != "admin").Join
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
             });
            if (!String.IsNullOrEmpty(searchString))
            {
                employeeList = employeeList.Where(e => e.FirstName.ToLower().StartsWith(searchString.ToLower()) || e.LastName.ToLower().StartsWith(searchString.ToLower()));
            }
            if (filterGender > 0)
            {
                employeeList = employeeList.Where(e => e.Age == filterGender);
            }
            if (!String.IsNullOrEmpty(filterDepartment))
            {
                employeeList = employeeList.Where(e => e.Department.ToLower().StartsWith(filterDepartment.ToLower()));
            }
            switch (sortColumn)
            {
                case "FirstName":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.FirstName) : employeeList.OrderBy(e => e.FirstName);
                    break;
                case "Age":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.Age) : employeeList.OrderBy(e => e.Age);
                    break;
                case "Gender":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.Gender) : employeeList.OrderBy(e => e.Gender);
                    break;
                case "Qualification":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.Qualification) : employeeList.OrderBy(e => e.Qualification);
                    break;
                case "Department":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.Department) : employeeList.OrderBy(e => e.Department);
                    break;
                case "City":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.City) : employeeList.OrderBy(e => e.City);
                    break;
                case "State":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.State) : employeeList.OrderBy(e => e.State);
                    break;
                case "Country":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.CountryName) : employeeList.OrderBy(e => e.CountryName);
                    break;
                case "Experience":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.Experience) : employeeList.OrderBy(e => e.Experience);
                    break;
                case "Email":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.Email) : employeeList.OrderBy(e => e.Email);
                    break;
                case "Mobile":
                    employeeList = (sortOrder.ToLower() == "desc") ? employeeList.OrderByDescending(e => e.Mobile) : employeeList.OrderBy(e => e.Mobile);
                    break;
                default:
                    employeeList = employeeList.OrderBy(e => e.ID);
                    break;
            }
            return employeeList.Select(s => new EmployeeModel
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
            }).ToList();
        }

        [WebMethod()]
        public static string GeneratePdf(string sortOrder, string sortColumn, string searchString, int filterGender, string filterDepartment)
        {
            List<EmployeeModel> employees = GetFullEmployeeList(sortOrder, sortColumn, searchString, filterGender, filterDepartment);
            HttpServerUtility server = HttpContext.Current.Server;
            if (!Directory.Exists(server.MapPath("~/Files")))
                Directory.CreateDirectory(server.MapPath("~/Files"));
            DirectoryInfo di = new DirectoryInfo(server.MapPath("~/Files"));
            foreach (FileInfo fileInfo in di.GetFiles())
            {
                fileInfo.Delete();
            }
            Rectangle pagesize = new Rectangle(20, 20, PageSize.A4.Height, PageSize.A4.Width);
            Document doc = new Document(pagesize, 10, 10, 50, 10);
            //doc.SetPageSize(PageSize.A4.Rotate());
            MemoryStream ms = new MemoryStream();
            PdfWriter pw = PdfWriter.GetInstance(doc, ms);
            doc.Open();

            PdfPTable tbl = new PdfPTable(16);
            tbl.HorizontalAlignment = 0;
            tbl.TotalWidth = 800f;
            tbl.LockedWidth = true;
            float[] widths = new float[] { 20f, 45f, 55f, 55f, 20f, 45f, 50f, 55f, 50f, 80f, 50f, 50f, 50f, 45f, 50f, 80f};
            tbl.SetWidths(widths);
            BaseFont bf = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.EMBEDDED);
            Font headerfont = new Font(bf, 9, Font.BOLD);
            Font font = new Font(bf, 9);
            tbl.HeaderRows = 1;
            tbl.AddCell(new PdfPCell(new Phrase("S.\nNO.", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("Emp No", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("First Name", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("Last Name", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("Age", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("Gender", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("DOB", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("Qualification", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("Department", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("Address", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("City", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("State", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("Country", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("Experience", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("Mobile", headerfont)) { GrayFill = 0.95f });
            tbl.AddCell(new PdfPCell(new Phrase("Email", headerfont)) { GrayFill = 0.95f });
            for (int i = 0; i < employees.Count(); i++)
            {
                tbl.AddCell(new Phrase((i + 1).ToString(), font));
                tbl.AddCell(new Phrase("EMP-" + employees[i].ID.ToString(), font));
                tbl.AddCell(new Phrase(employees[i].FirstName, font));
                tbl.AddCell(new Phrase(employees[i].LastName, font));
                tbl.AddCell(new Phrase(employees[i].Age.ToString(), font));
                tbl.AddCell(new Phrase(employees[i].Gender, font));
                tbl.AddCell(new Phrase(employees[i].DateOfBirth.ToString(), font));
                tbl.AddCell(new Phrase(employees[i].Qualification, font));
                tbl.AddCell(new Phrase(employees[i].Department, font));
                tbl.AddCell(new Phrase(employees[i].Address, font));
                tbl.AddCell(new Phrase(employees[i].City, font));
                tbl.AddCell(new Phrase(employees[i].State, font));
                tbl.AddCell(new Phrase(employees[i].Country, font));
                tbl.AddCell(new Phrase(employees[i].Experience.ToString(), font));
                tbl.AddCell(new Phrase(employees[i].Mobile, font));
                tbl.AddCell(new Phrase(employees[i].Email, font));
            }
            doc.Add(tbl);
            doc.Close();
            byte[] byteArray = ms.ToArray();
            ms.Flush();
            ms.Close();
            ms.Dispose();
            MemoryStream memorystream = new MemoryStream(byteArray);
            string fullPath = "/Files/Employeetable_" + DateTime.Now.Ticks + ".pdf";
            FileStream file = new FileStream(HttpContext.Current.Server.MapPath(fullPath), FileMode.Create, FileAccess.Write);
            memorystream.WriteTo(file);
            file.Close();
            memorystream.Close();
            return fullPath;
        }

        [WebMethod()]
        public static string GenerateExcel(string sortOrder, string sortColumn, string searchString, int filterGender, string filterDepartment)
        {
            List<EmployeeModel> employees = GetFullEmployeeList(sortOrder, sortColumn, searchString, filterGender, filterDepartment);
            HttpServerUtility server = HttpContext.Current.Server;
            if (!Directory.Exists(server.MapPath("~/Files")))
                Directory.CreateDirectory(server.MapPath("~/Files"));
            DirectoryInfo di = new DirectoryInfo(server.MapPath("~/Files"));
            foreach (FileInfo fileInfo in di.GetFiles())
            {
                fileInfo.Delete();
            }
            DataTable dt = new DataTable();
            dt.Columns.Add("S No", typeof(int));
            dt.Columns.Add("Emp No", typeof(String));
            dt.Columns.Add("First Name", typeof(String));
            dt.Columns.Add("Last Name", typeof(String));
            dt.Columns.Add("Age", typeof(int));
            dt.Columns.Add("Gender", typeof(String));
            dt.Columns.Add("DateOfBirth", typeof(String));
            dt.Columns.Add("Qualification", typeof(String));
            dt.Columns.Add("Department", typeof(String));
            dt.Columns.Add("Address", typeof(String));
            dt.Columns.Add("City", typeof(String));
            dt.Columns.Add("State", typeof(String));
            dt.Columns.Add("Country", typeof(String));
            dt.Columns.Add("Experience", typeof(String));
            dt.Columns.Add("Mobile", typeof(String));
            dt.Columns.Add("Email", typeof(String));
            int i = 1;
            foreach (EmployeeModel employee in employees)
            {
                DataRow newRow = dt.NewRow();
                newRow["S No"] = i;
                newRow["Emp No"] = "EMP" + employee.ID;
                newRow["First Name"] = employee.FirstName;
                newRow["Last Name"] = employee.LastName;
                newRow["Age"] = employee.Age;
                newRow["Gender"] = employee.Gender;
                newRow["DateOfBirth"] = employee.DateOfBirth;
                newRow["Qualification"] = employee.Qualification;
                newRow["Department"] = employee.Department;
                newRow["Address"] = employee.Address;
                newRow["City"] = employee.City;
                newRow["State"] = employee.State;
                newRow["Country"] = employee.Country;
                newRow["Experience"] = employee.Experience;
                newRow["Mobile"] = employee.Mobile;
                newRow["Email"] = employee.Email;
                dt.Rows.Add(newRow);
                i++;
            }

            Workbook book = new Workbook();
            Worksheet sheet = book.Worksheets[0];
            sheet.InsertDataTable(dt, true, 1, 1);
            string fullFilePath = "/Files/EmployeeTable_" + DateTime.Now.Ticks + ".xls";
            book.SaveToFile(HttpContext.Current.Server.MapPath(fullFilePath));
            return fullFilePath;
        }

    }
}