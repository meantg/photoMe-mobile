using System;
using System.ComponentModel.DataAnnotations;

namespace photoMe_api.DTO
{
    public class UserRegisterDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 8, ErrorMessage = "You must specify password at least 8 character!")]
        public string Password { get; set; }
        [Required]
        public string RePassword { get; set; }
        public DateTime Created { get; set; }
        
        public UserRegisterDto()
        {
            Created = DateTime.Now;
        }
    }
}