// JavaScript Document for PRIDE Planner app
// Initialize WebSQL DB for app
// var db = function("name of database", "version (optional)", "description of database", "size of database");
var db = window.openDatabase("schedule", "", "Student Schedule", 1024*1000);

// ADD new period to database function
// function functionName(field1, field2, field3)
// these fields are the items the user can enter in the form - MAKE sure the names match
function insertPeriod(period, teacher, subject) {
   db.transaction(function(tx) {
      tx.executeSql('INSERT INTO Periods (period, teacher, subject) VALUES (?, ?, ?)', [period, teacher, subject]);
   });
}

// GET list of periods from db
function renderResults(tx, rs) {
	for(var i=0; i < rs.rows.length; i++) {
		r = rs.rows.item(i);
		  // #periods matches the id of the DIV tag in your HTML
		  $('#periods').append(
			  '<li><a href="#period_info?id='+r['id']+'" id="info" data-ajax="false">' +
			  '<h3 id="'+r['id']+'">' + 
			  r['period'] + " Period</h3>" +
			'</li>'
		  );
	}
	// Check if listview is initialized and styled
	// making sure the listview has the correct look after updating the page on the fly
	 var $the_ul = $('ul#periods');
	 if ($the_ul.hasClass('ui-listview')) {
			$the_ul.listview('refresh');
		} else {
			$the_ul.trigger('create');
		}
}

// Display one period for period_info page
// this function shows the results from the getPeriod function
function showResults(tx, rs) {
	for(var i=0; i < rs.rows.length; i++) {
		r = rs.rows.item(i);
			$('#perTitle').html(
			r['period'] + ' Period'
			);
			$('#showPeriod').html(
			  	'<h3 id="'+r['id']+'">' + 
				r['teacher'] + "</h3>" +
				r['subject']
		  );
        }
		$('#perTitle').trigger('create');
}  

// DB function to get one period info to VIEW
// the per variable is grabbed from the URL that the user clicks on
function getPeriod(per) {
  var period = per;
   db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM Periods WHERE id = ?', [period], showResults);
	  });
}

// Initialize form to edit one period
// fields are created after the user clicks on a period to edit
function editResults(tx, rs) {
        for(var i=0; i < rs.rows.length; i++) {
          r = rs.rows.item(i);
	  $('div#editPeriod').append(
  	'<legend>Edit Period</legend>' +
        '<div class="clearfix">' +
          '<label name="Period">Period</label>' +
          '<div class="input">' +
            '<input id="period" name="Period" type="text" value="' +
      			r['period'] + '">' +
          '</div>' +
        '</div><!-- /clearfix -->' +
		'<div class="clearfix">' +
		  '<label for="Teacher">Teacher</label>' +
			'<div class="input">' +
           '<input id="teacher" name="Teacher" type="text" value="' +
      			r['teacher'] + '">' +
          '</div>' +
       '</div><!-- /clearfix -->' +
       '<div class="clearfix">' +
          '<label for="Subject">Subject</label>' +
          	'<div class="input">' +
            '<input id="subject" name="Subject" type="text" value="' +
      			r['subject'] + '">' +
          '</div>' +
        '</div><!-- /clearfix -->' +
    	'<input type="hidden" id="per_id" value="' + r['id'] + '">'  
		  );
		  $('div#editPeriod').trigger('create');
        }
	// check if the EDIT form is initialized
	if($('div#editPeriod').length == 0){
    	var id = $.mobile.pageData.id;
			renderPeriods(id);
			alert(id);
	}	
}  

// Get all periods or one period if ID exits
function renderPeriods(period) {
  db.transaction(function(tx) {
	if (!(period === undefined)) {
	  tx.executeSql('SELECT * FROM Periods WHERE id = ?', [period], editResults);
	} else {
	  tx.executeSql('SELECT * FROM Periods ORDER by period', [], renderResults);
	}
  });
}

// empty ADD period form to be ready for next use of form
function resetForm(formid) {
	$(':input','#'+formid) .not(':button, :submit, :reset, :hidden') .val('') .removeAttr('checked') .removeAttr('selected');
}

// close the EDIT panel and empty it for the next period
function closeEdit() {
  var id = $.mobile.pageData.id;
	  renderPeriods(id);
	  //alert(id);
	$('div#editPeriod').trigger('create');
}
		
// close the EDIT panel and empty it for the next period
function closeReturn() {
   $('#edit_panel').panel({
	  close: function( event, ui ) {
		$('div#editPeriod').empty();
		}
  });
}

// empty the period_info DIV's to be ready for next use
function closeInfo() {
   $('#period_info').page({
	  close: function( event, ui ) {
		$('#perTitle').empty();
		$('#showPeriod').empty();
		}
	});
}

// delete period from db
function deletePeriod(period) {
	db.transaction(function(tx) {
		tx.executeSql('DELETE FROM Periods WHERE id = ?', [period]);
	});
}

// make sure the two tables exist in the db
$(document).ready(function() {
  db.transaction(function(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS Periods(id INTEGER PRIMARY KEY, period TEXT, teacher TEXT, subject TEXT)', []);
	tx.executeSql('CREATE TABLE IF NOT EXISTS Assignments(id INTEGER PRIMARY KEY, per_id INTEGER, date TEXT, info TEXT)', []);
  });

// submit ADD period form
$('#period_form').submit(function() {
	insertPeriod($('#period').val(), $('#teacher').val(), $('#subject').val());
	resetForm('period_form');
	$( "#add_panel" ).panel( "close" );
	$('#periods').empty();
	renderPeriods();
	return false;
});

// if DELETE is clicked 
$('#delete').live('click',function(){
	var id = $( '#per_id' ).val();
	deletePeriod(id);
	resetForm('edit_form');
	$( "#edit_panel" ).panel( "close" );
	$('#periods').empty();
	renderPeriods();
	$( "#editPeriod" ).empty();
	// go back to the schedule_period page
	window.location.href = '#schedule_period'; //load new page
});

// if PERIOD is clicked on get period info & go to next page
$("#period_info").live('pagebeforeshow', function(e) {
	//$("#perTitle").html("Period "+$.mobile.pageData.id);
	$('div#editPeriod').empty();
	var id = $.mobile.pageData.id;
	getPeriod(id);
	renderPeriods(id);
 });
 
// if CANCEL is clicked 
$('#cancel').live('click',function(){
	//$('div#editPeriod').empty();
	var id = $( '#per_id' ).val();
	$( "#edit_panel" ).panel( "close" );
	//closeEdit();
});

// if RETURN is clicked 
$("#return").live('pagebeforeshow', function(e) {
   $('#edit_panel').panel({
	  close: function( event, ui ) {
		$('div#editPeriod').empty();
		}
  });
});

// if EDIT is clicked 
$("#edit").live('pagebeforeshow', function(e) {
		$('div#editPeriod').empty();
		var id = $.mobile.pageData.id;
		renderPeriods(id);
});


// if nothing else happens, at least show the periods
 renderPeriods();
});