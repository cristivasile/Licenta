using API.Configurations;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API
{
    public class AppDbContext : IdentityDbContext
        <User, IdentityRole<string>, string, IdentityUserClaim<string>, IdentityUserRole<string>, IdentityUserLogin<string>,
        IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<AppointmentType> AppointmentTypes { get; set; }
        public DbSet<BodyType> BodyTypes { get; set; }
        public DbSet<ConfirmationToken> ConfirmationTokens { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<Picture> Images { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<Status> Statuses { get; set; }
        public DbSet<Thumbnail> Thumbnails { get; set; }
        public DbSet<UserDetails> UserDetails { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehicleType> VehicleTypes { get; set; }
        public DbSet<VehicleView> VehicleViews { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new VehicleConfiguration());
            modelBuilder.ApplyConfiguration(new StatusConfiguration());
            modelBuilder.ApplyConfiguration(new FeatureConfiguration());
        }

    }
}
