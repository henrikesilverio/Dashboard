var dataTableSettings = {
    "data": [],
    "dom": "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-12'<'d-flex justify-content-center'p>>>",
    "pageLength": 10,
    "ordering": false,
    "language": {
        "zeroRecords": "Não há registrados",
        "info": "_START_ a _END_ em _TOTAL_ Log(s)",
        "infoEmpty": "",
        "infoFiltered": "(filtrado do total de _MAX_ registros)",
        "search": "Filtrar resultado",
        "paginate": {
            "previous": "",
            "next": ""
        }
    },
    "columns": []
};

var table = {};

$.ajax({
    url: 'https://dashboard-722d3.firebaseio.com/.json',
    success: function (data) {
        data.columns.forEach(function (element) {
            switch (element.displayType) {
                case 0:
                    dataTableSettings.columns.push({
                        "data": element.property,
                        "title": element.value
                    });
                    break;
                case 1:
                    dataTableSettings.columns.push({
                        "data": element.property,
                        "title": element.value,
                        "class": "text-center",
                        "render": buildIcon
                    });
                    break;
                case 2:
                    dataTableSettings.columns.push({
                        "data": element.property,
                        "title": element.value,
                        "class": "text-center",
                        "render": buildBadge
                    });
                    break;
            }
        });
        dataTableSettings.data = data.lines;
        table = $("#dashboard").DataTable(dataTableSettings);
    }
});

function buildBadge(data) {
    switch (data) {
        case 0:
            return "<span class='font-weight-bold text-secondary'>Não definido</span>";
        case 1:
            return "<span class='font-weight-bold text-primary'>Ordinário</span>";
        case 2:
            return "<span class='font-weight-bold text-success'>Normal</span>";
        case 3:
            return "<span class='font-weight-bold text-warning'>Urgente</span>";
        case 4:
            return "<span class='font-weight-bold text-danger'>Emergência</span>";
    }
}

function buildIcon(data) {
    switch (data) {
        case 0:
            return "<span class='fa fa-lg fa-minus text-muted'></span>";
        case 1:
            return "<span class='fa fa-lg fa-circle text-primary'></span>";
        case 2:
            return "<span class='fa fa-lg fa-circle text-success'></span>";
        case 3:
            return "<span class='fa fa-lg fa-circle text-warning'></span>";
        case 4:
            return "<span class='fa fa-lg fa-circle text-danger'></span>";
    }
}

$('#search').keyup(function () {
    table.search($(this).val()).draw();
});

var currentInt = 1;
var interval = {};
var $clock = $("#clock");
var timer = 3000;
var formatClock = function (event) {
    $clock.html(event.strftime('<span>A tela será atualizada em %M minuto(s) %S segundo(s)</span>'));
};
$clock.countdown(new Date().getTime(), formatClock);

$("#automatic-rotation").on("click", function () {
    var pageInfo = table.page.info();

    if (this.checked) {
        interval = setInterval(function () {
            table.page(currentInt).draw('page');
            $clock.countdown(new Date().getTime() + timer, formatClock);
            currentInt++;
            if (currentInt === pageInfo.pages) {
                currentInt = 0;
            }
        }, (timer + 300));
        $clock.countdown(new Date().getTime() + timer, formatClock);
    } else {
        clearInterval(interval);
        $clock.countdown(new Date().getTime(), formatClock);
    }
});