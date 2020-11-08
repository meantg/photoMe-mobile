using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using photoMe_api.DTO;
using photoMe_api.Models;
using photoMe_api.Repositories;

namespace photoMe_api.Services
{
    public interface IAlbumService
    {
        Task<bool> InsertAlbum(Album album);
        Task<IEnumerable<Album>> GetAlbumsByUserId(Guid userId);
        Task<IEnumerable<Album>> GetAllAbums();
        Task<Album> GetAlbumById(Guid albumId);
        Task<IEnumerable<Album>> GetPagedAlbum(int page, int pageSize);
    }
    public class AlbumService : IAlbumService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly AlbumRepository _albumRepository;

        public AlbumService(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
            this._albumRepository = this._unitOfWork.AlbumRepository();
        }

        public Task<Album> GetAlbumById(Guid albumId)
        {
            return this._albumRepository.GetAlbumById(albumId);
        }

        public Task<IEnumerable<Album>> GetAlbumsByUserId(Guid userId)
        {
            return this._albumRepository.GetAlbumsByUserId(userId);
        }

        public Task<IEnumerable<Album>> GetAllAbums()
        {
            return this._albumRepository.GetAllAlbums();
        }

        public async Task<IEnumerable<Album>> GetPagedAlbum(int page, int pageSize)
        {
            return await this._albumRepository.GetPagedAlbumAsync(page, pageSize);
        }

        public Task<bool> InsertAlbum(Album album)
        {
            album.CreatedAt = DateTime.Now;
            album.UpdatedAt = DateTime.Now;
            
            return this._albumRepository.InsertAsync(album);
        }
    }
}