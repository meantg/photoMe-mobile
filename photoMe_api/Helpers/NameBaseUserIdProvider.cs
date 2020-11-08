using System;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace photoMe_api.Helpers
{
    public class NameBaseUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            var user = connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return user;
        }
    }
}