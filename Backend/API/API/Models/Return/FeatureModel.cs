using API.Entities;
using API.Models.Input;

namespace API.Models.Return
{
    public class FeatureModel : FeatureCreateModel
    {
        public string Id { get; set; }
        public FeatureModel(Feature ob)
        {
            Name = ob.Name;
            Id = ob.Id;
        }
    }
}
