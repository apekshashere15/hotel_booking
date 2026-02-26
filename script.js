$(document).ready(function () {

    // ========================
    // ROOM PRICES
    // ========================
    let prices = {
        "Single": 3000,
        "Double": 5000,
        "Suite": 8000
    };

    let guestCount = 1;

    // ========================
// ADULTS & CHILDREN COUNTER
// ========================

let adults = 1;
let children = 0;

$("#adultPlus").click(function () {
    if (adults < 5) {
        adults++;
        $("#adultCount").text(adults);
    }
});

$("#adultMinus").click(function () {
    if (adults > 1) {
        adults--;
        $("#adultCount").text(adults);
    }
});

$("#childPlus").click(function () {
    if (children < 5) {
        children++;
        $("#childCount").text(children);
    }
});

$("#childMinus").click(function () {
    if (children > 0) {
        children--;
        $("#childCount").text(children);
    }
});

    // ========================
    // DATEPICKER INITIALIZATION
    // ========================
    $("#checkin").datepicker({
        minDate: 0,
        dateFormat: "yy-mm-dd",
        onSelect: function (selectedDate) {
            let checkinDate = $(this).datepicker('getDate');
            checkinDate.setDate(checkinDate.getDate() + 1);

            $("#checkout").datepicker("option", "minDate", checkinDate);
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

        let checkinVal = $("#checkin").val();
        let checkoutVal = $("#checkout").val();
        let room = $("#roomType").val();

        if (!checkinVal || !checkoutVal || !room) {
            resetPrices();
            return;
        }

        let checkin = new Date(checkinVal);
        let checkout = new Date(checkoutVal);

        if (checkout <= checkin) {
            resetPrices();
            return;
        }

        let nights = (checkout - checkin) / (1000 * 60 * 60 * 24);

        let roomTotal = nights * prices[room];
        let gst = roomTotal * 0.18;
        let grandTotal = roomTotal + gst;

        $("#roomTotal").text(roomTotal.toFixed(2));
        $("#gstAmount").text(gst.toFixed(2));
        $("#grandTotal").text(grandTotal.toFixed(2));
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

        let checkin = new Date($("#checkin").val());
        let checkout = new Date($("#checkout").val());

        if (checkout <= checkin) {
            $("#errorMsg").text("Check-out must be after Check-in date!");
            return;
        }

        $("#errorMsg").text("");

        let details = `
            Room Type: ${$("#roomType").val()} <br>
            Guests: ${guestCount} <br>
            Grand Total: ₹ ${$("#grandTotal").text()}
        `;

        $("#bookingDetails").html(details);

        let modal = new bootstrap.Modal(document.getElementById('bookingModal'));
        modal.show();
    });

});
let totalGuests = adults + children;

let details = `
    Room Type: ${$("#roomType").val()} <br>
    Adults: ${adults} <br>
    Children: ${children} <br>
    Total Guests: ${totalGuests} <br>
    Grand Total: ₹ ${$("#grandTotal").text()}
`;