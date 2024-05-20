const PORT = 3000;

const socket = io();
// const socket = io.connect(`http://localhost:${PORT}`);

let paperCanvas = document.getElementById("paperCanvas");
paperCanvas.addEventListener("mouseup", (e) => {
    console.log("Gửi");
    let jsonString = paper.project.exportJSON({ asString: true });
    socket.emit("send-mouseup", jsonString);
})

socket.on("receive-mouseup", (jsonString) => {
    console.log("Nhận");
    const activeLayerId = paper.project.activeLayer.data.id;
    paper.project.clear();
    paper.project.importJSON(jsonString);
    pg.layer.reinitLayers(activeLayerId);
})