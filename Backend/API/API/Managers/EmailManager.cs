using API.Interfaces.Managers;
using API.Models;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace API.Managers
{
    public class EmailManager : IEmailManager
    {

        private readonly string email;
        private readonly SmtpClient smtpClient;

        public EmailManager(IOptions<EmailConfiguration> mailSettings)
        {
            email = mailSettings.Value.Mail;
            smtpClient = new SmtpClient
            {
                Host = mailSettings.Value.SmtpHost,
                Port = mailSettings.Value.Port,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(mailSettings.Value.Mail, mailSettings.Value.Password),
                EnableSsl = true
            };
        }

        public async Task SendEmail(string destAddress, string title, string body)
        {
            var newMail = new MailMessage()
            {
                From = new MailAddress(email),
                Subject = title,
                IsBodyHtml = true,
                Body = body,
            };

            newMail.To.Add(new MailAddress(destAddress));
            await smtpClient.SendMailAsync(newMail);
        }
    }
}
