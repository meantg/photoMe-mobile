using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using photoMe_api.DTO;
using photoMe_api.Models;
using photoMe_api.Services;

namespace photoMe_api.Controllers
{
    [Route("/api/auth/[action]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private IAuthService _authService;
        private IConfiguration _configuration;
        private IMapper _mapper;

        public AuthController(IAuthService authService, IConfiguration configuration, IMapper mapper)
        {
            this._authService = authService;
            this._configuration = configuration;
            this._mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.Password != model.RePassword)
            {
                return BadRequest("Password and RePassword not match");
            }

            model.Username = model.Username.ToLower();

            if (await this._authService.UserExists(model.Username))
            {
                return BadRequest("Username already exists");
            }

            var userToCreate = _mapper.Map<User>(model);
            var createdUser = await this._authService.Register(userToCreate, model.Password);
            var userToReturn = _mapper.Map<UserForDetailDto>(createdUser);

            return StatusCode(201);
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] UserLoginDto model)
        {
            var userFromRepo = await this._authService.Login(model.UserName, model.Password);

            if (userFromRepo == null)
            {
                return Unauthorized();
            }

            var claims = new[]{
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Name),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_configuration.GetSection("AppSettings:SecretKey").Value));

            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds,
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            UserForDetailDto userToReturn = _mapper.Map<UserForDetailDto>(userFromRepo);
            string tokenReturn = tokenHandler.WriteToken(token);
            string userSerialize = JsonConvert.SerializeObject(userToReturn);

            var jsonSerializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            return Ok(JsonConvert.SerializeObject(new {
                token = tokenReturn,
                user = userToReturn
            }, jsonSerializerSettings));
        }
    }
}