// Đăng ký một tool
pg.tools.registerTool({
   id: "image",
   name: "Image",
});

pg.tools.image = function () {
   var tool;

   var options = {
      image: "",
   };

   var components = {};

   var imageItem;
   var toolMode = 'create';
   var creationPoint;
   var raster = new Raster();

   var activateTool = function () {
      // Biến đại diện cho việc có đang chọn 1 item hay không
      var hitItem = null;
				
		var hitOptions = {
			segments: true,
			stroke: true,
			curves: true,
			fill: true,
			guide: false,
			tolerance: 8 / paper.view.zoom
		};

      // Lấy các tuỳ chọn đã lưu trừ local storage
      options = pg.tools.getLocalOptions(options);

      // Khai báo các biên và sử dụng công cụ vẽ lên màn hình
      tool = new Tool();

      // Ban đầu khi ảnh nhập vào nó sẽ ở chính giữa
      creationPoint = paper.view.center;

      tool.onMouseMove = function(event) {

      };

      tool.onMouseDown = function (event) {
      	var hitResult = paper.project.hitTest(event.point, hitOptions);
      	if(hitResult && hitResult.item) {
      		var root = pg.item.getRootItem(hitResult.item);
				if(root.data.isImageItem) {
					hitItem = root;
               console.log("Item là một ảnh!");

               if(toolMode == 'edit') {
                  console.log("Hả?");
                  // finalizeInput();
               }

               if(toolMode == 'create') {
                  toolMode = 'edit';

                  pg.selection.clearSelection();
                  pg.selection.setItemSelection(hitItem, true);
                  handleSelectedItem(hitItem);
                  console.log("Đã chọn được ảnh");
               }

				} else {
					hitItem = null;
               console.log("Item không là một ảnh!");
				}
      	} else {
      		hitItem = null;
            toolMode = 'create';
            console.log("Không phát hiện được Item nào!");
            jQuery("#imageImportFakeButton").text("Choose");
            pg.selection.clearSelection();
      	}
      };

      // setupInputField();

      // Tạo bảng tuỳ chọn cấu hình của công cụ
      pg.toolOptionPanel.setup(options, components, function () {});

		var selectedItems = pg.selection.getSelectedItems();
		if(selectedItems.length > 0 && selectedItems[0].data.isPGTextItem) {
			handleSelectedItem(selectedItems[0]);
			toolMode = 'edit';
		}

      setupImageImportSection();
      renderImage(creationPoint);

      tool.activate();
   };

   // Khởi tạo ô import hình ảnh
   var setupImageImportSection = function () {
      // Khởi tạo các mục chọn
      var $imageImportLabel = jQuery("<label>Image:</label>");
      var $imageImportButton = jQuery(
         '<input id="imageImportInput" type="file" accept=".png, .jpeg, .jpg" >'
      );
      var $imageImportFakeButton = jQuery(
         '<button class="imageImportFakeButton" id="imageImportFakeButton">Choose</button>'
      );

      // Gắn mục chọn vào menu
      var $imageImportSection = jQuery(
         '<div class="option-section" data-id="imageImport">'
      );
      $imageImportSection.append(
         $imageImportLabel,
         $imageImportButton,
         $imageImportFakeButton
      );
      jQuery(".toolOptionPanel .options").prepend($imageImportSection);
   };

   var createItem = function(image, pos) {
      options.raster = new Raster();
   }

   var renderImage = function (pos) {
      jQuery("#imageImportInput").on("change", function (e) {
         options.image = e.target.files[0];
         if (options.image) {
            jQuery("#imageImportFakeButton").text(options.image.name);
   
            // Tạo URL cho file ảnh
            var imageUrl = URL.createObjectURL(options.image);

            raster.source = imageUrl;
            raster.position = pos;
            raster.data.isImageItem = true;
            raster.data.image = options.image;
            // Giải phóng URL khi không còn sử dụng
            // raster.onLoad = function () {
            //    URL.revokeObjectURL(imageUrl);
            // };
         }
      });
   };

   // Xử lí việc chọn
   var handleSelectedItem = function (selectedItem) {
      console.log(selectedItem.data);
      options.image = selectedItem.data.image;
      
      jQuery("#imageImportFakeButton").text(selectedItem.data.image.name);
      raster = selectedItem;
   };

   var finalizeInput = function () {
		var $textInput = jQuery('#textToolInput');
		if ($textInput.val() === '') {
			textItem.remove();
			
		} else {
			creationPoint = paper.view.center;
			textItem = null;
			$textInput.val('');
			pg.undo.snapshot('textcreated');
		}
		toolMode = 'create';
	};

   return {
      options: options,
      activateTool: activateTool,
   };
};
