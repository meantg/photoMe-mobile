using System;

namespace photoMe_api.Models
{
    public class Like : BaseModel
    {
        public Guid? AlbumId { get; set; }
        public Album Album { get; set; }
        public Guid? MakerId { get; set; }
        public User Maker { get; set; }
    }
}