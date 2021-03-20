$( document ).ready(function() {
    let motiapp = localStorage.getItem('motiapp');
    if(motiapp === null){
        // add modal for askin user name etc.
        motiapp = {
            "events": []
        }
        localStorage.setItem('motiapp', JSON.stringify(motiapp));
    } 
    dealyed_calculate();
    $('#datetimepicker').datetimepicker();
});

var dealyed_calculate = function(){
    $(".calculating-moti-score").toggle(true)
    $(".moti-score").toggle(false)

    let date_today = new Date();
    setTimeout(function(){
        let score = calculate_moti_score(date_today);
        update_moti_score(score);
    }, 2000);
}

var calculate_moti_score = function(date_to_compare){
    let motiapp = localStorage.getItem('motiapp');
    motiapp = JSON.parse(motiapp);

    let moti_score = 0;
    for(let app_event of motiapp["events"]){
        let day_diff = Math.floor((Date.parse(date_to_compare) - Date.parse(app_event["date"])) / 86400000); 
        for(let event_action of app_event["actions"]){
            moti_score += (event_action["score"]*0.88**day_diff)*event_action["count"]
        }
    }
    return moti_score;
}

var update_moti_score = function(score){
    let recommendation = "It's okay to go play disc golf!"
    if(score < - 5){
        let moti_break_days = calculate_moti_break_days();
        recommendation = "Don't go play disc golf. Recommended motivation break length: " + moti_break_days + " days";
    }
    $(".moti-score").find("h1").text("Motiscore: " + score);
    $(".moti-score").find("p").text(recommendation);
    $(".calculating-moti-score").toggle()
    $(".moti-score").toggle()
}

var calculate_moti_break_days = function(){
    let date_today = new Date();
    for(let days = 1; days < 1000; days++){
        date_today.setDate(date_today.getDate() + days);
        let score = calculate_moti_score(date_today)
        if(score > -1){
            return days;
        }
    }
    return 1000;
}

var add_event = function(){
    console.log("adding event")
    $('#confirmSaveAsNewModal #modalCancel').click(function () {
        $('#addEventModal').modal('hide');
    });
    $('#addEventModal #modalAddEvent').click(function () {
        $('#addEventModal').modal('hide');
        // add event
        let new_event = {
            "name": $("#event-name").val(),
            "date": $('#datetimepicker').datetimepicker('getValue'),
            "actions": []
        }
        $(".event-action").each(function () {
            let text = $(this).find(".action-name").val();
            let score = $(this).find(".action-score").val();
            let count = $(this).find(".action-number").val();
            if (text.length > 0) {
                new_event["actions"].push({
                    "name": text,
                    "score": score,
                    "count": count,
                });
            }
        });
        console.log(new_event)
        let motiapp = JSON.parse(localStorage.getItem('motiapp'));
        motiapp["events"].push(new_event)
        localStorage.setItem('motiapp', JSON.stringify(motiapp));
        dealyed_calculate();
    });
    $('#addEventModal').appendTo("body").modal('show');
}

var delete_event_action = function(element){
    element.closest(".event-action").remove();
}

var add_event_action = function(){
    var action = $("#event-action-template").clone();
    var actions = $("#event-actions");
    var new_id = actions.children().length - 1; //don't count template
    action.removeAttr("hidden");
    action.attr("id", "event_action_" + new_id);
    actions.append(action);
};

var clear_history = function(){
    motiapp = {
        "events": []
    }
    localStorage.setItem('motiapp', JSON.stringify(motiapp));
}