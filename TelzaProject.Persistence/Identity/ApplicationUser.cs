using Microsoft.AspNetCore.Identity;

namespace TelzaProject.Persistence.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public Guid? CompanyId { get; set; }
    }
}
