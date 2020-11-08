using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace photoMe_api.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatHub : Hub
    {
        public Task SendMessage1(string user, string message, string connectionId)
        {
            return Clients.Client(connectionId).SendAsync("ReceiveOne", user, message);
        }

        public string GetConnectionId(){
            return Context.ConnectionId;
        }

        public string GetUser(){
            var user = (Context.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            return user;
        }
    }
}