using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using photoMe_api.Repositories;
using Microsoft.Extensions.DependencyInjection;


namespace photoMe_api.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            var userId = resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var repo = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();
            //var user = await repo.GetByIdAsync(new Guid(userId));

            //user.LastActive = DateTime.Now;
            await repo.SaveAll();
        }
    }
}