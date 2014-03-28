function period(teacher,subject,period) {
  this.teacher = teacher;
  this.subject = subject;
  this.period = period;
}

function createNewPeriod(mk,md,y) {
  var createdPeriod = new period(mk,md,y);
  if ( localStorage.periodCount == undefined ) {
  localStorage.setItem('periodCount', 0) 
  }
  var periodSize = parseInt(localStorage.periodCount) + 1;
  commitToStorage(periodSize,createdPeriod);
}

function commitToStorage(objectCount,newObject) {
  // The unique key of the object:
  var item = 'period_' + objectCount;
  localStorage.setItem('periodCount', objectCount);
  
  // Put the object into storage
  localStorage.setItem(item, JSON.stringify(newObject));
  
  // Create Markup
  createMarkup(newObject);
}

function createMarkup(period,key) {
  $('ul#periods').append(
    '<li id="+id"><a href="#">' + 
      period.period + " - " +
      period.subject + " [" +
      period.teacher + "] " +
    '</a><a href="#edit_panel" data-rel="dialog" data-transition="slideup" onClick="editPeriod(this)" id="' +
	key + '">Edit</a></li>'
  );
}

function editPeriod(per) {
 var period = jQuery.parseJSON(localStorage.getItem(per.id));
  $('div#editPeriod').append(
  	'<legend>Edit Period</legend>' +
        '<div class="clearfix">' +
          '<label for="Period">Period</label>' +
          '<div class="input">' +
            '<input id="period" name="Period" type="text" value="' +
      			period.period + '">' +
          '</div>' +
        '</div><!-- /clearfix -->'        
        //<div class="clearfix">
//          <label for="Teacher">Teacher</label>
//          <div class="input">
//            <input id="teacher" name="Teacher" type="text">
//          </div>
//        </div><!-- /clearfix -->
//        <div class="clearfix">
//          <label for="Subject">Subject</label>
//          <div class="input">
//            <input id="subject" name="Subject" type="text">
//          </div>
//        </div><!-- /clearfix -->
  );
}

function resetForm(formid) {
 $(':input','#'+formid) .not(':button, :submit, :reset, :hidden') .val('') .removeAttr('checked') .removeAttr('selected');
 }

$(function() {

  $("#period_form").submit(function() {
	  	var teacher = $("input#teacher").val();
		var subject = $("input#subject").val();
		var period = $("input#period").val();    
		createNewPeriod(teacher,subject,period);
		resetForm('period_form');
		return false;
	  });

  var periodCount = localStorage.getItem('periodCount');  
  for (i=1;i<=periodCount;i++)
    {
      var number = parseInt(i) + 1;
	  var key = localStorage.key(i);
      var period = jQuery.parseJSON(localStorage.getItem("period_" + i));
	  createMarkup(period,key);
	}
}
);