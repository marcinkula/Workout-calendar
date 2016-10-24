$(function() {
    console.log('Project start!');

    var db = {

    }

    function changeMainView() {
        console.log('Date changed!');
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
        .on("changeDate", changeMainView());
});
