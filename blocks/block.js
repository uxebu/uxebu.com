var md = require('markdown').markdown;

function _prepareBlock(block){
    var obj = {
        h1: [""],
        ul: []
    }
}

exports.trailerBox = function(block){
	var view = {};
	// [ 'h1', 'TEXT' ]
    view.title = block.shift()[1]; // Remove the first element which is the title.
	var items = view.items = [];
	do{
		var el = block.shift();
		if (el[0]=='hr') continue;
		if (el[1].substr(0,1)=="<"){
			items.push({iframe:el[1]});
		} else {
			// todo check
			var lines = el[1].split("\n");
			items.push({twoLineText:true, one:lines[0], two:lines[1]});
		}
	} while(block.length);
	return view;
}

exports.simpleBox = function(block){
	// Summary:
	// 		This is a simple textbox which renders a title, text
    // 		and an optional link at the bottom.
    //
    // Markdown:
    // 		Sample markup:
    //
	// 		Title						| Required
	// 		=====						|
	//								    	|
	// 		Some text.					| Required [+1, at least one]
	//                                  	|
	// 		[Link](http://uxebu.com)	| Optional, if available as last item.
	//
	// Returns:
	// 		title:
	// 		content:
	//		link:

    var view = {};
	// [ 'h1', 'TEXT' ]
    view.title = block.shift()[1]; // Remove the first element which is the title.
    if (block[block.length-1][1][0]=='a'){ // [ 'p', [ 'a', {href: ''}, 'TEXT' ] ] ]
		var link = block.pop();
		// [ 'p', [ 'a', {href: ''}, 'TEXT' ] ] ]
        view.link = link[1][1].href;
		view.linkContent = link[1][2];
    }
    view.content = block.map(function(i){return md.renderJsonML(["html", i]);}).join(" ");
	return view;
};

exports.listBox = function(block){
    var view = {};
    view.title = block.shift()[1]; // Remove the first element which is the title.
    // Now we expect a "ul"
    // We take all the "li"s and pass them separately into the list-array that we iterate over in the tpl.
    view.list = block[0].slice(1).map(function(i){ 
		var split = i[1].split("\n"); 
		return {header:split[0], text:split[1]};
	});
    return view;
}

exports.imageBox = function(block){
	var view = {};
	// [ 'h1', 'TEXT' ]
    view.title = block.shift()[1]; // Remove the first element which is the title.
	view.list = block[0].slice(1).map(function(i){
		var item;
		if (i[1][0] == 'p'){
			item = i[1].slice(1);
		}else if(i[1][0] == 'a'){
			item = i.slice(1);
		}else{
			console.log("Error: Content for imageBox is invalid! Please stick to following markup:\n\n[Name][link]\nTitle\n![Image Alt](imagelink)\n");
		}

		return {
			title: item[0][2].replace('\n', '', "gm"),
			imgSrc: item[2][1].src,
			subtitle: item[1],
			profileUrl: item[0][1].href
		}
	});
	return view;
}

