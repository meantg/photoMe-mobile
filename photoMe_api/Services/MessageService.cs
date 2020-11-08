using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using photoMe_api.Models;
using photoMe_api.Repositories;

namespace photoMe_api.Services
{
    public interface IMessageService
    {
        Task<bool> InsertMessage(Message message);
        IEnumerable<Guid> GetUserIdContact(Guid senderId);
        Task<IEnumerable<Message>> GetTalkMessage(Guid senderId, Guid receiverId);
    }
    public class MessageService : IMessageService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly MessageRepository _messageRepository;

        public MessageService(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
            this._messageRepository = unitOfWork.MessageRepository();
        }

        public Task<IEnumerable<Message>> GetTalkMessage(Guid senderId, Guid receiverId)
        {
            return this._messageRepository.GetTalkMessage(senderId, receiverId);
        }

        public IEnumerable<Guid> GetUserIdContact(Guid senderId)
        {
            return this._messageRepository.GetListUserIdContact(senderId);
        }

        public Task<bool> InsertMessage(Message message)
        {
            return this._messageRepository.InsertAsync(message);
        }
    }
}