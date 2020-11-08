using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using photoMe_api.Models;
using photoMe_api.Services;

namespace photoMe_api.Controllers
{
    [Route("/api/user/{userId}/likes/")]
    [ApiController]
    [Authorize]
    public class LikeController : ControllerBase
    {
        private readonly ILikeService _likeService;
        private readonly IUserService _userService;

        public LikeController(ILikeService likeService, IUserService userService)
        {
            this._likeService = likeService;
            this._userService = userService;
        }

        [HttpGet("all")]
        public IActionResult GetAllLikesAsync(Guid userId)
        {
            if (!userId.Equals(new Guid(User.FindFirstValue(ClaimTypes.NameIdentifier))))
            {
                return Unauthorized();
            }

            return Ok(this._likeService.GetAllLike());
        }

        [HttpPost("like-album")]
        public async Task<IActionResult> LikeAlbumAsync([FromBody] Like newLike, Guid userId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Model nhập sai!");
            }

            if (await this._likeService.IsAlbumLiked(userId, (Guid)newLike.AlbumId))
            {
                if (await this._likeService.UnlikeAlbum(userId, (Guid)newLike.AlbumId))
                {
                    return Ok();
                }

                return BadRequest("Failed 1");
            }

            if (await this._likeService.LikeAlbum(newLike))
            {
                return Ok(newLike);
            }

            return BadRequest("Like failed");
        }

        [HttpGet("{albumId}")]
        public async Task<IActionResult> GetUserLikeAsync(Guid albumId, Guid userId)
        {
            var likeToReturn = await this._likeService.GetUserLike(userId, albumId);

            return Ok(likeToReturn);
        }
    }
}