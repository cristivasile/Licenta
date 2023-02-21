using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Configurations
{
    class WheelConfiguration : IEntityTypeConfiguration<Wheel>
    {
        public void Configure(EntityTypeBuilder<Wheel> builder)
        {
            builder
                .Property(x => x.BoltPattern)
                .IsRequired();

            builder
                .Property(x => x.Width)
                .IsRequired();

            builder
                .Property(x => x.Diameter)
                .IsRequired();
        }
    }
}
