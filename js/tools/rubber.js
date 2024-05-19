pg.tools.registerTool({
    id: "rubber",
    name: "Rubber",
});

pg.tools.rubber = function () {
    var tool;

	var options = {};

	var activateTool = function() {		
		tool = new Tool();
        var hitOptions = {
			segments: true,
			stroke: true,
			curves: true,
			fill: true,
			guide: false,
			tolerance: 5 / paper.view.zoom
		};

        jQuery('#paperCanvas').addClass('cursor-change');

        tool.onMouseDown = function(event) {
			if(event.event.button > 0) return;  // only first mouse button
			
			var hitResult = paper.project.hitTest(event.point, hitOptions);
			if (hitResult && hitResult.item) {
                var root = pg.item.getRootItem(hitResult.item);
                root.remove();
			}
		};

        tool.activate();
    }

	var deactivateTool = function () {
        jQuery('#paperCanvas').removeClass('cursor-change');
	};

    return {
        options: options,
        activateTool: activateTool,
        deactivateTool: deactivateTool
    };
}