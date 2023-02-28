using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Feature: Entity
    {
        [Key]
        public string Name { get; set; }
        /// <example>
        /// 1 - Low, 3 - High
        /// </example>
        [Required]
        public int Desirability { get; set; }
        /// <summary>
        /// All vehicles that have this feature.
        /// </summary>
        public virtual ICollection<Vehicle> Vehicles { get; set; }
    }
}
