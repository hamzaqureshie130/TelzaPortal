namespace TelzaProject.Infrastructure.Mail
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        public Task SendEmailAsync(string to, string subject, string body)
        {
            // TODO: Implement SMTP email sending
            Console.WriteLine($"[EmailService] To: {to}, Subject: {subject}");
            return Task.CompletedTask;
        }
    }
}
