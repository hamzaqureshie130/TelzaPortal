using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TelzaProject.Application.Features.Clients.Commands.CreateClient;
using TelzaProject.Application.Features.Clients.Commands.DeleteClient;
using TelzaProject.Application.Features.Clients.Commands.UpdateClient;
using TelzaProject.Application.Features.Clients.Queries.GetClientDetails;
using TelzaProject.Application.Features.Clients.Queries.GetClientInvoiceBilling;
using TelzaProject.Application.Features.Clients.Queries.GetClients;

namespace TelzaPortal.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/clients")]
    public class ClientsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ClientsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>Get all clients.</summary>
        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _mediator.Send(new GetClientsQuery()));

        /// <summary>Banking fields to prefill create-invoice (from company / KYC snapshot).</summary>
        [HttpGet("{id:guid}/invoice-billing")]
        public async Task<IActionResult> GetInvoiceBilling(Guid id) =>
            Ok(await _mediator.Send(new GetClientInvoiceBillingQuery { ClientId = id }));

        /// <summary>Get a client by ID.</summary>
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id) =>
            Ok(await _mediator.Send(new GetClientDetailsQuery { Id = id }));

        /// <summary>Create a new client.</summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateClientCommand command)
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>Update an existing client.</summary>
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateClientCommand command)
        {
            command.Id = id;
            return Ok(await _mediator.Send(command));
        }

        /// <summary>Delete a client.</summary>
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteClientCommand { Id = id });
            return NoContent();
        }
    }
}
