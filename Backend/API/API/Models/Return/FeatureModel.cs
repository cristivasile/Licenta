using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class FeatureModel : FeatureCreateModel
    {
        public FeatureModel(Feature ob)
        {
            Name = ob.Name;
            Desirability = ob.Desirability;
        }

        public static List<FeatureModel> ConvertToResultType(List<Feature> list)
        {
            List<FeatureModel> result = new();

            foreach (var ob in list)
                result.Add(new(ob));

            return result;
        }
    }
}
