using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using photoMe_api.Models;
using photoMe_api.Repositories;

namespace photoMe_api.Services
{
    public interface ILikeService
    {
        Task<bool> LikeAlbum(Like newLike);
        Task<bool> UnlikeAlbum(Guid userId, Guid albumId);
        IEnumerable<Like> GetAllLike();
        Task<bool> IsAlbumLiked(Guid userId, Guid albumId);
        Task<Like> GetUserLike(Guid userId, Guid albumId);
    }
    public class LikeService : ILikeService
    {
        private IUnitOfWork _unitOfWork;
        private LikeRepository _likeRepository;
        private AlbumRepository _albumRepository;

        public LikeService(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
            this._likeRepository = unitOfWork.LikeRepository();
            this._albumRepository = unitOfWork.AlbumRepository();
        }

        public IEnumerable<Like> GetAllLike()
        {
            return this._likeRepository.GetList();
        }

        public async Task<Like> GetUserLike(Guid userId, Guid albumId)
        {
            return await this._likeRepository.GetUserLike(userId, albumId);
        }

        public Task<bool> IsAlbumLiked(Guid userId, Guid albumId)
        {
            return this._likeRepository.IsAlbumLikedAsync(userId, albumId);
        }

        public async Task<bool> LikeAlbum(Like newLike)
        {
            Album album = await this._albumRepository.GetByIdAsync((Guid)newLike.AlbumId);
            album.LikesNumber += 1;

            return await this._likeRepository.LikeAlbum(newLike);
        }

        public async Task<bool> UnlikeAlbum(Guid userId, Guid albumId)
        {
            Album album = await this._albumRepository.GetByIdAsync((Guid)albumId);
            album.LikesNumber -= 1;

            return await this._likeRepository.UnlikeAlbum(userId, albumId);
        }
    }
}