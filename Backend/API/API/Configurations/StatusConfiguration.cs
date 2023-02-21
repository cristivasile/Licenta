using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Configurations
{
    class StatusConfiguration : IEntityTypeConfiguration<Status>
    {
        public void Configure(EntityTypeBuilder<Status> builder)
        {
            //primary foreign
            builder
                .HasKey(x => x.VehicleId);

            builder
                .Property(x => x.VehicleStatus)
                .IsRequired();

            //nullable
            builder
                .Property(x => x.DateSold)
                .IsRequired(false);
        }
    }
}
