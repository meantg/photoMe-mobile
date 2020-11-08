using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using photoMe_api.Data;
using photoMe_api.Helpers;
using photoMe_api.Models;

namespace photoMe_api.Repositories
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<User> GetUser(Guid id);
        Task<PagedList<User>> GetUsers(UserParams userParams);
        Task<IEnumerable<User>> SearchUser(string username);
    }
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }
        public async Task<User> GetUser(Guid id)
        {
            var user = await context.Users.Include(p => p.Photos).Include(u => u.PhotographerAlbums).FirstOrDefaultAsync(u => u.Id.Equals(id));

            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = context.Users.Include(p => p.Photos).AsQueryable();

            users = users.Where(u => u.Id != userParams.UserId);

            //users = users.Where(u => u.Gender == userParams.Gender);

            // if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            // {
            //     var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            //     var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

            //     users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            // }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<IEnumerable<User>> SearchUser(string username)
        {
            return await this.dbSet.Where(u => u.Name.Contains(username)).ToListAsync();
        }
    }
}