using System;
using System.Threading.Tasks;
using photoMe_api.Data;

namespace photoMe_api.Repositories
{
    public interface IUnitOfWork
    {
        Task<bool> SaveAsync();
        AlbumRepository AlbumRepository();
        AuthRepository AuthRepository();
        ConstantRepository ConstantRepository();
        LikeRepository LikeRepository();
        MessageRepository MessageRepository();
        NotificationRepository NotificationRepository();
        PhotoRepository PhotoRepository();
        PhotoShootRepository PhotoShootRepository();
        ReviewRepository ReviewRepository();
        UserRepository UserRepository();

    }
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        public AppDbContext context { get; set; }
        public AlbumRepository _albumRepository { get; set; }
        public AuthRepository _authRepository { get; set; }
        public ConstantRepository _constantRepository { get; set; }
        public LikeRepository _likeRepository { get; set; }
        public MessageRepository _messageRepository { get; set; }
        public NotificationRepository _notificationRepository { get; set; }
        public PhotoRepository _photoRepository { get; set; }
        public PhotoShootRepository _photoShootRepository { get; set; }
        public ReviewRepository _reviewRepository { get; set; }
        public UserRepository _userRepository { get; set; }


        private bool disposed = false;

        public UnitOfWork(AppDbContext context)
        {
            this.context = context;
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public async Task<bool> SaveAsync()
        {
            if (await this.context.SaveChangesAsync() > 0)
            {
                return true;
            }
            return false;
        }

        public AlbumRepository AlbumRepository()
        {
            if (this._albumRepository == null)
            {
                this._albumRepository = new AlbumRepository(this.context);
            }

            return this._albumRepository;
        }

        public AuthRepository AuthRepository()
        {
            if (this._authRepository == null)
            {
                this._authRepository = new AuthRepository(this.context);
            }

            return this._authRepository;
        }

        public ConstantRepository ConstantRepository()
        {
            if (this._constantRepository == null)
            {
                this._constantRepository = new ConstantRepository(this.context);
            }

            return this._constantRepository;
        }

        public LikeRepository LikeRepository()
        {
            if (this._likeRepository == null)
            {
                this._likeRepository = new LikeRepository(this.context);
            }

            return this._likeRepository;
        }

        public MessageRepository MessageRepository()
        {
            if (this._messageRepository == null)
            {
                this._messageRepository = new MessageRepository(this.context);
            }

            return this._messageRepository;
        }

        public NotificationRepository NotificationRepository()
        {
            if (this._notificationRepository == null)
            {
                this._notificationRepository = new NotificationRepository(this.context);
            }

            return this._notificationRepository;
        }

        public PhotoRepository PhotoRepository()
        {
            if (this._photoRepository == null)
            {
                this._photoRepository = new PhotoRepository(this.context);
            }

            return this._photoRepository;
        }

        public PhotoShootRepository PhotoShootRepository()
        {
            if (this._photoShootRepository == null)
            {
                this._photoShootRepository = new PhotoShootRepository(this.context);
            }

            return this._photoShootRepository;
        }

        public ReviewRepository ReviewRepository()
        {
            if (this._reviewRepository == null)
            {
                this._reviewRepository = new ReviewRepository(this.context);
            }

            return this._reviewRepository;
        }

        public UserRepository UserRepository()
        {
            if (this._userRepository == null)
            {
                this._userRepository = new UserRepository(this.context);
            }

            return this._userRepository;
        }
    }
}