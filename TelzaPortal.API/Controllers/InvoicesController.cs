using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TelzaProject.Application.Features.Invoices.Commands.CreateInvoice;
using TelzaProject.Application.Features.Invoices.Commands.DeleteInvoice;
using TelzaProject.Application.Features.Invoices.Commands.UpdateInvoice;
using TelzaProject.Application.Features.Invoices.Queries.GetInvoiceDetails;
using TelzaProject.Application.Features.Invoices.Queries.GetInvoices;

namespace TelzaPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/invoices")]
    public class InvoicesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public InvoicesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>Get all invoices.</summary>
        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _mediator.Send(new GetInvoicesQuery()));

        /// <summary>Get invoice by ID with full details including items.</summary>
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id) =>
            Ok(await _mediator.Send(new GetInvoiceDetailsQuery { Id = id }));

        /// <summary>Create a new invoice with items.</summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateInvoiceCommand command)
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>Update invoice header fields (client, date, tax, status).</summary>
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateInvoiceCommand command)
        {
            command.Id = id;
            return Ok(await _mediator.Send(command));
        }

        /// <summary>Delete an invoice and all its items.</summary>
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteInvoiceCommand { Id = id });
            return NoContent();
        }
    }
}
