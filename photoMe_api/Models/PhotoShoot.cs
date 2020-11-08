using System;

namespace photoMe_api.Models
{
    public class PhotoShoot : BaseModel
    {
        public Guid? PhotographerId { get; set; }
        public User Photographer { get; set; }
        public Guid? ModelId { get; set; }
        public User Model { get; set; }
        public string Location { get; set; }
        public int Price { get; set; }
    }
}