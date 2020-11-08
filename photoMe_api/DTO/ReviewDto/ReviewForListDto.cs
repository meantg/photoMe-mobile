using System;

namespace photoMe_api.DTO.ReviewDto
{
    public class ReviewForListDto
    {
        public Guid Id { get; set; }
        public Guid MakerId { get; set; }
        public Guid AlbumId { get; set; }
        public UserForListDto Maker { get; set; }
        public string ReviewMessage { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}