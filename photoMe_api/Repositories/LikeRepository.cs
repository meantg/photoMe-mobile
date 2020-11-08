using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using photoMe_api.Data;
using photoMe_api.Models;

namespace photoMe_api.Repositories
{
    public interface ILikeRepository : IBaseRepository<Like>
    {
        Task<bool> LikeAlbum(Like newLike);
        Task<bool> UnlikeAlbum(Guid userId, Guid albumId);
        Task<bool> IsAlbumLikedAsync(Guid userId, Guid albumId);
        Task<Like> GetUserLike(Guid userId, Guid albumId);
    }
    public class LikeRepository : BaseRepository<Like>, ILikeRepository
    {
        public LikeRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Like> GetUserLike(Guid userId, Guid albumId)
        {
            var likeToReturn = await this.context.Likes.FirstOrDefaultAsync(l => l.AlbumId.Equals(albumId) && l.MakerId.Equals(userId));

            if (likeToReturn == null)
            {
                return null;
            }
            return likeToReturn;
        }

        public async Task<bool> IsAlbumLikedAsync(Guid userId, Guid albumId)
        {
            var like = await this.context.Likes.FirstOrDefaultAsync(l => l.AlbumId.Equals(albumId) && l.MakerId.Equals(userId));

            if (like == null)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> LikeAlbum(Like newLike)
        {
            return await this.InsertAsync(newLike);
        }

        public async Task<bool> UnlikeAlbum(Guid userId, Guid albumId)
        {
            var likeToDelete = await this.context.Likes.FirstOrDefaultAsync(l => l.AlbumId.Equals(albumId) && l.MakerId.Equals(userId));

            if (likeToDelete == null)
            {
                return false;
            }

            return await this.DeleteAsync(likeToDelete.Id);
        }
    }
}