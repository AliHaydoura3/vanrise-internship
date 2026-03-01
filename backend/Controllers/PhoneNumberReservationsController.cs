using Microsoft.AspNetCore.Mvc;
using DeviceInventory.Models;
using DeviceInventory.Data;
using System;
using System.Collections.Generic;

namespace DeviceInventory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhoneNumberReservationsController : ControllerBase
    {
        private readonly IPhoneNumberReservationRepository _repo;

        public PhoneNumberReservationsController(IPhoneNumberReservationRepository repo)
        {
            _repo = repo;
        }

        // GET /api/phonenumberreservations?clientId=1&phoneNumberId=2
        [HttpGet]
        public ActionResult<IEnumerable<PhoneNumberReservationDTO>> GetReservations(
            [FromQuery] int? clientId = null,
            [FromQuery] int? phoneNumberId = null)
        {
            var results = _repo.GetReservations(clientId, phoneNumberId);
            return Ok(results);
        }

        // GET /api/phonenumberreservations/active?clientId=1
        [HttpGet("active")]
        public ActionResult<IEnumerable<PhoneNumberReservationDTO>> GetActiveReservations(
            [FromQuery] int? clientId = null)
        {
            var results = _repo.GetActiveReservations(clientId);
            return Ok(results);
        }

        // POST /api/phonenumberreservations  — reserve a phone number for a client
        [HttpPost]
        public ActionResult<PhoneNumberReservation> CreateReservation([FromBody] PhoneNumberReservation reservation)
        {
            if (reservation == null || reservation.ClientId == 0 || reservation.PhoneNumberId == 0)
                return BadRequest("ClientId and PhoneNumberId are required.");

            reservation.BED = DateTime.Now;
            reservation.EED = null;

            var created = _repo.AddReservation(reservation);
            return CreatedAtAction(nameof(GetReservations), null, created);
        }

        // POST /api/phonenumberreservations/unreserve  — end the active reservation
        [HttpPost("unreserve")]
        public ActionResult Unreserve([FromBody] UnreserveRequest request)
        {
            if (request == null || request.ClientId == 0 || request.PhoneNumberId == 0)
                return BadRequest("ClientId and PhoneNumberId are required.");

            var ok = _repo.UnreservePhoneNumber(request.ClientId, request.PhoneNumberId);
            if (!ok) return NotFound("No active reservation found for the given client and phone number.");
            return NoContent();
        }

        // DELETE /api/phonenumberreservations/5
        [HttpDelete("{id}")]
        public ActionResult DeleteReservation(int id)
        {
            var ok = _repo.DeleteReservation(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}

