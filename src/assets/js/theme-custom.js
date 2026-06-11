// File for your custom JavaScript

var customScrollSpy = () => {
  // INITIALIZATION OF SCROLL NAV
  // =======================================================
  var scrollspy = new HSScrollspy($('body'), {
    // !SETTING "resolve" PARAMETER AND RETURNING "resolve('completed')" IS REQUIRED
    beforeScroll: function (resolve) {
      if (window.innerWidth < 992) {
        $('#navbarVerticalNavMenu').collapse('hide').on('hidden.bs.collapse', function () {
          return resolve('completed');
        });
      } else {
        return resolve('completed');
      }
    }
  }).init();
}

// var customInitsPlugins = () => {

//   // INITIALIZATION OF QUICK VIEW POPOVER
//   // =======================================================
//   $('#editUserPopover').popover('show');

//   $(document).on('click', '#closeEditUserPopover', function () {
//     $('#editUserPopover').popover('dispose');
//   });

//   $('#editUserModal').on('show.bs.modal', function () {
//     $('#editUserPopover').popover('dispose');
//   });

//   // DARK POPOVER
//   // =======================================================
//   $('[data-toggle="popover-dark"]').on('shown.bs.popover', function () {
//     $('.popover').last().addClass('popover-dark')
//   });

// }

// Step forms
var initStepFormAddUser = () => {
  $('.js-step-form').each(function () {
    var stepForm = new HSStepForm($(this), {
      finish: function () {
        $("#addUserStepFormProgress").hide();
        $("#addUserStepFormContent").hide();
        $("#successMessageContent").show();
      }
    }).init();
  });
}

var initStepFormCheckOut = () => {
  $('.js-step-form').each(function () {
    var stepForm = new HSStepForm($(this), {
      finish: function () {
        $("#checkoutStepFormProgress").hide();
        $("#checkoutStepFormContent").hide();
        $("#checkoutStepOrderSummary").hide();
        $("#checkoutStepSuccessMessage").show();
      }
    }).init();
  });
}

// Popovers
var initPopover = (selectorPopover, selectorModal, closePopoverSelector) => {
  $(selectorPopover).popover('show')
    .on('shown.bs.popover', function () {
      $('.popover').last().addClass('popover-dark')
    });

  $(document).on('click', closePopoverSelector, function () {
    $(selectorPopover).popover('dispose');
  });

  $(selectorModal).on('show.bs.modal', function () {
    $(selectorPopover).popover('dispose');
  });
}

// Iniciar Mapa
var initLeaflet = () => {
  // INITIALIZATION OF LEAFLET
  // =======================================================
  $('#map').each(function () {
    var leaflet = $.HSCore.components.HSLeaflet.init($(this)[0]);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      id: 'mapbox/light-v9'
    }).addTo(leaflet);
  });
}

// Vector maps con markers
var initVectorMapsMarkers = (markers)=>{
  $('.js-jvectormap').each(function () {
    var jVectorMap = $.HSCore.components.HSJVectorMap.init($(this), {
      markers: markers,
      onRegionTipShow: function(e, el, code){
        let marker = markers.find(function (marker) {
          return marker.code == code
        });

        if (marker) {
          el.html(
            '<span class="d-flex align-items-center mb-2">' +
              '<img class="avatar avatar-xss avatar-circle mr-2" src="' + marker['flag'] + '" alt="Flag">' +
              '<span class="h5 mb-0">' + marker['name'] + '</span>' +
            '</span>' +
            '<dl class="row" style="max-width: 10rem;">' +
              '<dt class="col-sm-6 mb-0">Active:</dt>' +
              '<dd class="col-sm-6 text-sm-right mb-0">' + marker['active'] + '</dd>' +
              '<dt class="col-sm-6 mb-0">New:</dt>' +
              '<dd class="col-sm-6 text-sm-right mb-0">' + marker['new'] + '</dd>' +
            '</dl>'
          );
        } else {
          return false;
        }
      },
      onMarkerTipShow: function(e, el, code){
        el.html(
          '<span class="d-flex align-items-center mb-2">' +
            '<img class="avatar avatar-xss avatar-circle mr-2" src="' + markers[code]['flag'] + '" alt="Flag">' +
            '<span class="h5 mb-0">' + markers[code]['name'] + '</span>' +
          '</span>' +
          '<dl class="row" style="max-width: 10rem;">' +
            '<dt class="col-sm-6 mb-0">Active:</dt>' +
            '<dd class="col-sm-6 text-sm-right mb-0">' + markers[code]['active'] + '</dd>' +
            '<dt class="col-sm-6 mb-0">New:</dt>' +
            '<dd class="col-sm-6 text-sm-right mb-0">' + markers[code]['new'] + '</dd>' +
          '</dl>'
        );
      }
    });
  });
}

