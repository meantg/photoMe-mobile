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
    [Route("/api/user/{userId}/photos")]
    [Authorize]
    public class PhotoController : ControllerBase
    {
        private IOptions<CloudinarySettings> _cloudinaryConfig;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IActionContextAccessor _acctionContextAccessor;
        private readonly IUserService _userService;
        private readonly Cloudinary _cloudinary;

        public PhotoController(IPhotoService photoService, IUserService userService, IMapper mapper,
         IOptions<CloudinarySettings> cloudinaryConfig, IActionContextAccessor actionContextAccessor)
        {
            _cloudinaryConfig = cloudinaryConfig;
            _mapper = mapper;
            _photoService = photoService;
            _acctionContextAccessor = actionContextAccessor;
            _userService = userService;

            Account account = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhoto(Guid id)
        {
            var photoFromRepo = await _photoService.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }

        [HttpPost("upload-photos")]
        public async Task<IActionResult> AddPhotosForUser(Guid userId, [FromForm] PhotoForCreationDto photoForCreationDto)
        {
            if (!userId.Equals(new Guid(User.FindFirstValue(ClaimTypes.NameIdentifier))))
            {
                return Unauthorized();
            }

            var userFromRepo = await _userService.GetUser(userId);
            var file = photoForCreationDto.File;
            var uploadResult = new ImageUploadResult();
            List<PhotoForReturnDto> listPhotos = new List<PhotoForReturnDto>();

            foreach (var image in photoForCreationDto.Files)
            {
                if (image.Length > 0)
                {
                    using (var stream = image.OpenReadStream())
                    {
                        var uploadParams = new ImageUploadParams()
                        {
                            File = new FileDescription(image.Name, stream),
                            Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face"),
                        };

                        uploadResult = _cloudinary.Upload(uploadParams);
                    }
                }

                photoForCreationDto.Url = uploadResult.Url.ToString();
                photoForCreationDto.PublicId = uploadResult.PublicId;
                photoForCreationDto.DateAdded = DateTime.UtcNow;
                var photo = _mapper.Map<Photo>(photoForCreationDto);

                if (!userFromRepo.Photos.Any(u => u.IsMain))
                {
                    photo.IsMain = true;
                }

                userFromRepo.Photos.Add(photo);
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                listPhotos.Add(photoToReturn);
            }

            if (await _userService.SaveAll())
            {
                return CreatedAtRoute("", new { userId = userId }, listPhotos);
            }

            return BadRequest("Could not add photo");
        }

        [HttpPost("upload-photo")]
        public async Task<IActionResult> AddPhotoForUser(Guid userId, [FromForm] PhotoForCreationDto photoForCreationDto)
        {
            if (!userId.Equals(new Guid(User.FindFirst(ClaimTypes.NameIdentifier).Value)))
            {
                return Unauthorized();
            }

            var userFromRepo = await _userService.GetUser(userId);
            var file = photoForCreationDto.File;
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face"),
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photoForCreationDto.Url = uploadResult.Url.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;
            photoForCreationDto.DateAdded = DateTime.UtcNow;
            var photo = _mapper.Map<Photo>(photoForCreationDto);

            if (!userFromRepo.Photos.Any(u => u.IsMain))
            {
                photo.IsMain = true;
            }

            userFromRepo.Photos.Add(photo);

            if (await _userService.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("", new { userId = userId, id = photo.Id }, photoToReturn);
            }

            return BadRequest("Could not add photo");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(Guid userId, Guid id)
        {
            if (!userId.Equals(new Guid(User.FindFirst(ClaimTypes.NameIdentifier).Value)))
            {
                return Unauthorized();
            }

            var user = await _userService.GetUser(userId);

            if (!user.Photos.Any(p => p.Id.Equals(id)))
            {
                return Unauthorized();
            }

            var photoFromRepo = await _photoService.GetPhoto(id);

            if (photoFromRepo.IsMain)
            {
                return BadRequest("This is already the main photo");
            }

            var currentMainPhoto = await _photoService.GetMainPhotoForUser(userId);
            currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            if (await _photoService.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Could not set photo to main");
        }

        [HttpDelete("{photoId}")]
        public async Task<IActionResult> DeletePhoto(Guid userId, Guid photoId)
        {
            if (!userId.Equals(new Guid(User.FindFirst(ClaimTypes.NameIdentifier).Value)))
            {
                return Unauthorized();
            }

            var user = await _userService.GetUser(userId);

            if (!user.Photos.Any(p => p.Id.Equals(photoId)))
            {
                return Unauthorized();
            }

            var photoFromRepo = await _photoService.GetPhoto(photoId);

            if (photoFromRepo.IsMain)
            {
                return BadRequest("You can not delete main photo");
            }

            if (photoFromRepo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);
                var result = _cloudinary.Destroy(deleteParams);

                if (result.Result.Equals("ok"))
                {
                    _photoService.DeletePhoto(photoFromRepo);
                }
            }
            else
            {
                _photoService.DeletePhoto(photoFromRepo);
            }

            if (await _photoService.SaveAllAsync())
            {
                return Ok();
            }

            return BadRequest("Failed to delete the photo");
        }
    }
}