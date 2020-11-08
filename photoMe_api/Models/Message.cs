using System;

namespace photoMe_api.Models
{
    public class Message : BaseModel
    {
        public Guid? ReceiverId { get; set; }
        public User Receiver { get; set; }
        public Guid? SenderId { get; set; }
        public User Sender { get; set; }
        public string Content { get; set; }
    }
}