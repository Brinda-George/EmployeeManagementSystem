using EmployeeManagementProject.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI.WebControls;
using listItem = System.Web.UI.WebControls.ListItem;


namespace EmployeeManagementProject
{
    public partial class EmployeeList : System.Web.UI.Page
    {
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

            var data = new MasterDataViewModel
            {
                QualificationList = qualifications,
                DepartmentList = departments
            };
            return data;
        }

        [WebMethod()]
        [ScriptMethod]
        public static string InsertEmployee(Employee employee)
        {
            try
            {
                int count = dbContext.tblEmployees.Where(e => e.ID == employee.ID).Count();
                if (count == 0)
                {
                    dbContext.tblEmployees.Add(new tblEmployee
                    {
                        FirstName = employee.FirstName,
                        LastName = employee.LastName,
                        Age = employee.Age,
                        Gender = employee.Gender,
                        QualificationId = employee.QualificationId,
                        DepartmentId = employee.DepartmentId
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
            var employeeList = dbContext2.tblEmployees.Join
              (dbContext2.tblQualifications, e => e.QualificationId, q => q.Id, (e, q) => new
              {
                  e.ID,
                  e.FirstName,
                  e.LastName,
                  e.Age,
                  e.Gender,
                  e.DepartmentId,
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
                  d.Department
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
                default:
                    employeeList = employeeList.OrderBy(e => e.ID);
                    break;
            }
            model.TotalPages = (int)Math.Ceiling((decimal)employeeList.Count() / pageSize);
            if(employeeList.Skip((pageIndex - 1) * model.PageSize).Take(model.PageSize).Count() > 0)
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
                Department = s.Department
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
                    DepartmentId = s.DepartmentId
                }).Single();
            return employee;
        }

        //[WebMethod()]
        //public static string ExportToPdf(string tableHtml)
        //{
        //    string sb = HttpUtility.HtmlDecode("<!DOCTYPE html><html><head></head><body>" + Regex.Replace(tableHtml, @"\n", "") + "</body></html>");
        //    StringReader sr = new StringReader(sb);
        //    Document document = new Document(PageSize.A4, 10f, 10f, 30f, 0f);
        //    document.SetPageSize(iTextSharp.text.PageSize.A4.Rotate());
        //    using (MemoryStream memoryStream = new MemoryStream())
        //    {
        //        Stream htmlstream = GenerateStreamFromString(sb);
        //        Stream cssstream = null;
        //        PdfWriter writer = PdfWriter.GetInstance(document, memoryStream);
        //        document.Open();
        //        XMLWorkerHelper.GetInstance().ParseXHtml(writer, document, htmlstream, cssstream);
        //        document.Close();
        //        byte[] bytes = memoryStream.ToArray();
        //        memoryStream.Close();

        //        //HttpResponse Response = HttpContext.Current.Response;
        //        //Response.Clear();
        //        //Response.ContentType = "application/pdf";
        //        //Response.AddHeader("Content-Disposition", "attachment; filename=table.pdf");
        //        //Response.Buffer = true;
        //        //Response.Cache.SetCacheability(HttpCacheability.NoCache);
        //        //Response.BinaryWrite(bytes);
        //        ////Response.End();
        //        //Response.Close();

        //        MemoryStream ms = new MemoryStream(bytes);
        //        FileStream file = new FileStream(HttpContext.Current.Server.MapPath("~/Files/pdfTable.pdf"), FileMode.Create, FileAccess.Write);
        //        ms.WriteTo(file);
        //        file.Close();
        //        ms.Close();
        //    }
        //    //return HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Host + "/" + "App_Data/pdfTable.pdf";
        //    return Constants.exportedToPdf;
        //}

        //public static Stream GenerateStreamFromString(string s)
        //{
        //    MemoryStream stream = new MemoryStream();
        //    StreamWriter writer = new StreamWriter(stream);
        //    writer.Write(s);
        //    writer.Flush();
        //    stream.Position = 0;
        //    return stream;
        //}

        [WebMethod()]
        public static string GeneratePdf()
        {
            HttpServerUtility server = HttpContext.Current.Server;
            string path = server.MapPath("~/Reports/myfile.pdf");
            if (!Directory.Exists(server.MapPath("~/Reports")))
                Directory.CreateDirectory(server.MapPath("~/Reports"));

            Rectangle pagesize = new Rectangle(20, 20, PageSize.A4.Width, PageSize.A4.Height);
            Document doc = new Document(pagesize, 10, 10, 50, 10);
            MemoryStream ms = new MemoryStream();
            PdfWriter pw = PdfWriter.GetInstance(doc, ms);
            doc.Open();
            HttpResponse Response = HttpContext.Current.Response;

            PdfPTable tbl = new PdfPTable(4);
            tbl.AddCell("Sr No");
            tbl.AddCell("Name");
            tbl.AddCell("Address");
            tbl.AddCell("Phone");
            for (int i = 1; i < 6; i++)
            {
                tbl.AddCell(i.ToString());
                tbl.AddCell("Name " + i.ToString());
                tbl.AddCell("Address " + i.ToString());
                tbl.AddCell("6789655" + i.ToString());
            }
            doc.Add(tbl);

            doc.Close();
            byte[] byteArray = ms.ToArray();
            ms.Flush();
            ms.Close();
            ms.Dispose();
            Response.Clear();
            Response.AddHeader("Content-Disposition", "attachment; filename=myfile.pdf");
            Response.AddHeader("Content-Length", byteArray.Length.ToString());
            Response.ContentType = "application/octet-stream";
            Response.BinaryWrite(byteArray);
            return Constants.exportedToPdf;
        }


    }
}