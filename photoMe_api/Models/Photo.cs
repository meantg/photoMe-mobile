using System;

namespace photoMe_api.Models
{
    public class Photo : BaseModel
    {
        public string Url { get; set; }
        public Guid? AlbumId { get; set; }
        public Album Album { get; set; }
        public Guid? UserId { get; set; }
        public string PublicId { get; set; }
        public string Description { get; set; }
        public User User { get; set; }
        public bool IsMain { get; set; }
    }
}