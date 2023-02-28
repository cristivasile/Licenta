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
                .Property(x => x.IsSold)
                .HasDefaultValue(false);

            //nullable
            builder
                .Property(x => x.DateSold)
                .IsRequired(false);

            //1 - M: User <-> Status
            builder
                .HasOne<User>(status => status.PurchasedBy)
                .WithMany(user => user.PurchasedVehicleStatuses)
                .HasForeignKey(status => status.PurchaserUserId)
                .IsRequired(false);
        }
    }
}
