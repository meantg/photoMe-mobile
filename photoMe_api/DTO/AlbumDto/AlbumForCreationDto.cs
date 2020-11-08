using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace photoMe_api.DTO
{
    public class AlbumForCreationDto
    {
        public List<IFormFile> Files { get; set; }
        public string Title { get; set; }
        public string AlbumType { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdateAt { get; set; }
    }
}