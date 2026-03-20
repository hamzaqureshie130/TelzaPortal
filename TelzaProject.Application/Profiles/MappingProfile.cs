using AutoMapper;
using TelzaProject.Application.DTOs;
using TelzaProject.Application.Features.Clients.Commands.CreateClient;
using TelzaProject.Application.Features.Clients.Commands.UpdateClient;
using TelzaProject.Application.Features.Invoices.Commands.CreateInvoice;
using TelzaProject.Application.Features.Invoices.Commands.UpdateInvoice;
using TelzaProject.Domain.Entities;

namespace TelzaProject.Application.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ─── Client ──────────────────────────────────────────────────────
            CreateMap<Client, ClientDto>();
            CreateMap<CreateClientCommand, CreateClientDto>();
            CreateMap<CreateClientDto, Client>()
                .ForMember(d => d.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(d => d.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));
            CreateMap<UpdateClientDto, Client>();
            CreateMap<UpdateClientCommand, Client>()
                .ForMember(d => d.Invoices, opt => opt.Ignore())
                .ForMember(d => d.CreatedAt, opt => opt.Ignore());

            // ─── Invoice ─────────────────────────────────────────────────────
            CreateMap<Invoice, InvoiceDto>()
                .ForMember(d => d.ClientName, opt => opt.MapFrom(s => s.Client != null ? s.Client.Name : string.Empty))
                .ForMember(d => d.Items, opt => opt.MapFrom(s => s.InvoiceItems));
            CreateMap<CreateInvoiceCommand, CreateInvoiceDto>();
            CreateMap<CreateInvoiceDto, Invoice>()
                .ForMember(d => d.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(d => d.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(d => d.InvoiceItems, opt => opt.Ignore())
                .ForMember(d => d.InvoiceNumber, opt => opt.Ignore())
                .ForMember(d => d.Subtotal, opt => opt.Ignore())
                .ForMember(d => d.Total, opt => opt.Ignore());
            CreateMap<UpdateInvoiceCommand, Invoice>()
                .ForMember(d => d.InvoiceItems, opt => opt.Ignore())
                .ForMember(d => d.InvoiceNumber, opt => opt.Ignore())
                .ForMember(d => d.Subtotal, opt => opt.Ignore())
                .ForMember(d => d.Total, opt => opt.Ignore())
                .ForMember(d => d.CreatedAt, opt => opt.Ignore());

            // ─── InvoiceItem ──────────────────────────────────────────────────
            CreateMap<InvoiceItem, InvoiceItemDto>();
            CreateMap<CreateInvoiceItemDto, InvoiceItem>()
                .ForMember(d => d.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(d => d.Total, opt => opt.MapFrom(s => s.Quantity * s.UnitPrice))
                .ForMember(d => d.Invoice, opt => opt.Ignore())
                .ForMember(d => d.InvoiceId, opt => opt.Ignore());

            // ─── KYC Application ──────────────────────────────────────────────
            CreateMap<KycApplication, KycApplicationDto>()
                .ForMember(d => d.ProductSelections, opt => opt.MapFrom(s => s.ProductSelections));

            // CompanyDetails
            CreateMap<CompanyDetails, CompanyDetailsDto>().ReverseMap()
                .ForMember(d => d.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(d => d.KycApplication, opt => opt.Ignore())
                .ForMember(d => d.KycApplicationId, opt => opt.Ignore());

            // BillingInformation
            CreateMap<BillingInformation, BillingInformationDto>().ReverseMap()
                .ForMember(d => d.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(d => d.KycApplication, opt => opt.Ignore())
                .ForMember(d => d.KycApplicationId, opt => opt.Ignore());

            // TechnicalInformation
            CreateMap<TechnicalInformation, TechnicalInformationDto>().ReverseMap()
                .ForMember(d => d.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(d => d.KycApplication, opt => opt.Ignore())
                .ForMember(d => d.KycApplicationId, opt => opt.Ignore());

            // ProductSelection
            CreateMap<ProductSelection, ProductSelectionDto>().ReverseMap()
                .ForMember(d => d.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(d => d.KycApplication, opt => opt.Ignore())
                .ForMember(d => d.KycApplicationId, opt => opt.Ignore());
        }
    }
}
