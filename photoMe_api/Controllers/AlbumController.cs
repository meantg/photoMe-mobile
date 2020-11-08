using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Options;
using photoMe_api.DTO;
using photoMe_api.Helpers;
using photoMe_api.Models;
using photoMe_api.Services;

namespace photoMe_api.Controllers
{
    [ApiController]
    [Route("/api/user/{userId}/albums")]
    [Authorize]
    public class AlbumController : ControllerBase
    {
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IActionContextAccessor _acctionContextAccessor;
        private readonly IUserService _userService;
        private readonly Cloudinary _cloudinary;
        private IAlbumService _albumService;

        public AlbumController(IPhotoService photoService, IUserService userService, IMapper mapper,
         IOptions<CloudinarySettings> cloudinaryConfig, IActionContextAccessor actionContextAccessor, IAlbumService albumService)
        {
            _cloudinaryConfig = cloudinaryConfig;
            _mapper = mapper;
            _photoService = photoService;
            _acctionContextAccessor = actionContextAccessor;
            _userService = userService;
            _albumService = albumService;

            Account account = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }

        [HttpPost("upload-album")]
        public async Task<IActionResult> UploadAlbum(Guid userId, [FromForm] AlbumForCreationDto albumForCreationDto)
        {
            if (!userId.Equals(new Guid(User.FindFirstValue(ClaimTypes.NameIdentifier))))
            {
                return Unauthorized();
            }

            User userFromRepo = await _userService.GetUser(userId);
            ImageUploadResult uploadResult = new ImageUploadResult();
            Album album = this._mapper.Map<Album>(albumForCreationDto);
            if (userFromRepo != null)
            {
                album.PhotographerId = userFromRepo.Id;
            }

            foreach (var image in albumForCreationDto.Files)
            {
                if (image.Length > 0)
                {
                    using (var stream = image.OpenReadStream())
                    {
                        var uploadParams = new ImageUploadParams()
                        {
                            File = new FileDescription(image.Name, stream),
                            Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face"),
                            Folder = "photome",
                        };

                        uploadResult = _cloudinary.Upload(uploadParams);
                    }
                }

                PhotoForCreationDto photoForCreationDto = new PhotoForCreationDto();
                photoForCreationDto.Url = uploadResult.Url.ToString();
                photoForCreationDto.PublicId = uploadResult.PublicId;
                photoForCreationDto.DateAdded = DateTime.UtcNow;
                var photo = _mapper.Map<Photo>(photoForCreationDto);

                if (!userFromRepo.Photos.Any(u => u.IsMain))
                {
                    photo.IsMain = true;
                }

                if (!album.Photos.Any(p => p.IsMain))
                {
                    album.ThumbnailPublicId = photo.PublicId;
                }

                userFromRepo.Photos.Add(photo);
                album.Photos.Add(photo);
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
            }

            if (await this._albumService.InsertAlbum(album))
            {
                return CreatedAtRoute("", new { userId = userId }, album);
            }

            return BadRequest("Could not add new album");
        }

        [HttpGet("")]
        public async Task<IActionResult> GetAlbumsByUser(Guid userId)
        {
            if (!userId.Equals(new Guid(User.FindFirstValue(ClaimTypes.NameIdentifier))))
            {
                return Unauthorized();
            }

            IEnumerable<Album> result = await this._albumService.GetAlbumsByUserId(userId);

            return Ok(result);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAlbums(Guid userId)
        {
            if (!userId.Equals(new Guid(User.FindFirstValue(ClaimTypes.NameIdentifier))))
            {
                return Unauthorized();
            }

            IEnumerable<Album> result = await this._albumService.GetAllAbums();

            return Ok(result);
        }

        [HttpGet("{albumId}/photos")]
        public async Task<IActionResult> GetAlbumPhotos(Guid userId, Guid albumId)
        {
            if (!userId.Equals(new Guid(User.FindFirstValue(ClaimTypes.NameIdentifier))))
            {
                return Unauthorized();
            }

            IEnumerable<Photo> result = await this._photoService.GetPhotoByAlbumId(albumId);
            return Ok(result);
        }

        [HttpGet("{albumId}")]
        public async Task<IActionResult> GetAlbumById(Guid userId, Guid albumId)
        {
            if (!userId.Equals(new Guid(User.FindFirstValue(ClaimTypes.NameIdentifier))))
            {
                return Unauthorized();
            }

            Album result = await this._albumService.GetAlbumById(albumId);
            AlbumForListDto albumForReturn = _mapper.Map<AlbumForListDto>(result);

            if (albumForReturn == null)
            {
                return BadRequest("Null album");
            }

            return Ok(albumForReturn);
        }

        [HttpGet("pagedAlbums")]
        public async Task<IActionResult> GetPagedAlbumAsync([FromQuery] int page, int pageSize){
            var result = await this._albumService.GetPagedAlbum(page, pageSize);

            return Ok(result);
        }
    }


}