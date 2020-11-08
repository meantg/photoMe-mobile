using System;
using System.Collections.Generic;

namespace photoMe_api.Models
{
    public class Album : BaseModel
    {
        public string AlbumType { get; set; }
        public Guid? PhotographerId { get; set; }
        public virtual User Photographer { get; set; }
        public Guid? ModelId { get; set; }
        public virtual User Model { get; set; }
        public string Title { get; set; }
        public string ThumbnailPublicId { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<Like> Likes { get; set; }
        public int LikesNumber { get; set; }

        public Album()
        {
            this.Photos = new HashSet<Photo>();
        }
    }
}