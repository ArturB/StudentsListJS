using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using System.Web;
using System.IO;

namespace StudentsListJS
{
    public class UpdateError : Exception { }
    public class IndeksNonUnique : Exception { }
    public class InvalidStudentName : Exception { }
    public class NoGroup : Exception { }
    public class DeleteError : Exception { }
    public class InvalidBornCity : Exception { }
    public class GroupNameNonUnique : Exception { }
    public class InvalidGroupName : Exception { }
    public class NoGroupName : Exception { }
    public class GroupUpdateError : Exception { }
    public class InvalidIndex :  Exception { }

    public class Storage
    {
        string ValidNameRegex = @"^[A-ZĄĆĘŁÓŃŚŻŹ][A-ZĄĆĘŁÓŃŚŻŹ a-ząćęłóńśżź\-]+$";
        string ValidGroupNameRegex = @"^[A-ZĄĆĘŁÓŃŚŻŹ][A-ZĄĆĘŁÓŃŚŻŹ a-ząćęłóńśżź0-9\-]+$";
        string ValidIndexReges = @"^[0-9]+$";

        public Student chosenStudent { get; set; }

        // download data from database
        public StudentsData getData()
        {
            using (var db = new StorageContext())
            {
                StudentsData res = new StudentsData();
                res.Students = db.Students.ToList();
                res.Groups = db.Groups.ToList();
                return res;
            }
        } // getData

        //derecursed
        public string getDataJsoned()
        {
            using (var db = new StorageContext())
            {
                StudentsData res = new StudentsData();
                res.Students = db.Students.ToList();
                res.Groups = db.Groups.ToList();
                foreach(Student s in res.Students)
                {
                    s.Group = null;
                }
                foreach(Group g in res.Groups)
                {
                    g.Students = null;
                }

                return JsonConvert.SerializeObject(res);
            }
        }

        //create new student in db
        public void createStudent(Student st)
        {
            using (var db = new StorageContext())
            {
                if (db.Students.Where(s => s.IndexNo == st.IndexNo).Count() > 0)
                {
                    throw new IndeksNonUnique();
                }
                else if (st.Group == null)
                {
                    throw new NoGroup();
                }
                else if (
                    st.FirstName == null ||
                    st.LastName == null ||
                    !Regex.IsMatch(st.FirstName, ValidNameRegex) ||
                    !Regex.IsMatch(st.LastName, ValidNameRegex) ||
                    st.FirstName.Length > 20 ||
                    st.LastName.Length > 20
                )
                {
                    throw new InvalidStudentName();
                }
                else if (
                    st.BirthPlace != null &&
                    st.BirthPlace != "" && (
                    !Regex.IsMatch(st.BirthPlace, ValidNameRegex) ||
                    st.BirthPlace.Length > 32 )
                    )
                {
                    throw new InvalidBornCity();
                }
                else if(st.IndexNo == null || !Regex.IsMatch(st.IndexNo, ValidIndexReges) || st.IndexNo.Length > 10)
                    {
                    throw new InvalidIndex();
                }
                else
                {
                    var gr = db.Groups.Find(st.Group.IDGroup);
                    st.Group = gr;
                    db.Students.Add(st);
                    db.SaveChanges();
                }
            }
        } // createStudent

