namespace TelzaProject.Domain.Enums
{
    public enum ProductType
    {
        VOIP = 1,
        DiallerServer = 2,
        InboundDID = 3,
        TFN = 4,
        AIBots = 5
    }

    public enum KycStatus
    {
        Pending = 1,
        UnderReview = 2,
        Approved = 3,
        Rejected = 4
    }

    public enum CorporateType
    {
        SoleProprietorship = 1,
        LLC = 2,
        Corporation = 3,
        Partnership = 4,
        Other = 5,
        NonProfit = 6
    }
}
