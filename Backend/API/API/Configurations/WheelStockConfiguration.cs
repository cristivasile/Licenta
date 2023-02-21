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
    class WheelStockConfiguration : IEntityTypeConfiguration<WheelStock>
    {
        public void Configure(EntityTypeBuilder<WheelStock> builder)
        {
            //M - M: Wheel <-> Location
            builder
                .HasKey(x => new { x.WheelId, x.LocationId });

            builder
                .HasOne<Wheel>(x => x.Wheel)
                .WithMany(x => x.Locations)
                .HasForeignKey(x => x.WheelId);

            builder
                .HasOne<Location>(x => x.Location)
                .WithMany(x => x.Wheels)
                .HasForeignKey(x => x.LocationId);

        }
    }
}
