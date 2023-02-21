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
    class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
    {
        public void Configure(EntityTypeBuilder<Vehicle> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Model)
                .IsRequired();

            builder.Property(x => x.Brand)
                .IsRequired();

            builder.Property(x => x.Price)
                .HasDefaultValue(0);

            //1 - 1: Vehicle <-> Status
            builder
                .HasOne<Status>(x => x.Status)
                .WithOne(x => x.Vehicle);

            //1 - M : Vehicle <-> Location
            builder
                .HasOne<Location>(x => x.Location)
                .WithMany(x => x.OwnedVehicles)
                .HasForeignKey(x => x.LocationAddress);
        }
    }
}
