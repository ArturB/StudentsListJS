using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using System.IO;
using System.Data.Entity.Infrastructure;

namespace StudentsListJS.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GroupsView()
        {
            return View();
        }

        public ActionResult Students()
        {
            return View();
        }

        public ActionResult RefreshIndex()
        {
            return RedirectToAction("Index");
        }

        public ActionResult RefreshGroups()
        {
            return RedirectToAction("GroupsView");
        }

        public ActionResult Tests()
        {
            return View();
        }

        [HttpGet]
        public string DataGet()
        {
            Storage stg = new Storage();
            return stg.getDataJsoned();

        }

        [HttpPost]
        public string DataPost()
        {
            string type = Request["type"];
            string action = Request["action"];
            if(type != null && type.Equals("student"))
            {
                //UPDATE STUDENT
                if (action != null && action.Equals("update"))
                {
                    try
                    {
                        StreamReader sr = new StreamReader(Request.InputStream);
                        string stJsoned = sr.ReadToEnd();
                        Student st = JsonConvert.DeserializeObject<Student>(stJsoned);
                        Storage stg = new Storage();
                        stg.updateStudent(st);
                        return DataGet();
                    }
                    catch (IndeksNonUnique)
                    {
                        return "IndeksNonUnique";
                    }
                    catch (NoGroup)
                    {
                        return "NoGroup";
                    }
                    catch(InvalidStudentName)
                    {
                        return "InvalidStudentName";
                    }
                    catch(InvalidBornCity)
                    {
                        return "InvalidBornCity";
                    }
                    catch(InvalidIndex)
                    {
                        return "InvalidIndex";
                    }
                    catch(JsonReaderException)
                    {
                        return "InvalidDate";
                    }
                    catch(UpdateError)
                    {
                        return "UpdateError";
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        return "DbUpdateConcurrencyException";
                    }
                    catch (DbUpdateException)
                    {
                        return "DbUpdateException";
                    }
                    catch(Exception)
                    {
                        return "Exception";
                    }
                }

                //DELETE STUDENT
                else if (action != null && action.Equals("delete"))
                {
                    StreamReader sr = new StreamReader(Request.InputStream);
                    string stJsoned = sr.ReadToEnd();
                    Student st = JsonConvert.DeserializeObject<Student>(stJsoned);
                    Storage stg = new Storage();
                    try
                    {
                        stg.deleteStudent(st);
                        return DataGet();
                    }
                    catch (DeleteError)
                    {
                        return "DeleteError";
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        return "DbUpdateConcurrencyException";
                    }
                    catch (DbUpdateException)
                    {
                        return "DbUpdateException";
                    }
                    catch (Exception)
                    {
                        return "Exception";
                    }
                }

                //NEW STUDENT
                else if (action != null && action.Equals("new"))
                {
                    StreamReader sr = new StreamReader(Request.InputStream);
                    string stJsoned = sr.ReadToEnd();
                    Student st = JsonConvert.DeserializeObject<Student>(stJsoned);
                    Storage stg = new Storage();
                    try
                    {
                        stg.createStudent(st);
                        return DataGet();
                    }
                    catch(IndeksNonUnique)
                    {
                        return "IndeksNonUnique";
                    }
                    catch (NoGroup)
                    {
                        return "NoGroup";
                    }
                    catch (InvalidStudentName)
                    {
                        return "InvalidStudentName";
                    }
                    catch (InvalidBornCity)
                    {
                        return "InvalidBornCity";
                    }
                    catch (InvalidIndex)
                    {
                        return "InvalidIndex";
                    }
                    catch (JsonReaderException)
                    {
                        return "InvalidDate";
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        return "DbUpdateConcurrencyException";
                    }
                    catch (DbUpdateException)
                    {
                        return "DbUpdateException";
                    }
                    catch (Exception)
                    {
                        return "Exception";
                    }
                }

                //OTHER
                else
                {
                    return "OTHER";
                }
            }
            else if(type != null && type.Equals("group"))
            {
                //UPDATE GROUP
                if (action != null && action.Equals("update"))
                {
                    StreamReader sr = new StreamReader(Request.InputStream);
                    string stJsoned = sr.ReadToEnd();
                    Group st = JsonConvert.DeserializeObject<Group>(stJsoned);
                    Storage stg = new Storage();
                    try
                    {
                        stg.updateGroup(st);
                        return DataGet();
                    }
                    catch (GroupNameNonUnique)
                    {
                        return "GroupNameNonUnique";
                    }
                    catch (NoGroupName)
                    {
                        return "NoGroupName";
                    }
                    catch (InvalidGroupName)
                    {
                        return "InvalidGroupName";
                    }
                    catch (GroupUpdateError)
                    {
                        return "GroupUpdateError";
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        return "DbUpdateConcurrencyException";
                    }
                    catch (DbUpdateException)
                    {
                        return "DbUpdateException";
                    }
                    catch (Exception)
                    {
                        return "Exception";
                    }
                }

                //DELETE GROUP
                else if (action != null && action.Equals("delete"))
                {
                    StreamReader sr = new StreamReader(Request.InputStream);
                    string stJsoned = sr.ReadToEnd();
                    Group st = JsonConvert.DeserializeObject<Group>(stJsoned);
                    Storage stg = new Storage();
                    try
                    {
                        stg.deleteGroup(st);
                        return DataGet();
                    }
                    catch (DeleteError)
                    {
                        return "DeleteError";
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        return "DbUpdateConcurrencyException";
                    }
                    catch (DbUpdateException)
                    {
                        return "DbUpdateException";
                    }
                    catch (Exception)
                    {
                        return "Exception";
                    }
                }

                //NEW GROUP
                else if (action != null && action.Equals("new"))
                {
                    StreamReader sr = new StreamReader(Request.InputStream);
                    string stJsoned = sr.ReadToEnd();
                    Group st = JsonConvert.DeserializeObject<Group>(stJsoned);
                    Storage stg = new Storage();
                    try
                    {
                        stg.createGroup(st);
                        return DataGet();
                    }
                    catch (GroupNameNonUnique)
                    {
                        return "GroupNameNonUnique";
                    }
                    catch (NoGroupName)
                    {
                        return "NoGroupName";
                    }
                    catch (InvalidGroupName)
                    {
                        return "InvalidGroupName";
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        return "DbUpdateConcurrencyException";
                    }
                    catch (DbUpdateException)
                    {
                        return "DbUpdateException";
                    }
                    catch (Exception)
                    {
                        return "Exception";
                    }
                }

                //OTHER
                else
                {
                    return "OTHER";
                }
            }

            //UNKNOWN KOMMAND
            else
            {
                return "";
            }
            
            
        }


    }
}