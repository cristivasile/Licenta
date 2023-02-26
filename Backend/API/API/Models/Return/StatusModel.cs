using API.Entities;
using System;

namespace API.Models.Return
{
    public class StatusModel
    {
        public bool IsSold { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime? DateSold { get; set; }

        public StatusModel(Status ob)
        {
            IsSold = ob.IsSold;
            DateAdded = ob.DateAdded;
            DateSold = ob.DateSold;
        }
    }
}
