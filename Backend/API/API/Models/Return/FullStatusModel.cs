using API.Entities;

namespace API.Models.Return
{
    public class FullStatusModel : StatusModel
    {
        public string PurchasedBy { get; set; }

        public FullStatusModel(Status ob) : base(ob)
        {
            PurchasedBy = ob.PurchaserUserId;
        }
    }
}
