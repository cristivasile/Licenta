using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class WheelModel : WheelCreateModel
    {
        public string Id { get; set; }

        public WheelModel(Wheel ob)
        {
            this.BoltPattern = ob.BoltPattern;
            this.Diameter = ob.Diameter;
            this.Id = ob.Id;
            this.Material = ob.Material;
            this.Weight = ob.Weight;
            this.Width = ob.Width;
            this.Price = ob.Price;
        }
    }
}
