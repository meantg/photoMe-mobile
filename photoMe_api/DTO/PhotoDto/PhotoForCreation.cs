using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace photoMe_api.DTO
{
    public class PhotoForCreationDto
    {
        public string Url { get; set; }
        public IFormFile File { get; set; }
        public List<IFormFile> Files { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public string PublicId { get; set; }
        public string Title { get; set; }

        public PhotoForCreationDto()
        {
            this.DateAdded = DateTime.Now;
        }
    }
}