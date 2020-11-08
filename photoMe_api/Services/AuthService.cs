using System.Threading.Tasks;
using photoMe_api.Models;
using photoMe_api.Repositories;

namespace photoMe_api.Services
{
    public interface IAuthService
    {
        Task<User> Login(string username, string password);
        Task<User> Register(User user, string password);
        Task<bool> UserExists(string username);
    }
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly AuthRepository _authRepository;

        public AuthService(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
            this._authRepository = this._unitOfWork.AuthRepository();
        }

        public Task<User> Login(string username, string password)
        {
            return this._unitOfWork.AuthRepository().Login(username, password);
        }

        public Task<User> Register(User user, string password)
        {
            return this._unitOfWork.AuthRepository().Register(user, password);
        }

        public Task<bool> UserExists(string username)
        {
            return this._unitOfWork.AuthRepository().UserExists(username);
        }
    }
}