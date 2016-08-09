(function(factory) {
    if(typeof define == 'function' && define.amd) {
        // AMD
        define('datatables.batch.multiselect', ['jquery', 'datatables.net','dataTables.select'], function ( $ ) {
            return factory( $, window, document )();
        } );
    } else if ( typeof exports === 'object' ) {
        // CommonJS

        module.exports = function (root, $) {
            if ( ! root ) {
                root = window;
            }

            if ( ! $ || ! $.fn.dataTable ) {
                $ = require('datatables.net')(root, $).$;
            }
            return factory( $, root, root.document )();
        };
    } else  {
        // Browser
        factory( jQuery, window, document );
    };
}(function( $, window, document, undefined ) {
    var DataTable = $.fn.dataTable;

    var init = function(table) {
        var self = this;
        if(!$.fn.dataTable.isDataTable(table)) {
            return;
        }
        var dt = $(table).dataTable().api();

        $(document).on('keydown', function(e) {
            if(e.keyCode == 16) {
                self.pressShift = true;
            }
            if(e.keyCode == 17 || e.keyCode == 91) {
                self.pressCtrl = true;
            }
        });
        $(document).on('keyup', function(e) {
            if(e.keyCode == 16) {
                self.pressShift = false;
            }
            if(e.keyCode == 17 || e.keyCode == 91) {
                self.pressCtrl = false;
            }
        });
        var startIndex = null;
        var endIndex = null;

        $(table).on('click','tr', function() {
            if(!self.pressShift && self.pressCtrl) {
                if(!$(this).hasClass('selected')) {
                    dt.row($(this)).deselect();
                } else {
                    dt.row($(this)).select();
                }
                startIndex = $(this).index();
                return;
            } else if (self.pressShift && !self.pressCtrl) {
                if(startIndex) {
                    endIndex = $(this).index();
                } else {
                    startIndex = $(this).index();
                    return;
                }
                if(startIndex && endIndex) {
                    if(startIndex>endIndex) {
                        var temp = startIndex;
                        startIndex = endIndex;
                        endIndex =temp;
                    }
                    for(var i = startIndex; i <= endIndex;i++) {
                        dt.row($(table).find('tbody tr').eq(i)).select();
                    }
                }
            } else {
                dt.rows( { selected: true } ).deselect()
                dt.row($(this)).select();
                startIndex = $(this).index();
                return;
            }
        });
    }

    var MultiSelect = function() {
        $(document).on( 'preInit.dt.dtr', function (e, settings) {
            console.log('batchSelect initialized');
            if ( e.namespace !== 'dt' ) {
                return;
            }
            if (settings.oInit.select &&
                settings.oInit.select.style == 'multi' &&
                settings.oInit.batchMultiSelect) {
                var table = e.target;
                init(table);
            } else if (settings.oInit.select && settings.oInit.select.style != 'multi') {
                console.error('the initialize parameter of dt select.style should be multi');
            }
        });
    };
    return MultiSelect;

}));