var initVectorMap=()=>{
  $('.js-jvectormap').each(function () {
    var jVectorMap = $.HSCore.components.HSJVectorMap.init($(this));
  });
}

// Tablas


// Inicializa tablas que usan exports
var initTable = (selector,buttonexport,select) => {
  return $.HSCore.components.HSDatatables.init($(`#${selector}`), {
    dom: 'Bfrtip',
    buttons: buttonexport?[
      {
        extend: 'copy',
        className: 'd-none'
      },
      {
        extend: 'excel',
        className: 'd-none'
      },
      {
        extend: 'csv',
        className: 'd-none'
      },
      {
        extend: 'pdf',
        className: 'd-none'
      },
      {
        extend: 'print',
        className: 'd-none'
      },
    ]:[],
    select: {
      style: 'multi',
      selector: 'td:first-child input[type="checkbox"]',
      classMap: {
        checkAll: '#datatableCheckAll',
        counter: '#datatableCounter',
        counterInfo: '#datatableCounterInfo'
      }
    },
    language: {
      zeroRecords: '<div class="text-center p-4">' +
        '<img class="mb-3" src="./assets/svg/illustrations/sorry.svg" alt="Image Description" style="width: 7rem;">' +
        '<p class="mb-0">No data to show</p>' +
        '</div>'
    }
  });
}

var initExportButtonsTable = (datatable) => {
  $('#export-copy').click(function () {
    datatable.button('.buttons-copy').trigger()
  });

  $('#export-excel').click(function () {
    datatable.button('.buttons-excel').trigger()
  });

  $('#export-csv').click(function () {
    datatable.button('.buttons-csv').trigger()
  });

  $('#export-pdf').click(function () {
    datatable.button('.buttons-pdf').trigger()
  });

  $('#export-print').click(function () {
    datatable.button('.buttons-print').trigger()
  });

  $('.js-datatable-filter').on('change', function () {
    var $this = $(this),
      elVal = $this.val(),
      targetColumnIndex = $this.data('target-column-index');

    datatable.column(targetColumnIndex).search(elVal).draw();
  });

  $('#datatableSearch').on('mouseup', function (e) {
    var $input = $(this),
      oldValue = $input.val();

    if (oldValue == "") return;

    setTimeout(function () {
      var newValue = $input.val();

      if (newValue == "") {
        // Gotcha
        datatable.search('').draw();
      }
    }, 1);
  });
}

var initTableSearchFilter = (datatable) => {
  $('.js-datatable-filter').on('change', function () {
    var $this = $(this),
      elVal = $this.val(),
      targetColumnIndex = $this.data('target-column-index');

    datatable.column(targetColumnIndex).search(elVal).draw();
  });

  $('#datatableSearch').on('mouseup', function (e) {
    var $input = $(this),
      oldValue = $input.val();

    if (oldValue == "") return;

    setTimeout(function () {
      var newValue = $input.val();

      if (newValue == "") {
        // Gotcha
        datatable.search('').draw();
      }
    }, 1);
  });
}

// Sortable (Reorderable drag-and-drop lists)
var initSortable = () => {
  $('.js-sortable').each(function () {
    var sortable = $.HSCore.components.HSSortable.init($(this), {
      forceFallback: true,
      animation: 0,
      group: 'listGroup',
      delay: 500,
      delayOnTouchOnly: true
    });
  });

  $('.js-sortable-link').click(function (e) {
    if ($(e.target).hasClass('hs-unfold') || $(e.target).parents('.hs-unfold').length) {
      return false;
    }
    // window.location.replace($(this).attr('data-href'))
  });
}

