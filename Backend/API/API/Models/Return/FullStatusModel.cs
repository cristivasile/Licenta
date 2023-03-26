﻿using API.Entities;

namespace API.Models.Return
{
    public class FullStatusModel : StatusModel
    {
        public string PurchasedBy { get; set; }

        public FullStatusModel(Status ob) : base(ob)
        {
            if(ob.PurchasedBy != null)
                PurchasedBy = ob.PurchasedBy.UserName;
        }
    }
}
