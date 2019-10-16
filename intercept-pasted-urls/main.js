async function asyncHandler(e){
	e=e.data.filter(w => w.type!=='CARD');
	if(e.length==0) return;
	let addedWidgetsIds = e.map(w => w.id);
	let widgets = (await miro.board.widgets.get()).filter(w => addedWidgetsIds.includes(w.id));
	
	let newWidgets = [];
	let idsToDelete = [];
	widgets.forEach(w=>{
			
			let text;
			if(w.type=='PREVIEW'){
				text = w.url;
			}
			if(w.type=='STICKER'){
				text = w.text;
			}
			if(text.startsWith('https://')|| text.startWith('http://')) {
				let url = text;
				idsToDelete.push(w.id);
				newWidgets.push({
					type: 'CARD',
					title: 'Converted: '+url,
					description: 'Converted: '+url,
					x: w.x,
					y: w.y
				  })
			}
	})
	// it might be better to postpone deletion of these objects until other addons could perform their actions on them post creation. Might be better to hide them from the user and delete them in ~1 second.
	miro.board.widgets.deleteById(idsToDelete);
	
	
	miro.board.widgets.create(newWidgets);
}

miro.onReady(() => {
	miro.addListener('WIDGETS_CREATED', e =>{
		asyncHandler(e);
		
	})
})




