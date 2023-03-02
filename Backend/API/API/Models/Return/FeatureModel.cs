using API.Entities;
using API.Models.Input;

namespace API.Models.Return
{
    public class FeatureModel : FeatureCreateModel
    {
        public FeatureModel(Feature ob)
        {
            Name = ob.Name;
            Desirability = ob.Desirability;
        }
    }
}
