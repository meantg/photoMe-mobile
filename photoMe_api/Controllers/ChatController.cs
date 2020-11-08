using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using photoMe_api.DTO;
using photoMe_api.Hubs;
using photoMe_api.Models;
using photoMe_api.Services;

namespace photoMe_api.Controllers
{
    [Route("api/chat/")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IMessageService _messageService;
        private readonly IUserService _userService;

        public ChatController(IHubContext<ChatHub> hubContext, IMessageService messageService, IUserService userService)
        {
            this._hubContext = hubContext;
            this._messageService = messageService;
            this._userService = userService;
        }

        [HttpPost("send/{receiverId}")]
        public async Task<IActionResult> SendToSpecificUserAsync([FromBody] MessageDto message, string receiverId){
            var senderId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            Message messageToSave = new Message();
            messageToSave.SenderId = new Guid(senderId);
            messageToSave.ReceiverId = new Guid(receiverId);
            messageToSave.Content = message.Content;

            await this._messageService.InsertMessage(messageToSave);

            await this._hubContext.Clients.Users(senderId, receiverId).SendAsync("SendToSpecificUser", senderId, receiverId, message.Content);

            return Ok(message);
        }

        [HttpGet("get-list-contact")]
        public IActionResult GetListContact(){
            var senderId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            IEnumerable<Guid> result = this._messageService.GetUserIdContact(new Guid(senderId));

            return Ok(result);
        }

        [HttpGet("get-talk-messages/{receiverId}")]
        public async Task<IActionResult> GetTalkMessagesAsync(Guid receiverId){
            var senderId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await this._messageService.GetTalkMessage(new Guid(senderId), receiverId);

            return Ok(result);
        }
    }
}