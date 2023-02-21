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
    class VehicleFeatureConfiguration : IEntityTypeConfiguration<VehicleFeature>
    {
        public void Configure(EntityTypeBuilder<VehicleFeature> builder)
        {
            //M - M: Vehicle <-> Feature
            builder
                .HasKey(x => new { x.VehicleId, x.FeatureId });

            builder
                .HasOne<Vehicle>(x => x.Vehicle)
                .WithMany(x => x.VehicleFeatures)
                .HasForeignKey(x => x.VehicleId);

            builder
                .HasOne<Feature>(x => x.Feature)
                .WithMany(x => x.FeatureVehicles)
                .HasForeignKey(x => x.FeatureId);

        }
    }
}
