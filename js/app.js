$(function() {
    console.log('Project start!');

    // http://momentjs.com/
    // Set up start date
    $('#selected-date').html(moment().format('YYYY-mm-DD'));

    // Mock up DB
    var db = {
        "2016-10-24" : {
            parties: {
                "back" : ["podciaganie"]
            }
        },
        "2016-10-23" : {
            parties: {
                "legs" : ["przysiady"]
            }
        }
    };

    function changeMainView() {
        // http://bootstrap-datepicker.readthedocs.io/en/latest/markup.html
        var selectedDate = $('#datepicker').datepicker('getFormattedDate');
        console.log('selectedDate: ', selectedDate);
        $('#selected-date').html(selectedDate);
    }

    function today() {
        return new Date();//local date of computer un js
    }

    // Initializing DatePicker
    $('#datepicker')
        .datepicker({
            startView: 0,
            format: "yyyy-mm-dd"
        })
        .on("changeDate", changeMainView);
});
