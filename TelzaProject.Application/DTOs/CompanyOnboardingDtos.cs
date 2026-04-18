namespace TelzaProject.Application.DTOs
{
    public class TradeReferenceDto
    {
        public string TradeReferenceName { get; set; } = string.Empty;
        public string TradeReferenceAddress { get; set; } = string.Empty;
        public string? TradeReferenceNumber { get; set; }
        public string ContactName { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
    }

    public class RegulatoryComplianceDto
    {
        public List<string> BusinessDescriptions { get; set; } = new();
        public string? BusinessDescriptionOtherText { get; set; }

        public string IntermediateProviderRegistryCompanyName { get; set; } = string.Empty;
        public string StirShakenCertCompanyName { get; set; } = string.Empty;
        public string OcnStirShakenHeader { get; set; } = string.Empty;
        public string Fcc499FilerId { get; set; } = string.Empty;

        public bool? RobocallMitigationRegistered { get; set; }
        public string? RobocallMitigationListedCompanyName { get; set; }
        public string? RobocallMitigationDatabaseNumber { get; set; }

        public bool? StirShakenRmdImplemented { get; set; }
        public bool? SigningAllCalls { get; set; }
        public bool? ComplianceUsBankAccount { get; set; }
        public bool? OriginateConversationalTraffic { get; set; }
        public bool? OriginateAutodialedTraffic { get; set; }
        public bool? DirectAutodialClients { get; set; }
        public bool? NonUsAutodialSources { get; set; }
        public bool? ItgTracingEngaged { get; set; }
        public bool? MoreThanThreeTracebacksLastYear { get; set; }
        public bool? MoreThanFourGovImpersonationTracebacks { get; set; }
        public bool? NonCooperativeVspByUsTelecom { get; set; }
        public bool? BlockedFromNetworkLastTwoYears { get; set; }
        public bool? AdverseJudgementUnlawfulRobocalls { get; set; }

        public decimal? EstimatedAsrPercent { get; set; }
        public decimal? EstimatedAloc { get; set; }
        public decimal? EstimatedUnallocated404Percent { get; set; }
        public decimal? EstimatedCancel487Percent { get; set; }
        public decimal? EstimatedShortDurationPercent { get; set; }
    }

    public class CompanyAttestationDto
    {
        public string OfficerName { get; set; } = string.Empty;
        public string SignatureText { get; set; } = string.Empty;
    }
}
