namespace TelzaProject.Application.DTOs
{
    public class CompanyBankingInfoDto
    {
        public bool HasUsBankAccount { get; set; }
        public string? BankName { get; set; }
        public string? BankAddress { get; set; }
        public string? ContactName { get; set; }
        public string? ContactPhone { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactFax { get; set; }
        public string? AccountNumber { get; set; }
    }
}
