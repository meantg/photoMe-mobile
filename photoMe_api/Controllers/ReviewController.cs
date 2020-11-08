using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using photoMe_api.DTO;
using photoMe_api.DTO.ReviewDto;
using photoMe_api.Models;
using photoMe_api.Services;

namespace photoMe_api.Controllers
{
    [ApiController]
    [Route("/api/review/")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        private readonly IMapper _mapper;

        public ReviewController(IReviewService reviewService, IMapper mapper)
        {
            this._reviewService = reviewService;
            this._mapper = mapper;
        }

        [HttpPost("new-review")]
        public async Task<IActionResult> ReviewAlbumAsync([FromBody] Review newReview)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Input is invalid");
            }

            if (await this._reviewService.ReviewAlbum(newReview))
            {
                ReviewForListDto reviewToReturn = this._mapper.Map<ReviewForListDto>(newReview);
                return Ok(reviewToReturn);
            }

            return BadRequest("Failed to review album");
        }

        [HttpGet("{albumId}")]
        public async Task<IActionResult> GetAlbumReivews(Guid albumId)
        {
            var reviewList = await this._reviewService.GetAlbumReviews(albumId);

            if (reviewList != null)
            {
                var listReviewReturn = new List<ReviewForListDto>();

                foreach (Review review in reviewList)
                {
                    var reviewToReturn = this._mapper.Map<ReviewForListDto>(review);
                    var userForList = this._mapper.Map<UserForListDto>(review.Maker);

                    reviewToReturn.Maker = userForList;
                    listReviewReturn.Add(reviewToReturn);
                }
                return Ok(listReviewReturn);
            }

            return BadRequest("Failed to get reviews");
        }
    }
}