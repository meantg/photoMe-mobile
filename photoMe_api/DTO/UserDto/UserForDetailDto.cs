using System;
using System.Collections.Generic;
using photoMe_api.Models;

namespace photoMe_api.DTO
{
    public class UserForDetailDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string KnownAs { get; set; }
        public DateTime LastActive { get; set; }
        public int Age { get; set; }
        public DateTime CreatedAt { get; set; }
        public Photo Avatar { get; set; }
        public ICollection<Album> Albums { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}