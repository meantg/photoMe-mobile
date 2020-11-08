using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using photoMe_api.DTO;
using photoMe_api.Helpers;
using photoMe_api.Services;

namespace photoMe_api.Controllers
{
    [Route("/api/user/")]
    [ApiController]
    [Authorize]
    [ServiceFilter(typeof(LogUserActivity))]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            this._userService = userService;
            this._mapper = mapper;
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetUsers([FromQuery] UserParams userParams)
        {
            var currentUserid = new Guid(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await _userService.GetUser(currentUserid);

            userParams.UserId = currentUserid;

            if (!string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";
            }

            var users = await _userService.GetUsers(userParams);

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(usersToReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await _userService.GetUser(id);

            var userToReturn = _mapper.Map<UserForDetailDto>(user);

            userToReturn.Age = DateTime.Now.Year - userToReturn.DateOfBirth.Year;

            return Ok(userToReturn);
        }

        [HttpPost("search")]
        public async Task<IActionResult> SearchUserAsync([FromBody] UserForSearchDto userInput)
        {
            var listUser = await this._userService.SearchUser(userInput.Username);
            var listUserForReturn = new List<UserForListDto>();

            foreach (var user in listUser)
            {
                UserForListDto userToReturn = this._mapper.Map<UserForListDto>(user);
                listUserForReturn.Add(userToReturn);
            }

            if (listUserForReturn != null)
            {
                return Ok(listUserForReturn);
            }

            return BadRequest();
        }
    }
}