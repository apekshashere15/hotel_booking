$(document).ready(function () {

    // ========================
    // ROOM PRICES
    // ========================
    const prices = {
        "Single": 3000,
        "Double": 5000,
        "Suite": 8000
    };

    let adults = 1;
    let children = 0;

    // ========================
    // COUNTER LOGIC
    // ========================
    function updateCounters() {
        $("#adultCount").text(adults);
        $("#childCount").text(children);
        calculatePrice(); // Recalculate if guest counts affect logic later
    }

    $("#adultPlus").click(function () {
        if (adults < 5) { adults++; updateCounters(); }
    });

    $("#adultMinus").click(function () {
        if (adults > 1) { adults--; updateCounters(); }
    });

    $("#childPlus").click(function () {
        if (children < 5) { children++; updateCounters(); }
    });

    $("#childMinus").click(function () {
        if (children > 0) { children--; updateCounters(); }
    });

    // ========================
    // DATEPICKER LOGIC
    // ========================
    $("#checkin").datepicker({
        minDate: 0,
        dateFormat: "yy-mm-dd",
        onSelect: function (selectedDate) {
            // Set minDate for checkout to be at least 1 day after checkin
            let nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            $("#checkout").datepicker("option", "minDate", nextDay);
            calculatePrice();
        }
    });

    $("#checkout").datepicker({
        minDate: 1,
        dateFormat: "yy-mm-dd",
        onSelect: calculatePrice
    });

    // ========================
    // PRICE CALCULATION
    // ========================
    function calculatePrice() {
        const checkinVal = $("#checkin").val();
        const checkoutVal = $("#checkout").val();
        const room = $("#roomType").val();

        if (!checkinVal || !checkoutVal || !room) {
            resetPrices();
            return;
        }

        const checkin = new Date(checkinVal);
        const checkout = new Date(checkoutVal);

        if (checkout <= checkin) {
            resetPrices();
            return;
        }

        // Calculate nights
        const timeDiff = checkout.getTime() - checkin.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

       const totalGuests = adults + children;
const roomTotal = nights * prices[room] * totalGuests;
        const gst = roomTotal * 0.18;
        const grandTotal = roomTotal + gst;

        $("#roomTotal").text(roomTotal.toLocaleString('en-IN'));
        $("#gstAmount").text(gst.toLocaleString('en-IN'));
        $("#grandTotal").text(grandTotal.toLocaleString('en-IN'));
    }

    function resetPrices() {
        $("#roomTotal").text("0");
        $("#gstAmount").text("0");
        $("#grandTotal").text("0");
    }

    $("#roomType").change(calculatePrice);

    // ========================
    // FORM SUBMISSION
    // ========================
    $("#bookingForm").submit(function (e) {
        e.preventDefault();
        
        const roomType = $("#roomType").val();
        const grandTotal = $("#grandTotal").text();

        if (!$("#checkin").val() || !$("#checkout").val()) {
            $("#errorMsg").text("Please select your travel dates.");
            return;
        }

        if (!roomType || grandTotal === "0") {
            $("#errorMsg").text("Please select a room type and valid dates.");
            return;
        }

        $("#errorMsg").text(""); // Clear errors

        // Generate Summary
        const details = `
            <div class="text-start px-3">
                <strong>Room:</strong> ${roomType} <br>
                <strong>Stay:</strong> ${$("#checkin").val()} to ${$("#checkout").val()} <br>
                <strong>Guests:</strong> ${adults} Adults, ${children} Children <br>
                <hr>
                <h5 class="text-center text-success">Total Paid: ₹ ${grandTotal}</h5>
            </div>
        `;

        $("#bookingDetails").html(details);

        const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
        modal.show();
    });
});