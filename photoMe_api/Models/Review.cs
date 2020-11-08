using System;
using System.Text.Json.Serialization;

namespace photoMe_api.Models
{
    public class Review : BaseModel
    {
        public Guid? MakerId { get; set; }
        [JsonIgnore]
        public User Maker { get; set; }
        public Guid? AlbumId { get; set; }
        public Album Album { get; set; }
        public string ReviewMessage { get; set; }
        public float Stars { get; set; }
    }
}