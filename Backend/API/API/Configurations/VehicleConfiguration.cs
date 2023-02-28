using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace API.Configurations
{
    class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
    {
        public void Configure(EntityTypeBuilder<Vehicle> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Price)
                .HasDefaultValue(0);

            builder.Property(x => x.Description)
                .HasDefaultValue("");

            builder.Property(x => x.Image)
                .HasDefaultValue("");

            //1 - 1: Vehicle <-> Status
            builder
                .HasOne<Status>(x => x.Status)
                .WithOne(x => x.Vehicle)
                .IsRequired();

            //1 - M : Vehicle <-> Location
            builder
                .HasOne<Location>(x => x.Location)
                .WithMany(x => x.OwnedVehicles)
                .HasForeignKey(x => x.LocationAddress);

            //1 - M : Vehicle <-> BodyType
            builder
                .HasOne<BodyType>(vehicle => vehicle.BodyType)
                .WithMany(bodyType => bodyType.Vehicles)
                .HasForeignKey(x => x.BodyTypeName)
                .IsRequired();

            //1 - M : Vehicle <-> VehicleType
            builder
                .HasOne<VehicleType>(vehicle => vehicle.VehicleType)
                .WithMany(model => model.Vehicles)
                .HasForeignKey(vehicle => new {vehicle.Brand, vehicle.Model})
                .IsRequired();
        }
    }
}
