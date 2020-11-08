using Microsoft.EntityFrameworkCore;
using photoMe_api.Models;

namespace photoMe_api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public virtual DbSet<Album> Albums { get; set; }
        public virtual DbSet<Constant> Constants { get; set; }
        public virtual DbSet<Like> Likes { get; set; }
        public virtual DbSet<Message> Messages { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<Photo> Photos { get; set; }
        public virtual DbSet<PhotoShoot> PhotoShoots { get; set; }
        public virtual DbSet<Review> Reviews { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Album>().ToTable("Albums");
            builder.Entity<Constant>().ToTable("Constants");
            builder.Entity<Like>().ToTable("Likes");
            builder.Entity<Message>().ToTable("Messages");
            builder.Entity<Notification>().ToTable("Notifications");
            builder.Entity<Photo>().ToTable("Photos");
            builder.Entity<PhotoShoot>().ToTable("PhotoShoots");
            builder.Entity<Review>().ToTable("Reviews");
            builder.Entity<User>().ToTable("Users");

            builder.Entity<Album>()
                    .HasOne(a => a.Model)
                    .WithMany(u => u.ModelAlbums)
                    .HasForeignKey(a => a.ModelId)
                    .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Album>()
                    .HasOne(a => a.Photographer)
                    .WithMany(u => u.PhotographerAlbums)
                    .HasForeignKey(a => a.PhotographerId)
                    .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                    .HasOne(m => m.Sender)
                    .WithMany(u => u.SenderMessages)
                    .HasForeignKey(a => a.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                    .HasOne(a => a.Receiver)
                    .WithMany(u => u.ReceiverMessages)
                    .HasForeignKey(a => a.ReceiverId)
                    .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Notification>()
                    .HasOne(n => n.Sender)
                    .WithMany(u => u.SenderNotifications)
                    .HasForeignKey(n => n.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Notification>()
                    .HasOne(n => n.Receiver)
                    .WithMany(u => u.ReceiverNotifications)
                    .HasForeignKey(n => n.ReceiverId)
                    .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<PhotoShoot>()
                    .HasOne(ps => ps.Photographer)
                    .WithMany(u => u.PhotographerPhotoShoots)
                    .HasForeignKey(ps => ps.PhotographerId)
                    .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<PhotoShoot>()
                    .HasOne(ps => ps.Model)
                    .WithMany(u => u.ModelPhotoShoots)
                    .HasForeignKey(ps => ps.ModelId)
                    .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Review>()
                    .HasOne<User>(r => r.Maker)
                    .WithMany(u => u.Reviews)
                    .HasForeignKey(s => s.MakerId);

            builder.Entity<Review>()
                    .HasOne<Album>(r => r.Album)
                    .WithMany(u => u.Reviews)
                    .HasForeignKey(s => s.AlbumId);

            builder.Entity<Photo>()
                    .HasOne<Album>(p => p.Album)
                    .WithMany(a => a.Photos)
                    .HasForeignKey(p => p.AlbumId);

            builder.Entity<Photo>()
                    .HasOne<User>(p => p.User)
                    .WithMany(u => u.Photos)
                    .HasForeignKey(p => p.UserId);

            builder.Entity<Like>()
                    .HasOne<Album>(l => l.Album)
                    .WithMany(a => a.Likes)
                    .HasForeignKey(l => l.AlbumId);

            builder.Entity<Like>()
                    .HasOne<User>(l => l.Maker)
                    .WithMany(u => u.Likes)
                    .HasForeignKey(l => l.MakerId);
        }
    }
}