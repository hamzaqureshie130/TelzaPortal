using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TelzaProject.Application.DTOs;
using TelzaProject.Application.Features.InvoiceItems.Commands.AddInvoiceItems;
using TelzaProject.Application.Features.InvoiceItems.Commands.DeleteInvoiceItem;

namespace TelzaPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    public class InvoiceItemsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public InvoiceItemsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>Add multiple items to an existing invoice. Recalculates invoice totals.</summary>
        [HttpPost("api/invoices/{invoiceId:guid}/items")]
        public async Task<IActionResult> AddItems(Guid invoiceId, [FromBody] List<CreateInvoiceItemDto> items)
        {
            var command = new AddInvoiceItemsCommand
            {
                InvoiceId = invoiceId,
                Items = items
            };
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        /// <summary>Delete a single invoice item. Recalculates invoice totals.</summary>
        [HttpDelete("api/items/{id:guid}")]
        public async Task<IActionResult> DeleteItem(Guid id)
        {
            await _mediator.Send(new DeleteInvoiceItemCommand { Id = id });
            return NoContent();
        }
    }
}
