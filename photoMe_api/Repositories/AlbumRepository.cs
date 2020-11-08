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
    public interface IAlbumRepository : IBaseRepository<Album>
    {
        Task<IEnumerable<Album>> GetAlbumsByUserId(Guid userId);
        Task<IEnumerable<Album>> GetAllAlbums();
        Task<Album> GetAlbumById(Guid albumId);
        Task<IEnumerable<Album>> GetPagedAlbumAsync(int page, int pageSize);
    }
    public class AlbumRepository : BaseRepository<Album>, IAlbumRepository
    {
        public AlbumRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Album> GetAlbumById(Guid albumId)
        {
            return await this.dbSet.Include(a => a.Photos).Include(album => album.Photographer).Where(a => a.Id.Equals(albumId)).SingleOrDefaultAsync<Album>();
        }

        public async Task<IEnumerable<Album>> GetAlbumsByUserId(Guid userId)
        {
            return await this.context.Albums.Include(album => album.Reviews).Where(a => a.PhotographerId.Equals(userId)).ToListAsync();
        }

        public async Task<IEnumerable<Album>> GetAllAlbums()
        {
            return await this.dbSet.Include(album => album.Photos)
                                    .Include(album => album.Photographer)
                                    .OrderByDescending(album => album.CreatedAt).ToListAsync();
        }

        public async Task<IEnumerable<Album>> GetPagedAlbumAsync(int page, int pageSize)
        {
            var skip = (page - 1 )* pageSize;   
            return await this.dbSet.Skip(skip).Take(pageSize).Include(album => album.Photos)
                                    .Include(album => album.Photographer)
                                    .OrderByDescending(album => album.CreatedAt).ToListAsync();

        }
    }
}