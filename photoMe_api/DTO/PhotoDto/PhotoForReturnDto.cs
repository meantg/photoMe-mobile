using System;

namespace photoMe_api.DTO
{
     public class PhotoForReturnDto
    {
        public Guid Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public string PublicId { get; set; }
        public bool IsMain { get; set; }

        public PhotoForReturnDto()
        {
            this.DateAdded = DateTime.Now;
        }
    }
}