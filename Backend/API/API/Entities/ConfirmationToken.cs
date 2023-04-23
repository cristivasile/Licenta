using System;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public enum ConfirmationTokenTypeEnum
    {
        EmailConfirmation, 
        PasswordChange
    }

    public class ConfirmationToken : Entity
    {
        [Key]
        public string Token { get; set; }
        [Required]
        public ConfirmationTokenTypeEnum Type { get; set; }
        [Required]
        public string UserId { get; set; }
        [Required]
        public DateTime CreationTime { get; set; }
        public virtual User User { get; set; }
    }
}
