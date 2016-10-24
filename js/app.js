$(function() {
    console.log('Project start!');

    function changeMainView() {
        console.log('Date changed!');
    }

    // Initializing DatePicker
    $('#datepicker')
        .datepicker({})
        .on("changeDate", changeMainView);
});