        //update student in db
        public void updateStudent(Student st)
        {
            using (var db = new StorageContext())
            {
                if (st.Group == null)
                {
                    throw new NoGroup();
                }
                else if (
                    st.FirstName == null ||
                    st.LastName == null |
                    !Regex.IsMatch(st.FirstName, ValidNameRegex) ||
                    !Regex.IsMatch(st.LastName, ValidNameRegex) ||
                    st.FirstName.Length > 20 ||
                    st.LastName.Length > 20
                )
                {
                    throw new InvalidStudentName();
                }
                else if (
                    st.BirthPlace != null &&
                    st.BirthPlace != "" && (
                    !Regex.IsMatch(st.BirthPlace, ValidNameRegex) ||
                    st.BirthPlace.Length > 32 )
                )
                {
                    throw new InvalidBornCity();
                }
                else if (st.IndexNo == null || !Regex.IsMatch(st.IndexNo, ValidIndexReges) || st.IndexNo.Length > 10)
                    {
                    throw new InvalidIndex();
                }
                else
                {
                    var original = db.Students.Find(st.IDStudent);
                    var group = db.Groups.Find(st.Group.IDGroup);

                    if (original != null)
                    {
                        original.FirstName = st.FirstName;
                        original.LastName = st.LastName;
                        original.BirthPlace = st.BirthPlace;
                        original.IndexNo = st.IndexNo;
                        original.BirthDate = st.BirthDate;
                        original.Group = group;

                        db.Entry(original).State = EntityState.Modified;
                        db.Entry(original).OriginalValues["Stamp"] = st.Stamp;
                        db.SaveChanges();
                    }
                    else
                    {
                        throw new UpdateError();
                    }
                }


            }
        } // updateStudent


        //delete student from db
        public void deleteStudent(Student st)
        {
            using (var db = new StorageContext())
            {
                var original = db.Students.Find(st.IDStudent);
                if (original != null)
                {
                    db.Entry(original).State = EntityState.Modified;
                    db.Entry(original).OriginalValues["Stamp"] = st.Stamp;
                    db.Students.Remove(original);
                    db.SaveChanges();
                }
                else
                {
                    throw new DeleteError();
                }
            }

        } // deleteStudent

        //create new group in db
        public void createGroup(Group gr)
        {
            using (var db = new StorageContext())
            {
                if (db.Groups.Where(s => s.Name == gr.Name).Count() > 0)
                {
                    throw new GroupNameNonUnique();
                }
                else if (gr.Name == null || gr.Name.Equals(""))
                {
                    throw new NoGroupName();
                }
                else if (
                    !Regex.IsMatch(gr.Name, ValidGroupNameRegex) || gr.Name.Length > 16
                )
                {
                    throw new InvalidGroupName();
                }
                else
                {
                    db.Groups.Add(gr);
                    db.SaveChanges();
                }
            }
        } // createGroup

        //update group in db
        public void updateGroup(Group gr)
        {
            using (var db = new StorageContext())
            {
                if (db.Groups.Where(s => s.Name == gr.Name && s.IDGroup != gr.IDGroup).Count() > 0)
                {
                    throw new GroupNameNonUnique();
                }
                else if (gr.Name == null || gr.Name.Equals(""))
                {
                    throw new NoGroupName();
                }
                else if (
                    !Regex.IsMatch(gr.Name, ValidGroupNameRegex) || gr.Name.Length > 16
                )
                {
                    throw new InvalidGroupName();
                }
                else
                {
                    var original = db.Groups.Find(gr.IDGroup);

                    if (original != null)
                    {
                        original.Name = gr.Name;

                        db.Entry(original).State = EntityState.Modified;
                        db.Entry(original).OriginalValues["Stamp"] = gr.Stamp;
                        db.SaveChanges();
                    }
                    else
                    {
                        throw new GroupUpdateError();
                    }
                }
            }
        } // updateGroup

        //delete group from db
        public void deleteGroup(Group gr)
        {
            using (var db = new StorageContext())
            {
                var original = db.Groups.Find(gr.IDGroup);
                if (original != null)
                {
                    db.Entry(original).State = EntityState.Modified;
                    db.Entry(original).OriginalValues["Stamp"] = gr.Stamp;
                    db.Groups.Remove(original);
                    db.SaveChanges();
                }
                else
                {
                    throw new DeleteError();
                }
            }

        } // deleteGroup

    } // Storage



    public class StudentsData
    {
        public List<Student> Students { get; set; }
        public List<Group> Groups { get; set; }
    }
}