var dataTableSettings = {
    "data": [],
    "dom": "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-12'<'d-flex justify-content-center'p>>>",
    "pageLength": 10,
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

$.extend(jQuery.fn.dataTableExt.oSort, {
    "icon-pre": function (a) {
        if (a.indexOf("muted") >= 0) {
            return 0;
        }
        if (a.indexOf("primary") >= 0) {
            return 1;
        }
        if (a.indexOf("success") >= 0) {
            return 2;
        }
        if (a.indexOf("warning") >= 0) {
            return 3;
        }
        if (a.indexOf("danger") >= 0) {
            return 4;
        }
    },

    "icon-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "icon-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

$.ajax({
    url: 'https://dashboard-722d3.firebaseio.com/.json',
    success: function (data) {
        data.columns.forEach(function (element) {
            if (element.icon) {
                dataTableSettings.columns.push({
                    "data": element.property,
                    "title": element.value,
                    "class": "text-center",
                    "type": "icon",
                    "render": buildIcon
                });
            } else {
                dataTableSettings.columns.push({
                    "data": element.property,
                    "title": element.value
                });
            }
        });
        dataTableSettings.data = data.lines;
        table = $("#dashboard").DataTable(dataTableSettings);
    }
});

function buildBadge(data) {
    switch (data) {
        case 0:
            return "<span class='badge badge-secondary'>Não definido</span>";
        case 1:
            return "<span class='badge badge-primary'>Ordinário</span>";
        case 2:
            return "<span class='badge badge-success'>Normal</span>";
        case 3:
            return "<span class='badge badge-warning'>Urgente</span>";
        case 4:
            return "<span class='badge badge-danger'>Emergência</span>";
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
var formatClock = function (event) {
    $clock.html(event.strftime('<span>A tela será atualizada em %M minuto(s) %S segundo(s)</span>'));
};
$clock.countdown(new Date().getTime(), formatClock);

$("#automatic-rotation").on("click", function () {
    var pageInfo = table.page.info();

    if (this.checked) {
        interval = setInterval(function () {
            table.page(currentInt).draw('page');
            $clock.countdown(new Date().getTime() + 3000, formatClock);
            currentInt++;
            if (currentInt === pageInfo.pages) {
                currentInt = 0;
            }
        }, 3300);
        $clock.countdown(new Date().getTime() + 3000, formatClock);
    } else {
        clearInterval(interval);
        $clock.countdown(new Date().getTime(), formatClock);
    }
});