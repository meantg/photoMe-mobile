using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using photoMe_api.Data;
using photoMe_api.DTO;
using photoMe_api.Models;

namespace photoMe_api.Repositories
{
    public interface IPhotoRepository : IBaseRepository<Photo>
    {
        Task<Photo> GetPhoto(Guid id);
        Task<Photo> GetMainPhotoForUser(Guid userId);
        Task<IEnumerable<Photo>> GetPhotoByAlbumId(Guid albumId);
        bool DeletePhoto(Photo photoToDelete);
    }
    public class PhotoRepository : BaseRepository<Photo>, IPhotoRepository
    {
        public PhotoRepository(AppDbContext context) : base(context)
        {
        }
        
        public bool DeletePhoto(Photo photoToDelete)
        {
            if (photoToDelete == null)
            {
                return false;
            }

            context.Photos.Remove(photoToDelete);

            return true;
        }

        public async Task<Photo> GetMainPhotoForUser(Guid userId)
        {
            return await context.Photos.Where(u => u.UserId.Equals(userId)).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(Guid id)
        {
            var photo = await context.Photos.FirstOrDefaultAsync(p => p.Id.Equals(id));

            return photo;
        }

        public async Task<IEnumerable<Photo>> GetPhotoByAlbumId(Guid albumId)
        {
            var photos = await context.Photos.Where<Photo>(p => p.AlbumId.Equals(albumId)).ToListAsync();
            return photos;
        }
    }
}