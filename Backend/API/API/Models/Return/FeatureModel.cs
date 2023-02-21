using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class FeatureModel : FeatureCreateModel
    {
        public string Id { get; set; }

        public FeatureModel (Feature ob)
        {
            Id = ob.Id;
            Name = ob.Name;
            Desirability = ob.Desirability;
        }
    }
}
