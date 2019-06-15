var dataTableSettings = {
    "data": [],
    "dom": "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-12'<'d-flex justify-content-center'p>>>",
    "pageLength": 8,
    "language": {
        "zeroRecords": "Não há registrados",
        "info": "_START_ a _END_ em _TOTAL_ Log(s)",
        "infoEmpty": "",
        "infoFiltered": "(filtrado do total de _MAX_ registros)",
        "search": "Filtrar resultado",
        "paginate": {
            "previous": "Anterior",
            "next": "Próximo"
        }
    },
    "columns": [
        { "data": "company", "width": "30%" },
        { "data": "substation", "width": "25%" },
        { "data": "active", "width": "10%", "class": "text-center" },
        { "data": "status", "width": "5%", "class": "text-center", "render": buildBadge },
        { "data": "temp", "width": "5%", "class": "text-center", "render": buildIcon },
        { "data": "gas", "width": "5%", "class": "text-center", "render": buildIcon },
        { "data": "bush", "width": "5%", "class": "text-center", "render": buildIcon },
        { "data": "signals", "width": "5%", "class": "text-center", "render": buildIcon },
        { "data": "oltc", "width": "5%", "class": "text-center", "render": buildIcon },
        { "data": "membrane", "width": "5%", "class": "text-center", "render": buildIcon }
    ]
};

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

var table = $("#dashboard").DataTable(dataTableSettings);

//Sem definição = 0
//Azul = 1,
//Verde = 2,
//Amarelo = 3,
//Vermelho = 4
for (var i = 0; i < 100; i++) {
    table.rows.add([{
        "company": "CPFL Renováveis " + i,
        "substation": "SUBES " + i,
        "active": "TRE " + i,
        "status": (i % 5),
        "temp": (i % 5),
        "gas": i % 5,
        "bush": i % 5,
        "signals": i % 5,
        "oltc": i % 5,
        "membrane": i % 5
    }]);
}

table.draw();

$('#search').keyup(function () {
    table.search($(this).val()).draw();
});

var pageInfo = table.page.info();
var currentInt = 0;
var interval = {};
var $clock = $("#clock");
var formatClock = function (event) {
    $clock.html(event.strftime('A tela será atualizada em <span>%H hora(s) %M minuto(s) %S segundo(s)</span>'));
};

$("#automatic-rotation").on("click", function () {
    if (this.checked) {
        interval = setInterval(function () {
            table.page(currentInt).draw('page');
            $clock.countdown(new Date().getTime() + 2000, formatClock);
            currentInt++;
            if (currentInt === pageInfo.pages) {
                currentInt = 0;
            }
        }, 2200);
    } else {
        clearInterval(interval);
        $clock.countdown('stop').html("");
    }
});